/**
 * Recommendation Service for processing user mood data
 * Analyzes mood patterns and generates personalized recommendations
 */

// Mood levels for analysis
const MOOD_LEVELS = {
  '😀': { value: 5, label: 'Very Happy', category: 'positive' },
  '😊': { value: 4, label: 'Happy', category: 'positive' },
  '🙂': { value: 3, label: 'Good', category: 'positive' },
  '😐': { value: 2, label: 'Neutral', category: 'neutral' },
  '🙁': { value: 1, label: 'Sad', category: 'negative' },
  '😔': { value: 1, label: 'Down', category: 'negative' },
  '😞': { value: 0, label: 'Very Sad', category: 'negative' },
  '😟': { value: 0, label: 'Worried', category: 'negative' }
};

// Recommendation categories and templates
const RECOMMENDATIONS = {
  positive: {
    maintain: [
      { 
        type: 'activity',
        title: 'Keep up the momentum!',
        suggestions: [
          'Continue your current routine',
          'Share your positive energy with team members',
          'Document what\'s working well',
          'Mentor someone who might be struggling'
        ]
      },
      {
        type: 'social',
        title: 'Spread the positivity',
        suggestions: [
          'Organize a team celebration',
          'Start a gratitude channel',
          'Share success stories',
          'Lead a fun team activity'
        ]
      }
    ]
  },
  neutral: {
    boost: [
      {
        type: 'activity',
        title: 'Boost your mood',
        suggestions: [
          'Take a short walk outside',
          'Listen to energizing music',
          'Connect with a positive colleague',
          'Set a small achievable goal for today'
        ]
      },
      {
        type: 'mindfulness',
        title: 'Find your balance',
        suggestions: [
          'Try a 5-minute meditation',
          'Practice deep breathing exercises',
          'Journal about your feelings',
          'Take regular breaks'
        ]
      }
    ]
  },
  negative: {
    support: [
      {
        type: 'support',
        title: 'You\'re not alone',
        suggestions: [
          'Reach out to a trusted friend or colleague',
          'Consider talking to your manager about workload',
          'Use available mental health resources',
          'Take time for self-care'
        ]
      },
      {
        type: 'recovery',
        title: 'Small steps forward',
        suggestions: [
          'Focus on one task at a time',
          'Celebrate small wins',
          'Get adequate rest',
          'Engage in activities you enjoy'
        ]
      }
    ]
  },
  improving: {
    encourage: [
      {
        type: 'motivation',
        title: 'You\'re making progress!',
        suggestions: [
          'Keep doing what\'s working',
          'Build on your recent improvements',
          'Reward yourself for the progress',
          'Share your journey with others'
        ]
      }
    ]
  },
  declining: {
    intervene: [
      {
        type: 'intervention',
        title: 'Let\'s turn things around',
        suggestions: [
          'Identify stress triggers',
          'Adjust your workload if needed',
          'Prioritize self-care activities',
          'Seek support from your team'
        ]
      }
    ]
  }
};

