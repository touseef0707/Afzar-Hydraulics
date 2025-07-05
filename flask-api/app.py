from flask import Flask, jsonify

app = Flask('__name__')

@app.route('/api/data')
def get_data():
    # Example data; replace with actual logic
    return jsonify({"message": "Hello from Flask!"})



if __name__ == '__main__':
    app.run(port=8000)
