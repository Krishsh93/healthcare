from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)
# Load the trained model
model = joblib.load('disease_name.pkl')  # Ensure this path is correct

# Define all symptoms. Ensure this list contains exactly 132 unique symptoms.
all_symptoms = np.array([
    'itching', 'skin_rash', 'continuous_sneezing', 'shivering',
    'stomach_pain', 'acidity', 'vomiting', 'indigestion',
    'muscle_wasting', 'patches_in_throat', 'fatigue',
    'weight_loss', 'sunken_eyes', 'cough', 'headache',
    'chest_pain', 'back_pain', 'weakness_in_limbs', 'chills',
    'joint_pain', 'yellowish_skin', 'constipation',
    'pain_during_bowel_movements', 'breathlessness', 'cramps',
    'weight_gain', 'mood_swings', 'neck_pain', 'muscle_weakness',
    'stiff_neck', 'pus_filled_pimples', 'burning_micturition',
    'bladder_discomfort', 'high_fever', 'nodal_skin_eruptions',
    'ulcers_on_tongue', 'restlessness', 'dehydration', 'dizziness',
    'weakness_of_one_body_side', 'lethargy', 'nausea', 'abdominal_pain',
    'pain_in_anal_region', 'sweating', 'bruising', 'cold_hands_and_feets',
    'anxiety', 'knee_pain', 'swelling_joints', 'blackheads',
    'foul_smell_of_urine', 'skin_peeling', 'blister', 'dischromic_patches',
    'spotting_urination', 'passage_of_gases', 'extra_marital_contacts',
    'irregular_sugar_level', 'family_history', 'lack_of_concentration',
    'excessive_hunger', 'altered_sensorium', 'dark_urine', 'yellowing_of_eyes',
    'distention_of_abdomen', 'irritation_in_anus', 'swollen_legs', 'swollen_blood_vessels',
    'unsteadiness', 'inflammatory_nails', 'yellow_crust_ooze', 'muscle_pain',
    'receiving_blood_transfusion', 'acute_liver_failure', 'rusty_sputum',
    'redness_of_eyes', 'fast_heart_rate', 'swollen_extremeties',
    'dryness_of_mouth', 'polyuria', 'throat_irritation', 'scurring',
    'small_dents_in_nails', 'red_sore_around_nose', 'yellow_urine',
    'swollen_face', 'swollen_ankles', 'skin_rash', 'persistent_cough',
    'sore_throat', 'nasal_congestion', 'fever', 'chest_tightness',
    'joint_stiffness', 'loss_of_appetite', 'rapid_weight_loss',
    'joint_swelling', 'painful_urination', 'dry_cough', 'muscle_cramps',
    'heavy_bleeding', 'skin_wounds', 'dark_spots', 'excessive_thirst',
    'frequent_urination', 'tiredness', 'jaundice', 'paleness',
    'poor_appetite', 'difficulty_breathing', 'fluid_retention', 'sweaty_palms',
    'fainting', 'giddiness', 'blurred_vision', 'leg_cramps',
    'chronic_fatigue', 'burning_sensation', 'frequent_bowel_movements',
    'persistent_hiccups', 'hair_loss', 'painful_swellings', 'ear_pain',
    'stomach_cramps', 'indigestion', 'abdominal_bloating', 'chronic_itching',
    'pain_in_joints', 'chronic_fever', 'difficulty_swallowing', 'painful_cough'
])


def symptoms_to_vector(user_symptoms, all_symptoms):
    # Initialize a vector of zeros with length equal to the number of symptoms
    user_symptoms = [symptom.replace(' ', '_') for symptom in user_symptoms]
    symptom_vector = np.zeros(len(all_symptoms))
    
    # Set positions of symptoms that are present in the user_symptoms list to 1
    for symptom in user_symptoms:
        if symptom in all_symptoms:
            index = np.where(all_symptoms == symptom)[0]
            if index.size > 0:
                symptom_vector[index[0]] = 1
                
    return symptom_vector

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_symptoms = data.get('symptoms', [])
    
    if not user_symptoms:
        return jsonify({'error': 'No symptoms provided'}), 400
    
    # Convert symptoms to vector
    symptom_vector = symptoms_to_vector(user_symptoms, all_symptoms)
    
    # Ensure the vector length matches the model's expected input feature size
    if len(symptom_vector) != 132:  # Expected size of the feature vector
        return jsonify({'error': f'Feature size mismatch: Expected 132, but got {len(symptom_vector)}'}), 400
    
    # Make a prediction using the model
    prediction = model.predict([symptom_vector])
    
    # Convert the NumPy array to a Python list if needed
    prediction_list = prediction.tolist()
    
    # Return the prediction as a JSON response
    return jsonify({'predicted_label': prediction_list})

if __name__ == '__main__':
    app.run(debug=True)