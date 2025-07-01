import React from "react";

const MoodCalendar = () => {
  const daysInMonth = 30;
  const moods = ["😀", "🙂", "😐", "🙁", "😞"];

  const getRandomMood = () => moods[Math.floor(Math.random() * moods.length)];

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Calendar - April</h3>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-12 h-12 border rounded text-sm"
          >
            <span className="font-medium">{index + 1}</span>
            <span className="text-xl">{getRandomMood()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodCalendar;