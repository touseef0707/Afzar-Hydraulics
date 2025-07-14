"""
app.py
-------
Flask API that receives a flowsheet JSON payload, runs the
hydraulic solver, and sends the calculation report back to
the React front-end (or any other client).
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

# Local helper functions
from helpers import execute_flowsheet, print_hydraulic_report

app = Flask(__name__)

# CORS: restrict to the front-end origin during development
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
)

# ──────────────────────────────────────────────────────────
# CORS headers for every response (optional but handy)
# ──────────────────────────────────────────────────────────
@app.after_request
def add_cors_headers(response):           # noqa: D401
    response.headers["Access-Control-Allow-Origin"]      = "http://localhost:3000"
    response.headers["Access-Control-Allow-Headers"]     = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"]     = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


# ──────────────────────────────────────────────────────────
# Main API endpoint
# ──────────────────────────────────────────────────────────
@app.route("/api/run", methods=["POST", "OPTIONS"])
def run_flowsheet():                      # noqa: D401
    # Pre-flight request (handled by most browsers before POST)
    if request.method == "OPTIONS":
        return "", 204

    # 1 ─ Parse JSON body
    try:
        flowsheet = request.get_json(force=True)
    except Exception:
        return jsonify(error="Malformed JSON body"), 400

    if not isinstance(flowsheet, dict) or \
       "nodes" not in flowsheet or "edges" not in flowsheet:
        return jsonify(
            error="Payload must contain top-level 'nodes' and 'edges'"
        ), 400

    # 2 ─ Execute hydraulic calculations
    try:
        report = execute_flowsheet(flowsheet)
        print_hydraulic_report(report)
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    except Exception:
        app.logger.exception("Flow-sheet solve failed")
        return jsonify(error="Internal server error"), 500

    # 3 ─ Success
    return jsonify(report), 200


# ──────────────────────────────────────────────────────────
# Convenience health check
# ──────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():                             # noqa: D401
    return jsonify(status="ok"), 200


# ──────────────────────────────────────────────────────────
# Run the development server
# ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    # In production use gunicorn / uwsgi; keep debug=True for dev
    app.run(host="0.0.0.0", port=5000, debug=True)
