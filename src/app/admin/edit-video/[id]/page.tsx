'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    youtubeId: '',
    duration: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    } else {
      fetchVideo();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchVideo = async () => {
    try {
      const docRef = doc(db, 'videos', params.id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          title: data.title,
          description: data.description,
          youtubeUrl: data.youtubeUrl,
          youtubeId: data.youtubeId,
          duration: data.duration,
        });
      } else {
        alert('Video tidak ditemukan');
        router.push('/admin/manage-content');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      alert('Gagal memuat data video');
    } finally {
      setLoading(false);
    }
  };

  const extractYoutubeId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  const handleYoutubeUrlChange = (url: string) => {
    setFormData({
      ...formData,
      youtubeUrl: url,
      youtubeId: extractYoutubeId(url),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.youtubeUrl || !formData.duration) {
      alert('Semua field harus diisi!');
      return;
    }

    if (!formData.youtubeId) {
      alert('URL YouTube tidak valid!');
      return;
    }

    try {
      setSaving(true);
      const docRef = doc(db, 'videos', params.id as string);
      
      await updateDoc(docRef, {
        title: formData.title,
        description: formData.description,
        youtubeUrl: formData.youtubeUrl,
        youtubeId: formData.youtubeId,
        duration: formData.duration,
      });

      alert('Video berhasil diupdate!');
      router.push('/admin/manage-content');
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Gagal mengupdate video');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/admin/manage-content')}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-4"
            >
              <ArrowLeft size={20} />
              Kembali
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Edit Video
            </h1>
            <p className="text-gray-600">
              Perbarui informasi video edukasi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Video *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="Masukkan judul video"
                required
              />
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL YouTube *
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              {formData.youtubeId && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${formData.youtubeId}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Durasi *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="Contoh: 5:30"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Format: MM:SS (contoh: 5:30 untuk 5 menit 30 detik)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white text-gray-900 min-h-[150px]"
                placeholder="Masukkan deskripsi video"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-semibold transition-colors"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/manage-content')}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
