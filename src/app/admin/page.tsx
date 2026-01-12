'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  FileImage, 
  Video, 
  Users, 
  MessageSquare, 
  Upload,
  Eye,
  Download,
  Trophy,
  List,
  FileText
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    materials: 0,
    posters: 0,
    leaflets: 0,
    videos: 0,
    users: 0,
    comments: 0,
    totalViews: 0,
  });
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [materialsSnap, postersSnap, leafletsSnap, videosSnap, usersSnap, commentsSnap] = await Promise.all([
        getDocs(collection(db, 'materials')),
        getDocs(collection(db, 'posters')),
        getDocs(collection(db, 'leaflets')),
        getDocs(collection(db, 'videos')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'comments')),
      ]);

      let totalViews = 0;
      materialsSnap.forEach(doc => {
        totalViews += doc.data().views || 0;
      });
      videosSnap.forEach(doc => {
        totalViews += doc.data().views || 0;
      });

      setStats({
        materials: materialsSnap.size,
        posters: postersSnap.size,
        leaflets: leafletsSnap.size,
        videos: videosSnap.size,
        users: usersSnap.size,
        comments: commentsSnap.size,
        totalViews,
      });

      // Fetch recent comments
      const commentsQuery = query(
        collection(db, 'comments'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentComments(commentsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Materi',
      value: stats.materials,
      icon: BookOpen,
      color: 'bg-blue-500',
      href: '/admin/upload-materi',
    },
    {
      title: 'Total Poster',
      value: stats.posters,
      icon: FileImage,
      color: 'bg-green-500',
      href: '/admin/upload-poster',
    },
    {
      title: 'Total Leaflet',
      value: stats.leaflets,
      icon: FileText,
      color: 'bg-teal-500',
      href: '/admin/upload-leaflet',
    },
    {
      title: 'Total Video',
      value: stats.videos,
      icon: Video,
      color: 'bg-red-500',
      href: '/admin/upload-video',
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Komentar',
      value: stats.comments,
      icon: MessageSquare,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'bg-pink-500',
    },
  ];

  const uploadMenus = [
    {
      title: 'Upload Materi',
      description: 'Tambahkan materi edukasi baru',
      icon: BookOpen,
      href: '/admin/upload-materi',
      color: 'bg-blue-500',
    },
    {
      title: 'Upload Poster',
      description: 'Tambahkan poster edukasi baru',
      icon: FileImage,
      href: '/admin/upload-poster',
      color: 'bg-green-500',
    },
    {
      title: 'Upload Leaflet',
      description: 'Tambahkan leaflet edukasi siap unduh',
      icon: FileText,
      href: '/admin/upload-leaflet',
      color: 'bg-teal-500',
    },
    {
      title: 'Upload Video',
      description: 'Tambahkan video edukasi baru',
      icon: Video,
      href: '/admin/upload-video',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Admin Dashboard
              </h1>
              <p className="text-lg text-indigo-100">
                Kelola konten dan monitor aktivitas website DBD Care
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`${stat.color} rounded-lg p-3 w-fit mb-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Upload Menus */}
                {uploadMenus.map((menu, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(menu.href)}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 text-left border-2 border-transparent hover:border-indigo-500"
                  >
                    <div className={`${menu.color} rounded-lg p-3 w-fit mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <menu.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {menu.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {menu.description}
                    </p>
                  </button>
                ))}
                
                {/* New Management Menus */}
                <button
                  onClick={() => router.push('/admin/manage-content')}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 text-left border-2 border-transparent hover:border-purple-500"
                >
                  <div className="bg-purple-500 rounded-lg p-3 w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                    <List className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                    Kelola Konten
                  </h3>
                  <p className="text-sm text-gray-600">
                    Edit & hapus konten
                  </p>
                </button>

                <button
                  onClick={() => router.push('/admin/quiz-results')}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 text-left border-2 border-transparent hover:border-yellow-500"
                >
                  <div className="bg-yellow-500 rounded-lg p-3 w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-yellow-600 transition-colors">
                    Hasil Quiz
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lihat & kelola hasil quiz
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Comments */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Komentar Terbaru
              </h2>
              {recentComments.length > 0 ? (
                <div className="space-y-4">
                  {recentComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {comment.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {comment.createdAt?.toDate().toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Belum ada komentar
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
