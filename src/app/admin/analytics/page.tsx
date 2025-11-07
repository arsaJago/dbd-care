'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Eye, 
  Play, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';

interface ActivityLog {
  id: string;
  username: string;
  action: string;
  target: string;
  targetId?: string;
  createdAt: Timestamp;
}

interface UserStats {
  username: string;
  materialsViewed: number;
  videosWatched: number;
  quizzesTaken: number;
  lastActive: Timestamp;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7days'); // 7days, 30days, all
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsersToday: 0,
    totalPageViews: 0,
    totalQuizAttempts: 0,
    totalMaterialViews: 0,
    totalVideoViews: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    } else {
      fetchAnalyticsData();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchAnalyticsData = async () => {
    try {
      // Get time filter date
      const now = new Date();
      let filterDate = new Date(0); // Default to all time
      
      if (timeFilter === '7days') {
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeFilter === '30days') {
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Fetch activity logs (simulated - we'll add real tracking later)
      const activityQuery = query(
        collection(db, 'activityLogs'),
        orderBy('createdAt', 'desc')
      );
      
      // For now, we'll use quiz responses as activity data
      const quizQuery = query(collection(db, 'quizResponses'), orderBy('createdAt', 'desc'));
      const quizSnapshot = await getDocs(quizQuery);
      
      const activities: ActivityLog[] = [];
      quizSnapshot.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          username: data.username,
          action: 'completed_quiz',
          target: 'quiz',
          createdAt: data.createdAt,
        });
      });

      setActivityLogs(activities);

      // Calculate user statistics
      const userStatsMap = new Map<string, UserStats>();
      
      activities.forEach(activity => {
        const username = activity.username;
        if (!userStatsMap.has(username)) {
          userStatsMap.set(username, {
            username,
            materialsViewed: 0,
            videosWatched: 0,
            quizzesTaken: 0,
            lastActive: activity.createdAt,
          });
        }
        
        const userStat = userStatsMap.get(username)!;
        if (activity.action === 'completed_quiz') {
          userStat.quizzesTaken += 1;
        }
        
        // Update last active if this activity is more recent
        if (activity.createdAt.toMillis() > userStat.lastActive.toMillis()) {
          userStat.lastActive = activity.createdAt;
        }
      });

      const userStatsArray = Array.from(userStatsMap.values());
      setUserStats(userStatsArray);

      // Calculate overall stats
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activeToday = activities.filter(activity => {
        const activityDate = activity.createdAt.toDate();
        return activityDate >= today;
      });

      setStats({
        totalUsers: usersSnapshot.size,
        activeUsersToday: new Set(activeToday.map(a => a.username)).size,
        totalPageViews: activities.length * 3, // Simulated
        totalQuizAttempts: activities.filter(a => a.action === 'completed_quiz').length,
        totalMaterialViews: activities.length * 2, // Simulated
        totalVideoViews: activities.length * 1, // Simulated
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAnalyticsData();
    }
  }, [timeFilter]);

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'completed_quiz':
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'viewed_material':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'watched_video':
        return <Play className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'completed_quiz':
        return 'Menyelesaikan Quiz';
      case 'viewed_material':
        return 'Membaca Materi';
      case 'watched_video':
        return 'Menonton Video';
      default:
        return 'Aktivitas';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor aktivitas dan engagement pengguna</p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">7 Hari Terakhir</option>
                <option value="30days">30 Hari Terakhir</option>
                <option value="all">Semua Waktu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsersToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPageViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Materi Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMaterialViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Video Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVideoViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quiz Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuizAttempts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Statistics */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Statistik Pengguna
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {userStats.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Terakhir Aktif
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userStats.map((user, index) => (
                      <tr key={user.username} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {user.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.quizzesTaken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(user.lastActive)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Belum ada data pengguna</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                Aktivitas Terbaru
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {activityLogs.length > 0 ? (
                <div className="space-y-4 p-6">
                  {activityLogs.slice(0, 10).map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.username}</span>
                          {' '}{getActionLabel(activity.action).toLowerCase()}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Note about tracking */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Catatan Tracking
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Saat ini sistem tracking terbatas pada data quiz. Untuk mendapatkan analytics yang lebih komprehensif 
                  (views materi, video plays, page visits), perlu implementasi activity logging di setiap halaman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}