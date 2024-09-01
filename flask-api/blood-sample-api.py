from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

# Load the model and scaler
model = joblib.load('blood_model.pkl')
scaler = joblib.load('scaler (1).pkl')

app = Flask(__name__)
CORS(app)

# Define normal ranges for each feature
NORMAL_RANGES = {
    'RBC': (4.5, 5.9),  # Example range in million cells per microliter
    'PCV': (40.0, 52.0),  # Example range in percentage
    'MCV': (80.0, 100.0),  # Example range in femtoliters
    'MCH': (27.0, 31.0),  # Example range in picograms
    'RDW': (11.5, 14.5),  # Example range in percentage
    'TLC': (4.0, 11.0),  # Example range in thousand cells per microliter
    'PLT /mm3': (150.0, 450.0),  # Example range in thousand cells per microliter
    'HGB': (13.5, 17.5),  # Example range in grams per deciliter for males
    'Age': (0, 120),  # Example range for age
    'Sex': (0, 1),  # Assuming 0 = Female, 1 = Male
    'MCHC': (32.0, 36.0)  # Example range in grams per deciliter
}

def is_within_normal_ranges(data):
    for feature, value in data.items():
        if feature in NORMAL_RANGES:
            min_val, max_val = NORMAL_RANGES[feature]
            if not (min_val <= value <= max_val):
                return False
    return True

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the request
    data = request.json
    rbc = data.get('RBC', 0)
    pcv = data.get('PCV', 0)
    mcv = data.get('MCV', 0)
    mch = data.get('MCH', 0)
    rdw = data.get('RDW', 0)
    tlc = data.get('TLC', 0)
    plt_mm3 = data.get('PLT/mm3', 0)
    hgb = data.get('HGB', 0)
    age = data.get('Age', 0)
    sex = data.get('Sex', 0)
    mchc = data.get('MCHC', 0)

    # Creating a DataFrame
    df = pd.DataFrame({
        'RBC': [rbc],
        'PCV': [pcv],
        'MCV': [mcv],
        'MCH': [mch],
        'RDW': [rdw],
        'TLC': [tlc],
        'PLT /mm3': [plt_mm3],
        'HGB': [hgb],
        'Age': [age],
        'Sex': [sex],
        'MCHC': [mchc]
    })

    # Check if all values are within normal ranges
    if is_within_normal_ranges(df.iloc[0]):
        return jsonify({'disease': 'Values are within normal ranges. No disease detected.'})

    # Scale the features
    # features_scaled = scaler.transform(df)
    # print(features_scaled)

    # Make predictions
    cluster = model.predict(df)[0]

    # Map cluster to disease type
    cluster_to_disease = {
        0: 'Diabetes',
        1: 'Anemia',
        2: 'Infections',
        3: 'Liver Disease',
        4: 'Kidney Disease',
        5: 'Thyroid Disorders',
        6: 'Heart Disease',
        7: 'Autoimmune Diseases',
        8: 'Cancer'
    }
    disease = cluster_to_disease.get(cluster, 'Unknown Disease')

    return jsonify({'disease': disease})

if __name__ == '__main__':
    app.run(debug=True)
