from flask import Flask, jsonify, request
from flask_cors import CORS 
from components import Feed, Pipe
from components.base import Component

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

def index():
    # This is an example of how to run the components.
    # In a real application, you might trigger this from a specific API endpoint.

    # 1. Create a data feed
    text_feed = Feed(name="Text Feed", data_source="hello world, this is a test.")

    # 2. Create a destination component to receive the final data
    output_component = Component(name="Output Handler")

    # 3. Create a pipe to connect the feed to the output
    processing_pipe = Pipe(name="Main Pipe", source=text_feed, destination=output_component)

    # 4. Start the data flow
    processing_pipe.flow()

    return "Component flow executed! Check your console for output."

if __name__ == '__main__':
    app.run(port=5000, debug=True)
