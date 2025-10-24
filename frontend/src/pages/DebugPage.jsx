import React, { useState } from 'react';
import api from '../services/api';

const DebugPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/health');
      setHealthData(response.data);
      console.log('Health:', response.data);
    } catch (err) {
      setError(err.message);
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Frontend Debug Page</h1>
      <p className="mb-4">Frontend OK</p>
      
      <button
        onClick={checkHealth}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Check Health'}
      </button>

      {healthData && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold">Health Response:</h3>
          <pre className="mt-2 text-sm">{JSON.stringify(healthData, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <h3 className="font-bold">Error:</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DebugPage;