class RecommendationService {
  /**
   * Analyzes mood history to determine patterns
   * @param {Array} moodHistory - Array of mood entries with dates
   * @returns {Object} Analysis results
   */
  analyzeMoodPatterns(moodHistory) {
    if (!moodHistory || moodHistory.length === 0) {
      return {
        trend: 'unknown',
        average: 0,
        category: 'neutral',
        recentMood: null
      };
    }

    // Get recent moods (last 7 days)
    const recentMoods = moodHistory.slice(-7);
    
    // Calculate average mood value
    const moodValues = recentMoods.map(entry => 
      MOOD_LEVELS[entry.mood]?.value || 2
    );
    const average = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
    
    // Determine trend
    let trend = 'stable';
    if (moodValues.length >= 3) {
      const firstHalf = moodValues.slice(0, Math.floor(moodValues.length / 2));
      const secondHalf = moodValues.slice(Math.floor(moodValues.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg - firstAvg > 0.5) trend = 'improving';
      else if (firstAvg - secondAvg > 0.5) trend = 'declining';
    }
    
    // Determine overall category
    let category = 'neutral';
    if (average >= 3.5) category = 'positive';
    else if (average < 1.5) category = 'negative';
    
    return {
      trend,
      average,
      category,
      recentMood: recentMoods[recentMoods.length - 1]?.mood || null,
      moodCounts: this.countMoodFrequency(recentMoods)
    };
  }

  /**
   * Counts frequency of each mood
   * @param {Array} moods - Array of mood entries
   * @returns {Object} Frequency count
   */
  countMoodFrequency(moods) {
    const counts = {};
    moods.forEach(entry => {
      const mood = entry.mood;
      counts[mood] = (counts[mood] || 0) + 1;
    });
    return counts;
  }

  /**
   * Generates personalized recommendations based on mood analysis
   * @param {Object} analysis - Mood analysis results
   * @param {Object} userData - Additional user data
   * @returns {Array} Array of recommendations
   */
  generateRecommendations(analysis, userData = {}) {
    const recommendations = [];
    const { category, trend } = analysis;
    
    // Get base recommendations based on category
    if (RECOMMENDATIONS[category]) {
      const categoryRecs = RECOMMENDATIONS[category];
      const recType = Object.keys(categoryRecs)[0];
      recommendations.push(...categoryRecs[recType]);
    }
    
    // Add trend-based recommendations
    if (trend === 'improving' && RECOMMENDATIONS.improving) {
      recommendations.push(...RECOMMENDATIONS.improving.encourage);
    } else if (trend === 'declining' && RECOMMENDATIONS.declining) {
      recommendations.push(...RECOMMENDATIONS.declining.intervene);
    }
    
    // Personalize based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      recommendations.forEach(rec => {
        if (rec.type === 'activity') {
          rec.suggestions.unshift('Start your day with a positive affirmation');
        }
      });
    } else if (hour >= 17) {
      recommendations.forEach(rec => {
        if (rec.type === 'activity') {
          rec.suggestions.push('Wind down with relaxing activities');
        }
      });
    }
    
    // Add group-based recommendations if user is part of groups
    if (userData.groups && userData.groups.length > 0) {
      recommendations.push({
        type: 'group',
        title: 'Connect with your team',
        suggestions: [
          'Check in with your group members',
          'Share your mood with the team',
          'Participate in group activities',
          'Support teammates who might need help'
        ]
      });
    }
    
    return recommendations;
  }

  /**
   * Processes user data to generate insights and recommendations
   * @param {Object} userData - Complete user data including mood history
   * @returns {Object} Processed recommendations and insights
   */
  processUserDataForRecommendations(userData) {
    const {
      moodHistory = [],
      preferences = {},
      groups = [],
      activities = []
    } = userData;
    
    // Analyze mood patterns
    const analysis = this.analyzeMoodPatterns(moodHistory);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(analysis, { groups });
    
    // Calculate insights
    const insights = {
      moodTrend: analysis.trend,
      averageMood: analysis.average.toFixed(1),
      dominantMoodCategory: analysis.category,
      moodStability: this.calculateMoodStability(moodHistory),
      streaks: this.calculateStreaks(moodHistory),
      bestDays: this.findBestDays(moodHistory),
      correlations: this.findCorrelations(moodHistory, activities)
    };
    
    // Priority score for recommendations
    const priorityScore = this.calculatePriority(analysis);
    
    return {
      recommendations,
      insights,
      analysis,
      priorityScore,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculates mood stability score
   * @param {Array} moodHistory - Array of mood entries
   * @returns {Number} Stability score (0-100)
   */
  calculateMoodStability(moodHistory) {
    if (moodHistory.length < 2) return 100;
    
    const values = moodHistory.map(entry => 
      MOOD_LEVELS[entry.mood]?.value || 2
    );
    
    let changes = 0;
    for (let i = 1; i < values.length; i++) {
      changes += Math.abs(values[i] - values[i - 1]);
    }
    
    const avgChange = changes / (values.length - 1);
    const stability = Math.max(0, 100 - (avgChange * 20));
    
    return Math.round(stability);
  }

  /**
   * Calculates positive and negative mood streaks
   * @param {Array} moodHistory - Array of mood entries
   * @returns {Object} Streak information
   */
  calculateStreaks(moodHistory) {
    let currentPositive = 0;
    let longestPositive = 0;
    let currentNegative = 0;
    let longestNegative = 0;
    
    moodHistory.forEach(entry => {
      const moodInfo = MOOD_LEVELS[entry.mood];
      if (moodInfo) {
        if (moodInfo.category === 'positive') {
          currentPositive++;
          currentNegative = 0;
          longestPositive = Math.max(longestPositive, currentPositive);
        } else if (moodInfo.category === 'negative') {
          currentNegative++;
          currentPositive = 0;
          longestNegative = Math.max(longestNegative, currentNegative);
        } else {
          currentPositive = 0;
          currentNegative = 0;
        }
      }
    });
    
    return {
      currentPositiveStreak: currentPositive,
      longestPositiveStreak: longestPositive,
      currentNegativeStreak: currentNegative,
      longestNegativeStreak: longestNegative
    };
  }

  /**
   * Finds days with best moods
   * @param {Array} moodHistory - Array of mood entries with dates
   * @returns {Array} Best days of the week
   */
  findBestDays(moodHistory) {
    const dayScores = {};
    const dayCounts = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    moodHistory.forEach(entry => {
      const date = new Date(entry.date);
      const dayName = days[date.getDay()];
      const value = MOOD_LEVELS[entry.mood]?.value || 2;
      
      dayScores[dayName] = (dayScores[dayName] || 0) + value;
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });
    
    const avgScores = {};
    Object.keys(dayScores).forEach(day => {
      avgScores[day] = dayScores[day] / dayCounts[day];
    });
    
    return Object.entries(avgScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([day, score]) => ({ day, averageScore: score.toFixed(1) }));
  }

  /**
   * Finds correlations between moods and activities
   * @param {Array} moodHistory - Array of mood entries
   * @param {Array} activities - Array of user activities
   * @returns {Object} Correlation insights
   */
  findCorrelations(moodHistory, activities) {
    // Simple correlation finder
    const correlations = {
      timeOfDay: this.findTimeCorrelation(moodHistory),
      activities: this.findActivityCorrelation(moodHistory, activities)
    };
    
    return correlations;
  }

  /**
   * Finds correlation between mood and time of day
   * @param {Array} moodHistory - Array of mood entries
   * @returns {Object} Time correlation data
   */
  findTimeCorrelation(moodHistory) {
    const timeSlots = {
      morning: { total: 0, count: 0 },
      afternoon: { total: 0, count: 0 },
      evening: { total: 0, count: 0 },
      night: { total: 0, count: 0 }
    };
    
    moodHistory.forEach(entry => {
      const hour = new Date(entry.date).getHours();
      const value = MOOD_LEVELS[entry.mood]?.value || 2;
      let slot;
      
      if (hour < 6) slot = 'night';
      else if (hour < 12) slot = 'morning';
      else if (hour < 18) slot = 'afternoon';
      else slot = 'evening';
      
      timeSlots[slot].total += value;
      timeSlots[slot].count++;
    });
    
    const avgByTime = {};
    Object.keys(timeSlots).forEach(slot => {
      if (timeSlots[slot].count > 0) {
        avgByTime[slot] = (timeSlots[slot].total / timeSlots[slot].count).toFixed(1);
      }
    });
    
    return avgByTime;
  }

  /**
   * Finds correlation between mood and activities
   * @param {Array} moodHistory - Array of mood entries
   * @param {Array} activities - Array of user activities
   * @returns {Array} Activity correlation data
   */
  findActivityCorrelation(moodHistory, activities) {
    // Placeholder for activity correlation logic
    // In a real app, this would analyze which activities correlate with better moods
    return [];
  }

  /**
   * Calculates priority score for recommendations
   * @param {Object} analysis - Mood analysis results
   * @returns {Number} Priority score (0-100)
   */
  calculatePriority(analysis) {
    let score = 50;
    
    // Adjust based on mood category
    if (analysis.category === 'negative') score += 30;
    else if (analysis.category === 'positive') score -= 20;
    
    // Adjust based on trend
    if (analysis.trend === 'declining') score += 20;
    else if (analysis.trend === 'improving') score -= 10;
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, score));
  }
}

// Export singleton instance
const recommendationService = new RecommendationService();
export default recommendationService;

// Export class for testing
export { RecommendationService, MOOD_LEVELS, RECOMMENDATIONS };