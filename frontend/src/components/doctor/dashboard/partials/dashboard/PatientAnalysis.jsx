import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
function PatientAnalysis() {
    const data = [
        { name: 'Jan', visits: 4000, cases: 2400 },
        { name: 'Feb', visits: 3000, cases: 2210 },
        // ... other months
      ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Box 1: Total Patients */}
      <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800">Total Patients</h3>
        <p className="text-3xl font-bold text-green-500">350</p>
      </div>

      {/* Box 2: Active Cases */}
      <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800">Active Cases</h3>
        <p className="text-3xl font-bold text-yellow-500">120</p>
      </div>

      {/* Box 3: Recovered Patients */}
      <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800">Recovered Patients</h3>
        <p className="text-3xl font-bold text-blue-500">230</p>
      </div>

      {/* Box 4: Patients by Region (Example Chart) */}
      <div className="col-span-1 lg:col-span-2 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
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
        {/* Insert your chart component here */}
      </div>

      {/* Box 5: Daily Visits (Example Chart) */}
      <div className="col-span-1 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
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
        {/* Insert your chart component here */}
      </div>
    </div>
  );
}

export default PatientAnalysis;
