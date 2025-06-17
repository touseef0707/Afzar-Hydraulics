from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/sum', methods=['POST'])
def sum_numbers():
    data = request.get_json()
    if not data or 'numbers' not in data:
        return jsonify({'error': 'Please provide numbers array'}), 400
    
    try:
        numbers = data['numbers']
        if not isinstance(numbers, list):
            return jsonify({'error': 'Numbers should be an array'}), 400
            
        result = sum(numbers)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)