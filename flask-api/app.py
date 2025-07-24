from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime

# Local helper functions
from helpers import execute_flowsheet, print_hydraulic_report
from dotenv import load_dotenv

load_dotenv()  # Load .env variables into os.environ

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# CORS: restrict to the front-end origin during development
CORS(
    app,
    resources={r"/api/*": {"origins": frontend_origin}},
    supports_credentials=True,
)

# ──────────────────────────────────────────────────────────
# CORS headers for every response
# ──────────────────────────────────────────────────────────
@app.after_request
def add_cors_headers(response):
    """Add CORS headers to every response."""
    response.headers["Access-Control-Allow-Origin"] = frontend_origin
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response

# ──────────────────────────────────────────────────────────
# Request validation middleware
# ──────────────────────────────────────────────────────────
@app.before_request
def validate_request():
    """Basic request validation."""
    if request.method == "POST" and request.path == "/api/run":
        if not request.is_json:
            return jsonify(error="Content-Type must be application/json"), 415

# ──────────────────────────────────────────────────────────
# Main API endpoint
# ──────────────────────────────────────────────────────────
@app.route("/api/run", methods=["POST", "OPTIONS"])
def run_flowsheet():
    """Execute hydraulic calculations for the provided flowsheet."""
    # Pre-flight request
    if request.method == "OPTIONS":
        return "", 204

    # 1. Parse and validate JSON body
    try:
        flowsheet = request.get_json(force=True)
        logger.info(f"Received flowsheet at {datetime.utcnow().isoformat()}")
    except Exception as e:
        logger.error(f"JSON parsing error: {str(e)}")
        return jsonify(error="Malformed JSON body"), 400

    # Validate required structure
    if not isinstance(flowsheet, dict):
        return jsonify(error="Payload must be a JSON object"), 400

    required_keys = {"nodes", "edges"}
    if not required_keys.issubset(flowsheet.keys()):
        return jsonify(
            error=f"Payload must contain top-level keys: {', '.join(required_keys)}"
        ), 400

    # 2. Execute hydraulic calculations
    try:
        start_time = datetime.utcnow()
        report = execute_flowsheet(flowsheet)
        # print_hydraulic_report(report)
    except ValueError as exc:
        logger.warning(f"Validation error: {str(exc)}")
        return jsonify(error=str(exc)), 400
    except Exception as e:
        logger.exception("Flow-sheet solve failed")
        return jsonify(
            error="Internal server error",
            details=str(e)
        ), 500

    # 3. Return success response
    return jsonify(report), 200

# ──────────────────────────────────────────────────────────
# Enhanced health check
# ──────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    """Comprehensive health check endpoint."""
    return jsonify({
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "hydraulic-calculator",
        "version": "1.0"
    }), 200

# ──────────────────────────────────────────────────────────
# Error handlers
# ──────────────────────────────────────────────────────────
@app.errorhandler(404)
def not_found(error):
    return jsonify(error="Resource not found"), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Server error: {str(error)}")
    return jsonify(error="Internal server error"), 500

# ──────────────────────────────────────────────────────────
# Run the development server
# ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Use PORT from environment or default to 5000
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")