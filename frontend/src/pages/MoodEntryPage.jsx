/**
 * MoodEntryPage - Personal mood tracking with calendar view and daily navigation arrows
 * Users can log their daily mood and view their mood history
 */
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import moodService from "../services/moodService";

const MoodEntryPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [moodData, setMoodData] = useState({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('year'); // 'year', 'month', 'day'


  // Load mood data when component mounts or year changes
  useEffect(() => {
    const loadMoodData = async () => {
      try {
        const moods = await moodService.getMoods(currentYear);
        const moodDataMap = {};
        
        moods.forEach(mood => {
          const date = new Date(mood.date);
          const month = date.getMonth();
          const day = date.getDate();
          const year = date.getFullYear();
          
          if (year === currentYear) {
            const dateKey = `${year}-${month}-${day}`;
            moodDataMap[dateKey] = {
              moodLevel: mood.moodLevel,
              description: mood.description || ''
            };
          }
        });
        
        setMoodData(moodDataMap);
      } catch (error) {
        console.error('Error loading mood data:', error);
        // Start with empty data if API fails
        setMoodData({});
      }
    };
    
    loadMoodData();
  }, [currentYear]);

  const moods = [
    { id: 'happy', label: 'Happy', color: 'bg-yellow-400', emoji: '☀️', description: 'Feeling joyful and positive' },
    { id: 'motivated', label: 'Motivated', color: 'bg-green-500', emoji: '🌱', description: 'Ready to take on challenges' },
    { id: 'sad', label: 'Sad', color: 'bg-blue-500', emoji: '🌧️', description: 'Feeling down or blue' },
    { id: 'neutral', label: 'Neutral', color: 'bg-gray-500', emoji: '⚪', description: 'Feeling balanced and calm' },
    { id: 'stressed', label: 'Stressed', color: 'bg-orange-500', emoji: '🔥', description: 'Feeling overwhelmed or tense' }
  ];

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;

    // Check if selected date is in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (selectedDate > today) {
      alert('Cannot log moods for future dates. Please select today or a previous day.');
      return;
    }

    setIsLoading(true);
    try {
      // Map mood labels to numeric values (1-5 scale)
      const moodValueMapping = {
        'happy': 5,
        'motivated': 4,
        'neutral': 3,
        'sad': 2,
        'stressed': 1
      };

      const moodData = {
        value: moodValueMapping[selectedMood.id],
        note: message || '',
        date: selectedDate
      };

      try {
        const response = await moodService.createMood(moodData.value, moodData.note, moodData.date);
        
        if (response) {
          // Reset form
          setSelectedMood(null);
          setMessage('');
          
          // Refresh mood data to show the new entry
          const moods = await moodService.getMoods(currentYear);
          const moodDataMap = {};
          
          moods.forEach(mood => {
            const date = new Date(mood.date);
            const month = date.getMonth();
            const day = date.getDate();
            const year = date.getFullYear();
            
            if (year === currentYear) {
              const dateKey = `${year}-${month}-${day}`;
              moodDataMap[dateKey] = {
                moodLevel: mood.moodLevel,
                description: mood.description || ''
              };
            }
          });
          
          setMoodData(moodDataMap);
          
          // Show success message
          alert('Mood saved! Thanks for checking in. 💙');
        } else {
          throw new Error('No response from API');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        alert('Failed to save mood. Please try again.');
        throw apiError;
      }
    } catch (error) {
      console.error('Mood submission error:', error);
      alert('Failed to save mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get mood emoji for calendar display
  const getMoodEmoji = (moodValue) => {
    const moodEmojis = {
      1: '🔥', // Stressed
      2: '🌧️', // Sad  
      3: '⚪', // Neutral
      4: '🌱', // Motivated
      5: '☀️'  // Happy
    };
    return moodEmojis[moodValue] || '';
  };

  // Get mood color for calendar display
  const getMoodColor = (moodValue) => {
    const moodColors = {
      1: 'bg-red-500',     // Stressed
      2: 'bg-blue-500',    // Sad
      3: 'bg-gray-400',    // Neutral
      4: 'bg-green-500',   // Motivated
      5: 'bg-yellow-400'   // Happy
    };
    return moodColors[moodValue] || 'bg-gray-200';
  };

  // Render calendar based on view mode
  const renderCalendar = () => {
    if (viewMode === 'year') {
      return renderYearlyCalendar();
    } else if (viewMode === 'month') {
      return renderMonthlyCalendar();
    } else {
      return renderDailyView();
    }
  };

  // Render yearly calendar
  const renderYearlyCalendar = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month, monthIndex) => {
          const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
          const firstDayOfMonth = new Date(currentYear, monthIndex, 1).getDay();
          
          return (
            <div key={month} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">{month}</h3>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {/* Day headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const date = new Date(currentYear, monthIndex, day);
                  const today = new Date();
                  const isToday = date.toDateString() === today.toDateString();
                  const dateKey = `${currentYear}-${monthIndex}-${day}`;
                  const moodDataForDate = moodData[dateKey];
                  const isFuture = date > today;
                  
                  return (
                    <div
                      key={day}
                      className={`h-8 flex items-center justify-center text-xs rounded cursor-pointer ${
                        isToday 
                          ? 'bg-blue-200 border-2 border-blue-500 font-bold' 
                          : moodDataForDate 
                            ? `${getMoodColor(moodDataForDate.moodLevel)} text-white font-medium` 
                            : isFuture 
                              ? 'bg-gray-100 text-gray-400' 
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={moodDataForDate ? 
                        `Mood: ${moodDataForDate.moodLevel}/5${moodDataForDate.description ? ` - "${moodDataForDate.description}"` : ''}` : 
                        isFuture ? 'Future date' : 'No mood logged'}
                      onClick={() => {
                        if (!isFuture) {
                          setSelectedDate(date);
                          setViewMode('day');
                        }
                      }}
                    >
                      {moodDataForDate ? (
                        <span className="text-sm">{getMoodEmoji(moodDataForDate.moodLevel)}</span>
                      ) : (
                        <span>{day}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render monthly calendar
  const renderMonthlyCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long' });

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{monthName} {currentYear}</h3>
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 py-2 text-sm">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="h-12"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(currentYear, currentMonth, day);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const dateKey = `${currentYear}-${currentMonth}-${day}`;
            const moodDataForDate = moodData[dateKey];
            const isFuture = date > today;
            
            return (
              <div
                key={day}
                className={`h-12 flex items-center justify-center text-sm rounded cursor-pointer transition-colors ${
                  isToday 
                    ? 'bg-blue-200 border-2 border-blue-500 font-bold' 
                    : moodDataForDate 
                      ? `${getMoodColor(moodDataForDate.moodLevel)} text-white font-medium` 
                      : isFuture 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                title={moodDataForDate ? 
                  `Mood: ${moodDataForDate.moodLevel}/5${moodDataForDate.description ? ` - "${moodDataForDate.description}"` : ''}` : 
                  isFuture ? 'Future date' : 'No mood logged'}
                onClick={() => {
                  if (!isFuture) {
                    setSelectedDate(date);
                    setViewMode('day');
                  }
                }}
              >
                {moodDataForDate ? (
                  <span className="text-lg">{getMoodEmoji(moodDataForDate.moodLevel)}</span>
                ) : (
                  <span>{day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render daily view
  const renderDailyView = () => {
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    const moodDataForDate = moodData[dateKey];
    const today = new Date();
    const isFuture = selectedDate > today;

    // Navigation functions
    const goToPreviousDay = () => {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      setSelectedDate(previousDay);
    };

    const goToNextDay = () => {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    };

    const goToToday = () => {
      setSelectedDate(new Date());
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Daily Navigation Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousDay}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
            title="Previous day"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            {selectedDate.toDateString() !== today.toDateString() && (
              <button
                onClick={goToToday}
                className="text-sm text-blue-600 hover:text-blue-800 underline mt-1"
              >
                Go to today
              </button>
            )}
          </div>
          
          <button
            onClick={goToNextDay}
            disabled={selectedDate.toDateString() === today.toDateString()}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              selectedDate.toDateString() === today.toDateString()
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
            }`}
            title="Next day"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="flex items-center justify-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${
            moodDataForDate 
              ? `${getMoodColor(moodDataForDate.moodLevel)} text-white` 
              : isFuture 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-gray-100 text-gray-500'
          }`}>
            {moodDataForDate ? getMoodEmoji(moodDataForDate.moodLevel) : isFuture ? '🔒' : '📅'}
          </div>
        </div>
        
        <div className="text-center mt-4">
          {moodDataForDate ? (
            <div>
              <p className="text-lg font-semibold text-gray-800">Mood Level: {moodDataForDate.moodLevel}/5</p>
              {moodDataForDate.description && (
                <p className="text-gray-600 mt-2 italic">"{moodDataForDate.description}"</p>
              )}
              <p className="text-gray-500 text-sm mt-2">Logged successfully</p>
            </div>
          ) : isFuture ? (
            <p className="text-gray-500">Cannot log moods for future dates</p>
          ) : (
            <p className="text-gray-500">No mood logged for this day</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header sidebarToggleId="sidebar-toggle" sidebarId="sidebar" />
      <div className="flex flex-1">
        <Sidebar sidebarId="sidebar" />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            How are you feeling today?
          </h2>
          <p className="text-gray-600 mb-8">Pick a color that fits your mood. Add a word if you feel like it.</p>
          
          {/* Mood Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood)}
                className={`${mood.color} text-white py-6 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  selectedMood?.id === mood.id ? 'ring-4 ring-blue-300 transform scale-105 shadow-xl' : 'hover:opacity-90'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-lg font-semibold">{mood.label}</div>
                  <div className="text-sm opacity-90 mt-1">{mood.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Date Selection */}
          {selectedMood && (
            <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
              <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-2">
                Select Date for This Mood
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                You can log moods for today or previous days, but not future dates.
              </p>
            </div>
          )}

          {/* Optional Message */}
          {selectedMood && (
            <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
              <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                Add a word if you feel like it (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share what's on your mind..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
              />
            </div>
          )}

          {/* Submit Button */}
          {selectedMood && (
            <div className="mb-8">
              <button
                onClick={handleMoodSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Saving...' : 'Save Mood Entry'}
              </button>
            </div>
          )}

          {/* Calendar Section */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Mood Calendar</h2>
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('year')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'year' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Year
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'month' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode('day')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'day' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Day
                  </button>
                </div>

                {/* Navigation Controls */}
                {viewMode === 'year' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentYear(currentYear - 1)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      ← {currentYear - 1}
                    </button>
                    <span className="text-lg font-semibold text-gray-700">{currentYear}</span>
                    <button
                      onClick={() => setCurrentYear(currentYear + 1)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      disabled={currentYear >= new Date().getFullYear()}
                    >
                      {currentYear + 1} →
                    </button>
                  </div>
                )}

                {viewMode === 'month' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(currentMonth - 1);
                        }
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      ← Prev
                    </button>
                    <span className="text-lg font-semibold text-gray-700">
                      {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0);
                          setCurrentYear(currentYear + 1);
                        } else {
                          setCurrentMonth(currentMonth + 1);
                        }
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      disabled={currentYear >= new Date().getFullYear() && currentMonth >= new Date().getMonth()}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mood Legend */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Mood Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center text-white text-sm">☀️</span>
                  <span className="text-sm text-gray-600">Happy (5/5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-sm">🌱</span>
                  <span className="text-sm text-gray-600">Motivated (4/5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center text-white text-sm">⚪</span>
                  <span className="text-sm text-gray-600">Neutral (3/5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-sm">🌧️</span>
                  <span className="text-sm text-gray-600">Sad (2/5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-sm">🔥</span>
                  <span className="text-sm text-gray-600">Stressed (1/5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-200 border-2 border-blue-500 rounded"></span>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            {renderCalendar()}
          </div>

        </main>
      </div>
    </div>
  );
};

export default MoodEntryPage;