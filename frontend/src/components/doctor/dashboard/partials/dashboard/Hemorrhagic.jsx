import React, { useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data);
      setError(null);
    } catch (err) {
      setError("Error uploading the file.");
      console.error(err);
    }
  };

  const getChartData = () => {
    if (!prediction) return {};

    const normalPercentage = prediction[0][0].toFixed(4)*100 || 0;
    const hemorrhagicPercentage = prediction[0][1].toFixed(4)*100 || 0;

    return {
      labels: ['Healthy', 'Possible Hemorrhage'],
      datasets: [{
        data: [normalPercentage, hemorrhagicPercentage],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      }],
    };
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload an Image for Prediction</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {prediction && (
        <div className="mt-4 w-full max-w-xs">
          <h2 className="text-xl font-semibold mb-2">Prediction Results:</h2>
          <Pie data={getChartData()} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
