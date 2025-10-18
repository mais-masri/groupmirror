import React from 'react';

const MoodPieChart = ({ moodData, size = 300 }) => {
  // Color Key mapping
  const moodConfig = {
    5: { label: 'Happy', color: '#FCD34D', emoji: '☀️' },      // Yellow
    4: { label: 'Motivated', color: '#10B981', emoji: '🌱' },  // Green
    3: { label: 'Neutral', color: '#6B7280', emoji: '⚪' },     // Gray
    2: { label: 'Sad', color: '#3B82F6', emoji: '🌧️' },       // Blue
    1: { label: 'Stressed', color: '#F97316', emoji: '🔥' }    // Orange
  };

  // Calculate mood distribution
  const getMoodDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    moodData.forEach(mood => {
      const value = Math.round(mood.value);
      if (distribution[value] !== undefined) {
        distribution[value]++;
      }
    });
    
    return distribution;
  };

  const distribution = getMoodDistribution();
  const totalMoods = moodData.length;

  // Calculate pie chart segments
  const calculateSegments = () => {
    const segments = [];
    let currentAngle = 0;

    Object.entries(distribution).forEach(([value, count]) => {
      if (count > 0) {
        const percentage = (count / totalMoods) * 100;
        const angle = (count / totalMoods) * 360;
        
        segments.push({
          value: parseInt(value),
          count,
          percentage: percentage.toFixed(1),
          angle,
          startAngle: currentAngle,
          endAngle: currentAngle + angle,
          config: moodConfig[value]
        });
        
        currentAngle += angle;
      }
    });

    return segments;
  };

  const segments = calculateSegments();
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  // Generate SVG path for each segment
  const createArcPath = (startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  if (totalMoods === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <p className="text-gray-500 text-center">No mood data available</p>
        <p className="text-sm text-gray-400 mt-2">Group members need to log moods to see the chart</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Group Mood Distribution
      </h3>
      
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Pie Chart */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <svg width={size} height={size} className="drop-shadow-sm">
            {segments.map((segment, index) => (
              <path
                key={segment.value}
                d={createArcPath(segment.startAngle, segment.endAngle)}
                fill={segment.config.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
                title={`${segment.config.label}: ${segment.count} entries (${segment.percentage}%)`}
              />
            ))}
            
            {/* Center circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.3}
              fill="white"
              stroke="#E5E7EB"
              strokeWidth="2"
            />
            
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="text-sm font-semibold text-gray-700"
            >
              {totalMoods}
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              textAnchor="middle"
              className="text-xs text-gray-500"
            >
              Total Entries
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Mood Breakdown:</h4>
          <div className="space-y-3">
            {segments.map((segment) => (
              <div key={segment.value} className="flex items-center gap-3">
                <div 
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: segment.config.color }}
                ></div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{segment.config.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {segment.config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">
                    {segment.count}
                  </span>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {segment.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Most Common Mood:</span>
                <div className="flex items-center gap-2">
                  {segments.length > 0 ? (
                    <>
                      <span className="text-xl">
                        {segments.reduce((max, segment) => 
                          segment.count > max.count ? segment : max
                        ).config.emoji}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {segments.reduce((max, segment) => 
                          segment.count > max.count ? segment : max
                        ).config.label}
                      </span>
                    </>
                  ) : 'N/A'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Total Entries:</span>
                <span className="font-bold text-lg text-gray-800">{totalMoods}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodPieChart;
