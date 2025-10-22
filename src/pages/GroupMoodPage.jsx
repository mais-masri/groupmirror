/**
 * GroupMoodPage - View group mood analytics and schedule support sessions
 * Shows mood charts, statistics, and allows scheduling group support meetings
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MoodPieChart from '../components/MoodPieChart';
import ScheduledSessions from '../components/ScheduledSessions';
import api from '../services/api';
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
      const response = await api.get(`/api/groups/${groupId}/moods`);
      setGroupMoods(response.data);
    } catch (error) {
      console.error('Error fetching group moods:', error);
      // For demo purposes, generate group-specific sample mood data
      let sampleMoods = [];
      
      if (groupId === 'demo1') {
        // Work Team - More positive moods
        sampleMoods = [
          { _id: '1', value: 5, note: 'Great team meeting!', user: { name: 'Alice' }, createdAt: new Date().toISOString() },
          { _id: '2', value: 4, note: 'Productive day', user: { name: 'Bob' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', value: 4, note: 'Good progress on project', user: { name: 'Charlie' }, createdAt: new Date(Date.now() - 172800000).toISOString() },
          { _id: '4', value: 3, note: 'Regular workday', user: { name: 'Alice' }, createdAt: new Date(Date.now() - 259200000).toISOString() },
          { _id: '5', value: 5, note: 'Deployed successfully!', user: { name: 'Bob' }, createdAt: new Date(Date.now() - 345600000).toISOString() },
          { _id: '6', value: 4, note: 'Team collaboration going well', user: { name: 'Charlie' }, createdAt: new Date(Date.now() - 432000000).toISOString() },
        ];
      } else if (groupId === 'demo2') {
        // Family Group - Mixed moods
        sampleMoods = [
          { _id: '1', value: 5, note: 'Family dinner was wonderful', user: { name: 'Mom' }, createdAt: new Date().toISOString() },
          { _id: '2', value: 3, note: 'Kids had a rough day', user: { name: 'Dad' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', value: 2, note: 'Feeling overwhelmed', user: { name: 'Sarah' }, createdAt: new Date(Date.now() - 172800000).toISOString() },
          { _id: '4', value: 4, note: 'Had fun playing games', user: { name: 'Mike' }, createdAt: new Date(Date.now() - 259200000).toISOString() },
          { _id: '5', value: 3, note: 'Just a regular day', user: { name: 'Mom' }, createdAt: new Date(Date.now() - 345600000).toISOString() },
          { _id: '6', value: 5, note: 'Weekend was amazing!', user: { name: 'Dad' }, createdAt: new Date(Date.now() - 432000000).toISOString() },
          { _id: '7', value: 2, note: 'School stress', user: { name: 'Sarah' }, createdAt: new Date(Date.now() - 518400000).toISOString() },
          { _id: '8', value: 4, note: 'Made new friends', user: { name: 'Mike' }, createdAt: new Date(Date.now() - 604800000).toISOString() },
        ];
      } else if (groupId === 'demo3') {
        // Study Group - More stressed moods
        sampleMoods = [
          { _id: '1', value: 1, note: 'Exam tomorrow, very stressed', user: { name: 'Emma' }, createdAt: new Date().toISOString() },
          { _id: '2', value: 2, note: 'Studying all night', user: { name: 'James' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', value: 3, note: 'Midterm was okay', user: { name: 'Lisa' }, createdAt: new Date(Date.now() - 172800000).toISOString() },
          { _id: '4', value: 1, note: 'Failed the quiz', user: { name: 'Emma' }, createdAt: new Date(Date.now() - 259200000).toISOString() },
          { _id: '5', value: 2, note: 'Need to study more', user: { name: 'James' }, createdAt: new Date(Date.now() - 345600000).toISOString() },
          { _id: '6', value: 4, note: 'Group study helped!', user: { name: 'Lisa' }, createdAt: new Date(Date.now() - 432000000).toISOString() },
          { _id: '7', value: 1, note: 'Too much pressure', user: { name: 'Emma' }, createdAt: new Date(Date.now() - 518400000).toISOString() },
          { _id: '8', value: 3, note: 'Getting better at this', user: { name: 'James' }, createdAt: new Date(Date.now() - 604800000).toISOString() },
        ];
      } else {
        // Default mixed data
        sampleMoods = [
          { _id: '1', value: 5, note: 'Feeling great today!', user: { name: 'Alice' }, createdAt: new Date().toISOString() },
          { _id: '2', value: 4, note: 'Ready to tackle the day', user: { name: 'Bob' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', value: 3, note: 'Just a regular day', user: { name: 'Charlie' }, createdAt: new Date(Date.now() - 172800000).toISOString() },
          { _id: '4', value: 2, note: 'Feeling a bit down', user: { name: 'Diana' }, createdAt: new Date(Date.now() - 259200000).toISOString() },
          { _id: '5', value: 1, note: 'Very stressed lately', user: { name: 'Eve' }, createdAt: new Date(Date.now() - 345600000).toISOString() },
          { _id: '6', value: 5, note: 'Amazing day!', user: { name: 'Frank' }, createdAt: new Date(Date.now() - 432000000).toISOString() },
          { _id: '7', value: 4, note: 'Motivated and focused', user: { name: 'Grace' }, createdAt: new Date(Date.now() - 518400000).toISOString() },
          { _id: '8', value: 3, note: 'Neutral mood', user: { name: 'Henry' }, createdAt: new Date(Date.now() - 604800000).toISOString() },
        ];
      }
      setGroupMoods(sampleMoods);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const fetchGroupInfo = useCallback(async () => {
    try {
      const response = await api.get(`/api/groups/${groupId}`);
      setGroupInfo(response.data);
    } catch (error) {
      console.error('Error fetching group info:', error);
      // For demo purposes, generate sample group info
      let groupInfo = {};
      
      if (groupId === 'demo1') {
        groupInfo = {
          _id: groupId,
          name: 'Work Team',
          description: 'Daily mood check-ins for our development team',
          members: [
            { name: 'Alice' },
            { name: 'Bob' },
            { name: 'Charlie' }
          ],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        };
      } else if (groupId === 'demo2') {
        groupInfo = {
          _id: groupId,
          name: 'Family Group',
          description: 'Keeping track of how everyone is feeling',
          members: [
            { name: 'Mom' },
            { name: 'Dad' },
            { name: 'Sarah' },
            { name: 'Mike' }
          ],
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        };
      } else if (groupId === 'demo3') {
        groupInfo = {
          _id: groupId,
          name: 'Study Group',
          description: 'Supporting each other through exam stress',
          members: [
            { name: 'Emma' },
            { name: 'James' },
            { name: 'Lisa' }
          ],
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
        };
      } else {
        groupInfo = {
          _id: groupId,
          name: 'Demo Group',
          description: 'A sample group to demonstrate the pie chart functionality',
          members: [
            { name: 'Alice' },
            { name: 'Bob' },
            { name: 'Charlie' },
            { name: 'Diana' },
            { name: 'Eve' },
            { name: 'Frank' },
            { name: 'Grace' },
            { name: 'Henry' }
          ],
          createdAt: new Date().toISOString()
        };
      }
      setGroupInfo(groupInfo);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchGroupMoods();
      fetchGroupInfo();
    } else {
      // No group ID provided, show demo data
      const sampleMoods = [
        { _id: '1', value: 5, note: 'Feeling great today!', user: { name: 'Alice' }, createdAt: new Date().toISOString() },
        { _id: '2', value: 4, note: 'Ready to tackle the day', user: { name: 'Bob' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: '3', value: 3, note: 'Just a regular day', user: { name: 'Charlie' }, createdAt: new Date(Date.now() - 172800000).toISOString() },
        { _id: '4', value: 2, note: 'Feeling a bit down', user: { name: 'Diana' }, createdAt: new Date(Date.now() - 259200000).toISOString() },
        { _id: '5', value: 1, note: 'Very stressed lately', user: { name: 'Eve' }, createdAt: new Date(Date.now() - 345600000).toISOString() },
        { _id: '6', value: 5, note: 'Amazing day!', user: { name: 'Frank' }, createdAt: new Date(Date.now() - 432000000).toISOString() },
        { _id: '7', value: 4, note: 'Motivated and focused', user: { name: 'Grace' }, createdAt: new Date(Date.now() - 518400000).toISOString() },
        { _id: '8', value: 3, note: 'Neutral mood', user: { name: 'Henry' }, createdAt: new Date(Date.now() - 604800000).toISOString() },
      ];
      
      setGroupMoods(sampleMoods);
      setGroupInfo({
        _id: 'demo',
        name: 'Demo Group',
        description: 'Sample group to demonstrate the pie chart functionality',
        members: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
          { name: 'Frank' },
          { name: 'Grace' },
          { name: 'Henry' }
        ],
        createdAt: new Date().toISOString()
      });
      setLoading(false);
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
          
          {!groupId && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">ℹ️</span>
                <span>Showing demo data. Create a group to see real mood data.</span>
              </div>
            </div>
          )}

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
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No mood entries found for this group</p>
              <p className="text-sm text-gray-400">
                Group members can start sharing their moods to see them here.
              </p>
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

              {/* Scheduled Sessions */}
              <div className="mt-8">
                <ScheduledSessions groupId={groupId} showCreateButton={true} />
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GroupMoodPage;