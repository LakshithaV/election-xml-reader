import React, { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlContent = e.target.result;
        const parser = new XMLParser();
        try {
          const result = parser.parse(xmlContent);
          setData(result);
          setError(null);
        } catch (err) {
          setError('Error parsing XML file');
          console.error('Error parsing XML:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setData(null);
    setError(null);
    setFileInputKey(Date.now());
  };

  const renderTable = () => {
    if (!data) return null;

    const results = data.result.by_party.root.map((party, index) => (
      <tr key={index} className="hover:bg-gray-100">
        <td className="px-4 py-2 border">{party.party_name}</td>
        <td className="px-4 py-2 border">{party.vote_count}</td>
        <td className="px-4 py-2 border">{party.vote_percentage}</td>
        <td className="px-4 py-2 border">{party.seat_count}</td>
      </tr>
    ));

    return (
      <>
        <h1 className="text-2xl font-semibold mb-4">Electoral District: {data.result.ed_name}</h1>
        <h2 className="text-xl font-semibold mb-4">Polling Division: {data.result.pd_name}</h2>
        <table className="min-w-full bg-white border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Party Name</th>
              <th className="px-4 py-2 border">Vote Count</th>
              <th className="px-4 py-2 border">Vote Percentage</th>
              <th className="px-4 py-2 border">Seat Count</th>
            </tr>
          </thead>
          <tbody>{results}</tbody>
        </table>
      </>
    );
  };

  return (
    <div className="App p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Upload XML File</h2>
      <input
        key={fileInputKey}
        type="file"
        accept=".xml"
        onChange={handleFileUpload}
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={handleClear}
        className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Clear
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6">
        {renderTable()}
      </div>
    </div>
  );
}
