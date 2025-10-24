/**
 * GroupMoodPage - Shows today's mood data from all group members in a pie chart
 * Displays recent mood entries and scheduled support sessions
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MoodPieChart from '../components/MoodPieChart';
import groupService from '../services/groupService';
import LoadingSpinner from '../components/LoadingSpinner';

const GroupMoodPage = () => {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group');
  const [groupMoods, setGroupMoods] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGroupMoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await groupService.getGroupMoods(groupId);
      if (response.success) {
        setGroupMoods(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch group moods');
      }
    } catch (error) {
      console.error('Error fetching group moods:', error);
      setGroupMoods([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const fetchGroupInfo = useCallback(async () => {
    try {
      const response = await groupService.getGroup(groupId);
      if (response.success) {
        setGroupInfo(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch group info');
      }
    } catch (error) {
      console.error('Error fetching group info:', error);
      setGroupInfo(null);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchGroupMoods();
      fetchGroupInfo();
    } else {
      // No group ID provided, try to get user's groups and redirect to first one
      const redirectToUserGroup = async () => {
        try {
          const response = await groupService.getGroups();
          if (response.success && response.data.length > 0) {
            // Redirect to the first group
            const firstGroup = response.data[0];
            window.location.href = `/group-mood?group=${firstGroup._id}`;
            return;
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
        
        // If no groups found, show empty state
        setGroupMoods([]);
        setGroupInfo(null);
        setLoading(false);
      };
      
      redirectToUserGroup();
    }
  }, [groupId, fetchGroupMoods, fetchGroupInfo]);

  const getAverageMood = () => {
    if (groupMoods.length === 0) return 0;
    const total = groupMoods.reduce((sum, mood) => sum + mood.value, 0);
    return (total / groupMoods.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <LoadingSpinner text="Loading group moods..." />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {groupInfo ? groupInfo.name : 'Group'} Moods
          </h2>

          {groupInfo && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{groupInfo.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{groupInfo.description || 'No description available'}</p>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Members: {groupInfo.members?.length || 0}
                </div>
                <div className="text-sm text-gray-500">
                  Average Mood: {getAverageMood()}/5
                </div>
              </div>
            </div>
          )}

          {groupMoods.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">😊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {groupInfo ? 'No mood entries yet' : 'No groups found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {groupInfo 
                  ? 'Group members can start sharing their moods to see them here.'
                  : 'Create or join a group to start tracking moods together.'
                }
              </p>
              {!groupInfo && (
                <div className="space-x-4">
                  <button 
                    onClick={() => window.location.href = '/groups'}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Groups
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pie Chart Section */}
              <MoodPieChart moodData={groupMoods} />
              
              {/* Individual Mood Entries */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Mood Entries</h3>
                <div className="space-y-4">
                  {groupMoods.map((mood) => (
                    <div key={mood._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {mood.value >= 5 ? '☀️' :
                               mood.value >= 4 ? '🌱' :
                               mood.value >= 3 ? '⚪' :
                               mood.value >= 2 ? '🌧️' : '🔥'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              mood.value >= 4 ? 'bg-green-100 text-green-800' :
                              mood.value >= 3 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {mood.value}/5
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {mood.user?.name || 'Anonymous'}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {new Date(mood.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {mood.note && (
                            <p className="text-gray-600 text-sm">{mood.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GroupMoodPage;