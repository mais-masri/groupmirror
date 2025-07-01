import React from 'react';

const HistorySupportPage = () => {
  const supportQuotes = [
    "Every feeling is valid—you're not alone.",
    "Growth comes when we share and reflect together."
  ];

  const calendarDays = [
    { mood: '😊', bg: 'bg-yellow-100' },
    { mood: '😊', bg: 'bg-green-100' },
    { mood: '😐', bg: 'bg-blue-100' },
    { mood: '😔', bg: 'bg-pink-100' },
    { mood: '😟', bg: 'bg-red-100' },
    { mood: '😊', bg: 'bg-yellow-100' },
    { mood: '😊', bg: 'bg-green-100' }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">History & Support</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Support Wall</h3>
            {supportQuotes.map((quote, index) => (
              <blockquote key={index} className="p-4 mb-4 border-l-4 border-primary bg-gray-50">
                "{quote}"
              </blockquote>
            ))}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Calendar</h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              {calendarDays.map((day, index) => (
                <div key={index} className={`py-4 ${day.bg} rounded-lg`}>
                  {day.mood}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySupportPage; 