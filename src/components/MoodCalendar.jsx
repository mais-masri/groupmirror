import React, { useState, useEffect } from "react";
import moodService from "../services/moodService";

const MoodCalendar = ({ groupMoods = [], groupName = "Group" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState({});
  
  // Debug moodData changes
  useEffect(() => {
    console.log('MoodCalendar: moodData updated:', moodData);
  }, [moodData]);
  const [loading, setLoading] = useState(false);

  const moods = ["☀️", "🌱", "⚪", "🌧️", "🔥"];
  const moodLabels = ["Happy", "Motivated", "Neutral", "Sad", "Stressed"];

  // Get mood emoji based on value (1-5 scale)
  const getMoodEmoji = (value) => {
    if (value >= 5) return moods[0]; // Happy
    if (value >= 4) return moods[1]; // Motivated  
    if (value >= 3) return moods[2]; // Neutral
    if (value >= 2) return moods[3]; // Sad
    return moods[4]; // Stressed
  };

  // Process group moods data for calendar
  const processGroupMoods = () => {
    if (!groupMoods || groupMoods.length === 0) {
      setMoodData({});
      return;
    }

    const moodMap = {};
    groupMoods.forEach(mood => {
      const date = new Date(mood.createdAt);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      moodMap[dateKey] = mood.value;
    });
    setMoodData(moodMap);
  };

  // Generate demo mood data
  const generateDemoMoodData = () => {
    console.log('MoodCalendar: Generating demo mood data...');
    const demoData = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    console.log('MoodCalendar: Demo data for', year, 'month', month, 'days:', daysInMonth);
    
    // Generate some realistic mood patterns
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      // Skip future dates
      if (date > new Date()) continue;
      
      // 80% chance of having mood data for past dates
      if (Math.random() > 0.2) {
        // Generate more realistic mood patterns
        let moodValue;
        if (day % 7 === 0 || day % 7 === 6) { // Weekends tend to be better
          moodValue = Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 2;
        } else { // Weekdays
          moodValue = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2) + 4;
        }
        
        // Ensure mood value is between 1-5
        moodValue = Math.max(1, Math.min(5, moodValue));
        demoData[`${year}-${month}-${day}`] = moodValue;
      }
    }
    
    // Always show today's date with a mood if it's not in the future
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month && today.getDate() <= daysInMonth) {
      const todayKey = `${year}-${month}-${today.getDate()}`;
      if (!demoData[todayKey]) {
        demoData[todayKey] = 3; // Default to neutral for today
      }
    }
    
    console.log('MoodCalendar: Generated demo data with', Object.keys(demoData).length, 'entries:', demoData);
    return demoData;
  };

  // Fetch mood data for the current month
  const fetchMoodData = async () => {
    console.log('MoodCalendar: fetchMoodData started');
    
    // Set loading to true only briefly, then immediately set to false
    setLoading(true);
    
    // Use setTimeout to ensure loading state is cleared
    setTimeout(() => {
      setLoading(false);
    }, 100);
    
    try {
      // If we have group moods, use them instead of personal moods
      if (groupMoods && groupMoods.length > 0) {
        console.log('MoodCalendar: Using group moods');
        processGroupMoods();
        return;
      }

      // Always use demo data for now since API is down
      console.log('MoodCalendar: Using demo data');
      const demoData = generateDemoMoodData();
      console.log('MoodCalendar: Generated demo data:', demoData);
      setMoodData(demoData);
      
    } catch (error) {
      console.error('Error fetching mood data:', error);
      // Use demo data as final fallback
      const demoData = generateDemoMoodData();
      setMoodData(demoData);
    }
  };

  useEffect(() => {
    console.log('MoodCalendar: useEffect triggered, fetching mood data...');
    fetchMoodData();
  }, [currentDate, groupMoods]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateYear = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Create array of days for the calendar
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month}-${day}`;
    const moodValue = moodData[dateKey];
    const cellDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const isFutureDate = cellDate > today;
    const isToday = cellDate.getTime() === today.getTime();
    
    calendarDays.push({
      day,
      moodValue,
      hasMood: !!moodValue,
      isFutureDate,
      isToday
    });
  }

  return (
        <div className="mt-8 bg-white rounded-lg shadow p-6 relative">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {groupMoods && groupMoods.length > 0 ? `${groupName} Mood Calendar` : 'Personal Mood Calendar'}
            </h3>
            <div className="text-sm text-gray-500">
              {groupMoods && groupMoods.length > 0 ? `${groupMoods.length} mood entries` : `${Object.keys(moodData).length} mood entries`}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateYear(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg font-semibold">«</span>
            </button>

            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg font-semibold">‹</span>
            </button>

            <h3 className="text-xl font-semibold text-gray-800">
              {monthNames[month]} {year}
            </h3>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg font-semibold">›</span>
            </button>

            <button
              onClick={() => navigateYear(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg font-semibold">»</span>
            </button>
          </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayData, index) => (
          <div
            key={index}
            className={`
              flex flex-col items-center justify-center h-16 border rounded-lg text-sm
              ${dayData ? 'hover:bg-gray-50' : 'bg-gray-50'}
              ${dayData?.hasMood ? 'bg-blue-50 border-blue-200' : ''}
              ${dayData?.isToday ? 'bg-green-50 border-green-300 ring-2 ring-green-200' : ''}
              ${dayData?.isFutureDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' : 'cursor-pointer'}
            `}
            title={
              dayData?.isFutureDate 
                ? 'Cannot log mood for future dates' 
                : dayData?.hasMood 
                  ? `${moodLabels[Math.max(0, Math.min(4, 5 - dayData.moodValue))]} - Click to view details`
                  : dayData?.isToday
                    ? 'Today - Click to log your mood'
                    : 'Click to log your mood'
            }
          >
            {dayData && (
              <>
                <span className={`font-medium ${dayData.isFutureDate ? 'text-gray-400' : 'text-gray-800'}`}>
                  {dayData.day}
                </span>
                {dayData.hasMood && (
                  <span className="text-lg" title={`${moodLabels[Math.max(0, Math.min(4, 5 - dayData.moodValue))]}`}>
                    {getMoodEmoji(dayData.moodValue)}
                  </span>
                )}
                {dayData.isToday && !dayData.hasMood && (
                  <span className="text-xs text-green-600 font-medium">Today</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Mood Legend:</h4>
        <div className="flex flex-wrap gap-4 mb-4">
          {moods.map((emoji, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-lg">{emoji}</span>
              <span className="text-sm text-gray-600">{moodLabels[index]}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar Status Legend */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 border border-green-300 rounded"></div>
            <span>Today (highlighted)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Day with mood logged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded opacity-60"></div>
            <span>Future dates (disabled)</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-blue-700 font-medium">Loading mood data...</div>
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;