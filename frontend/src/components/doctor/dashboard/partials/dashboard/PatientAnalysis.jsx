import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Hemorrhagic from './Hemorrhagic';
import { Pie, Line } from 'react-chartjs-2';
import SymptomForm from './SymptomForm';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import HealthScore from './HealthScore';
import MedicalDataForm from './BloodSample';
function PatientAnalysis({ selectedPatient }) {
  const patientEmail = selectedPatient.email;

  const [showHemorrhagic, setShowHemorrhagic] = useState(false);
  const [showPatientAnalysis, setShowPatientAnalysis] = useState(true);
  const [showDiseasePrediction, setShowDiseasePrediction] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [showHealthScore, setShowHealthScore] = useState(false);
  const [showBloodSample, setShowBloodSample] = useState(false);

  const fetchhistoricalData = async () => {
    try {
      const historyResponse = await axios.get(process.env.REACT_APP_API + `/patient/${patientEmail}`, {
        email: patientEmail,
      });
      setHistoricalData(historyResponse.data);
    } catch (err) { console.error(err); }
  }
  useEffect(() => {
    fetchhistoricalData();

  }, []);

  const getLineChartData = () => {

    const dates = historicalData.healthReport?.predictions?.map((data) => new Date(data.date).toLocaleDateString());
    const normalValues = historicalData.healthReport?.predictions?.map((data) => data.normalPercentage);
    const hemorrhageValues = historicalData.healthReport?.predictions?.map((data) => data.hemorrhagicPercentage);

    console.log(dates, normalValues, hemorrhageValues);
    return {
      labels: dates,
      datasets: [
        {
          label: 'Healthy Percentage',
          data: normalValues,
          borderColor: '#4CAF50',
          fill: false,
        },
        {
          label: 'Hemorrhage Percentage',
          data: hemorrhageValues,
          borderColor: '#F44336',
          fill: false,
        }
      ],
    };
  };
  return (

    <>
      <h1 className="text-3xl font-semibold mb-2">Patient Name: {selectedPatient.profile?.name?.FName}</h1>
      {showHemorrhagic && (
        <Hemorrhagic showPatientAnalysis={showPatientAnalysis} setShowPatientAnalysis={setShowPatientAnalysis} setShowHemorrhagic={setShowHemorrhagic} showHemorrhagic={showHemorrhagic} patientEmail={patientEmail} fetchhistoricalData={fetchhistoricalData} historicalData={historicalData} getLineChartData={getLineChartData} />
      )}
      {showDiseasePrediction && (<SymptomForm setShowPatientAnalysis={setShowPatientAnalysis} setShowDiseasePrediction={setShowDiseasePrediction}/>)}
      {showHealthScore && (<HealthScore patientEmail={patientEmail} setShowHealthScore={setShowHealthScore} setShowPatientAnalysis={setShowPatientAnalysis}/>)}
      {showBloodSample && (<MedicalDataForm/>)}
      {showPatientAnalysis && (
        <div>
        <div className="flex gap-4 mb-6 ml-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setShowPatientAnalysis(false);
              setShowHemorrhagic(true);
            }}
          >
            Go to Hemorrhage Diagnosis
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setShowPatientAnalysis(false);
              setShowDiseasePrediction(true);
            }}
          >
            Disease Prediction
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setShowPatientAnalysis(false);
              setShowHealthScore(true);
            }}
          >
            AI Matrices Analysis
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setShowPatientAnalysis(false);
              setShowBloodSample(true);
            }}
          >
            AI Blood Sample Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ml-4 mr-4">
          {/* Box 1: Patient Age */}
          <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Age</h3>
            <p className="text-3xl font-bold text-green-500">{selectedPatient.profile?.age || '20'}</p>
          </div>

          {/* Box 2: Water Intake */}
          <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Water Intake</h3>
            <p className="text-3xl font-bold text-yellow-500">{historicalData.waterIntake || '3'} L</p>
          </div>

          {/* Box 3: Sleep Hours */}
          <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Sleep Hours</h3>
            <p className="text-3xl font-bold text-blue-500">{historicalData.sleepHours || '8'} hrs</p>
          </div>
        </div>
          {/* Button to show Hemorrhagic Component */}
          

          {/* Box 4: Patients by Region (Example Chart) */}
          {/* <div className="col-span-1 lg:col-span-2 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Patients by Region</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                <Line type="monotone" dataKey="cases" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div> */}

          {/* Box 5: Daily Visits (Example Chart) */}
          {/* <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Daily Visits</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                <Line type="monotone" dataKey="cases" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div> */}
          <div className='flex'>
          {console.log(historicalData)}
          {historicalData && (
            <div className="mt-4 w-full ml-5">
              <h2 className="text-xl font-semibold mb-2">Previous Diagnosis History:</h2>
              <ResponsiveContainer width="80%" height={400}>
              <Line data={getLineChartData()} />
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 mr-5">Health Score:</h2>
                    {/* <div>
                        <p className="text-lg font-semibold">{result.sleep_message}</p>
                        <p className="text-lg font-semibold">{result.water_message}</p>
                    </div>
                    <br /> */}
                    <div className="mb-4"style={{ width: 375, height: 375,alignItems:'center',marginRight:'50px' }}>
                        <CircularProgressbar
                            value={historicalData.HealthScore || 0}
                            text={`${historicalData.HealthScore || 0}`}
                                    
                            styles={buildStyles({
                                pathColor: '#4a90e2',
                                textColor: '#4a90e2',
                                trailColor: '#d6d6d6',
                                textSize: '18px',
                                strokeWidth: 8,
                            })}
                        />
                    </div>
                    

                </div>
                
        </div>
        </div>
      )}
    </>
  );
}

export default PatientAnalysis;