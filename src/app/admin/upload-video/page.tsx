'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Video, Upload, AlertCircle, Play } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { extractYouTubeId } from '@/lib/utils';

export default function UploadVideoPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pengenalan',
    youtubeUrl: '',
    description: '',
    duration: '',
  });
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Extract YouTube ID when URL changes
    if (name === 'youtubeUrl') {
      const id = extractYouTubeId(value);
      setVideoId(id || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.youtubeUrl || !formData.description) {
        throw new Error('Semua field wajib diisi');
      }

      const extractedVideoId = extractYouTubeId(formData.youtubeUrl);
      if (!extractedVideoId) {
        throw new Error('URL YouTube tidak valid');
      }

      // Add to Firestore
      await addDoc(collection(db, 'videos'), {
        title: formData.title,
        category: formData.category,
        youtubeUrl: formData.youtubeUrl,
        description: formData.description,
        duration: formData.duration || '0:00',
        views: 0,
        createdAt: Timestamp.now(),
      });

      setSuccess(true);
      setFormData({
        title: '',
        category: 'Pengenalan',
        youtubeUrl: '',
        description: '',
        duration: '',
      });
      setVideoId('');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeThumbnail = (id: string) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Upload Video Edukasi
              </h1>
              <p className="text-lg text-red-100">
                Tambahkan video YouTube tentang DBD
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                <strong>Cara Upload Video:</strong>
              </p>
              <ol className="list-decimal list-inside text-blue-700 mt-2 space-y-1">
                <li>Upload video ke YouTube terlebih dahulu</li>
                <li>Copy URL video YouTube (contoh: https://www.youtube.com/watch?v=xxxxx)</li>
                <li>Paste URL di form di bawah</li>
                <li>Isi informasi lainnya dan klik Upload</li>
              </ol>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Video <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Contoh: Apa Itu Demam Berdarah Dengue?"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="Pengenalan">Pengenalan</option>
                    <option value="Gejala">Gejala</option>
                    <option value="Pencegahan">Pencegahan</option>
                    <option value="Perawatan">Perawatan</option>
                    <option value="Penanganan">Penanganan</option>
                    <option value="Edukasi">Edukasi</option>
                  </select>
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL YouTube <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://www.youtube.com/watch?v=xxxxx"
                    required
                  />
                  {videoId && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Video ID terdeteksi: {videoId}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durasi (opsional)
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Contoh: 5:24"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format: MM:SS (contoh: 5:24 atau 10:30)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Deskripsi singkat tentang video ini..."
                    required
                  />
                </div>

                {/* Preview */}
                {videoId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <div className="relative aspect-video">
                        <img
                          src={getYouTubeThumbnail(videoId)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="bg-red-600 rounded-full p-4">
                            <Play className="w-8 h-8 text-white fill-current" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-medium">
                      ✅ Video berhasil ditambahkan! Redirecting...
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Video</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
