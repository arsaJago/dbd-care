'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { BookOpen, FileImage, Video, Edit, Trash2, Eye } from 'lucide-react';
import { Material, Poster, Video as VideoType } from '@/types';

export default function ManageContentPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'materi' | 'poster' | 'video'>('materi');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    } else {
      fetchAllContent();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const [materialsSnap, postersSnap, videosSnap] = await Promise.all([
        getDocs(collection(db, 'materials')),
        getDocs(collection(db, 'posters')),
        getDocs(collection(db, 'videos')),
      ]);

      const materialsData = materialsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Material[];

      const postersData = postersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Poster[];

      const videosData = videosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoType[];

      setMaterials(materialsData);
      setPosters(postersData);
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Gagal memuat konten');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'materials' | 'posters' | 'videos', id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, type, id));
      alert('Konten berhasil dihapus!');
      fetchAllContent(); // Refresh data
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Gagal menghapus konten');
    }
  };

  const handleEdit = (type: 'materi' | 'poster' | 'video', id: string) => {
    router.push(`/admin/edit-${type}/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Kelola Konten
            </h1>
            <p className="text-gray-600">
              Lihat, edit, dan hapus materi, poster, dan video
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('materi')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'materi'
                    ? 'bg-blue-500 text-white rounded-tl-xl'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen size={20} />
                Materi ({materials.length})
              </button>
              <button
                onClick={() => setActiveTab('poster')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'poster'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileImage size={20} />
                Poster ({posters.length})
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'video'
                    ? 'bg-red-500 text-white rounded-tr-xl'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Video size={20} />
                Video ({videos.length})
              </button>
            </div>
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {/* Materi Tab */}
            {activeTab === 'materi' && (
              <>
                {materials.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Belum ada materi</p>
                  </div>
                ) : (
                  materials.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-center gap-4"
                    >
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                            {item.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Eye size={14} />
                            {item.views} views
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit('materi', item.id)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete('materials', item.id, item.title)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Poster Tab */}
            {activeTab === 'poster' && (
              <>
                {posters.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <FileImage className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Belum ada poster</p>
                  </div>
                ) : (
                  posters.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-center gap-4"
                    >
                      <img
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                            {item.category}
                          </span>
                          <span>{item.downloads} downloads</span>
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit('poster', item.id)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete('posters', item.id, item.title)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Video Tab */}
            {activeTab === 'video' && (
              <>
                {videos.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Video className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Belum ada video</p>
                  </div>
                ) : (
                  videos.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-center gap-4"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                            {item.duration}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Eye size={14} />
                            {item.views} views
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit('video', item.id)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete('videos', item.id, item.title)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/admin')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
