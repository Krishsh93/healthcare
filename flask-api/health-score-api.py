from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Load the trained models
model_sleep = joblib.load('model_sleep.pkl')
model_water = joblib.load('model_water.pkl')

# Define your scoring functions
def calculate_sleep_score(sleep_duration, quality_of_sleep):
    sleep_score = 0
    if sleep_duration >= 8:
        sleep_score += 20
    elif sleep_duration >= 7:
        sleep_score += 15
    elif sleep_duration >= 6:
        sleep_score += 10
    
    if quality_of_sleep >= 8:
        sleep_score += 20
    elif quality_of_sleep >= 7:
        sleep_score += 15
    elif quality_of_sleep >= 6:
        sleep_score += 10
    
    return min(sleep_score, 50)

def calculate_water_score(physical_activity_level, stress_level):
    water_score = 0
    if physical_activity_level >= 80:
        water_score += 20
    elif physical_activity_level >= 60:
        water_score += 15
    elif physical_activity_level >= 50:
        water_score += 10
    
    if stress_level <= 3:
        water_score += 20
    elif stress_level <= 5:
        water_score += 15
    elif stress_level <= 7:
        water_score += 10
    
    return min(water_score, 50)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        sleep_duration = data.get('sleep_duration', 0)
        quality_of_sleep = data.get('quality_of_sleep', 0)
        physical_activity_level = data.get('physical_activity_level', 0)
        stress_level = data.get('stress_level', 0)
        daily_steps = data.get('daily_steps', 0)
        bmi_category = data.get('bmi_category', 'Normal Weight')  # Default to 'Normal Weight'
        
        # Define your BMI categories as used during model training
        bmi_categories = ['Underweight', 'Normal Weight', 'Overweight', 'Obese']
        
        # Create a DataFrame for the input
        input_data = pd.DataFrame({
            'Sleep Duration': [sleep_duration],
            'Quality of Sleep': [quality_of_sleep],
            'Physical Activity Level': [physical_activity_level],
            'Stress Level': [stress_level],
            'Daily Steps': [daily_steps]
        })
        
        # Add missing BMI category columns
        for category in bmi_categories:
            input_data[f'BMI Category_{category}'] = 0
        input_data[f'BMI Category_{bmi_category}'] = 1
        
        # Reorder columns to match training data
        X_columns = [col for col in model_sleep.feature_names_in_ if col in input_data.columns]
        input_data = input_data.reindex(columns=X_columns, fill_value=0)
        
        # Predict using the trained models
        sleep_prediction = model_sleep.predict(input_data)[0]
        water_prediction = model_water.predict(input_data)[0]
        
        # Calculate scores based on input values
        sleep_score = calculate_sleep_score(sleep_duration, quality_of_sleep)
        water_score = calculate_water_score(physical_activity_level, stress_level)
        
        # Total score out of 100
        total_score = sleep_score + water_score
        
        # Score interpretation
        sleep_message = "You need to improve your sleep." if sleep_score < 40 else "Your sleep is fine."
        water_message = "You need to increase your water intake." if water_score < 40 else "Your water intake is fine."
        
        return jsonify({
            'health_score': total_score,
            'sleep_message': sleep_message,
            'water_message': water_message
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
