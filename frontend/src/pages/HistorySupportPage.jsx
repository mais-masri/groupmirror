import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const HistorySupportPage = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/moods/history');
      setMoodHistory(response.data);
    } catch (error) {
      setError('Failed to load mood history');
      console.error('Error fetching mood history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mood History & Support</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {moodHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No mood history found</p>
              <p className="text-sm text-gray-400">
                Start tracking your moods to see your history here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moodHistory.map((mood) => (
                <div key={mood._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {new Date(mood.date).toLocaleDateString()}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      mood.rating >= 7 ? 'bg-green-100 text-green-800' :
                      mood.rating >= 4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mood.rating}/10
                    </span>
                  </div>
                  {mood.notes && (
                    <p className="text-gray-600 text-sm">{mood.notes}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    {mood.tags && mood.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mood.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Support Resources</h3>
            <p className="text-blue-800 text-sm mb-3">
              If you're experiencing persistent low moods, consider reaching out to:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Mental health professionals</li>
              <li>• Support groups in your community</li>
              <li>• Crisis helplines (988 in the US)</li>
              <li>• Trusted friends and family</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySupportPage;