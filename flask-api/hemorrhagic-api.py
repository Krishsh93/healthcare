import tensorflow as tf
from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS 
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the Keras model
model = tf.keras.models.load_model('hemorrhage_detection_model.h5')

# Define the target size for the image
target_size = (128, 128)

def preprocess_image(image_file):
    # Load the image
    image = Image.open(io.BytesIO(image_file.read()))
    
    # Convert to grayscale if required
    image = image.convert('L')
    
    # Resize the image
    image = image.resize(target_size)
    
    # Convert image to numpy array and normalize
    image_array = np.array(image) / 255.0
    
    # Expand dimensions to fit model input
    image_array = np.expand_dims(image_array, axis=0)
    image_array = np.expand_dims(image_array, axis=-1)  # Add channel dimension for grayscale
    
    return image_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    # Preprocess the image
    preprocessed_image = preprocess_image(file)
    
    # Predict using the model
    predictions = model.predict(preprocessed_image)
    
    # Return the predictions
    return jsonify(predictions.tolist())

if __name__ == '__main__':
    app.run(debug=True)
