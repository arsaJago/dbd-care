'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

export default function EditPosterPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Poster Anak' as 'Poster Anak' | 'Poster Keluarga' | 'Infografis',
    fileUrl: '',
    fileType: 'image' as 'image' | 'pdf',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    } else {
      fetchPoster();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchPoster = async () => {
    try {
      const docRef = doc(db, 'posters', params.id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Poster Anak',
          fileUrl: data.fileUrl || '',
          fileType: data.fileType || 'image', // default to 'image' if undefined
        });
      } else {
        alert('Poster tidak ditemukan');
        router.push('/admin/manage-content');
      }
    } catch (error) {
      console.error('Error fetching poster:', error);
      alert('Gagal memuat data poster');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.fileUrl) {
      alert('Semua field harus diisi!');
      return;
    }

    try {
      setSaving(true);
      const docRef = doc(db, 'posters', params.id as string);
      
      await updateDoc(docRef, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileUrl: formData.fileUrl,
        fileType: formData.fileType,
        imageUrl: formData.fileUrl,
        downloadUrl: formData.fileUrl,
      });

      alert('Poster berhasil diupdate!');
      router.push('/admin/manage-content');
    } catch (error) {
      console.error('Error updating poster:', error);
      alert('Gagal mengupdate poster');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
              className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft size={20} />
              Kembali
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Edit Poster
            </h1>
            <p className="text-gray-600">
              Perbarui informasi poster edukasi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Poster *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="Masukkan judul poster"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white text-gray-900"
                required
              >
                <option value="Poster Anak">Poster Anak</option>
                <option value="Poster Keluarga">Poster Keluarga</option>
                <option value="Infografis">Infografis</option>
              </select>
            </div>

            {/* File Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipe File *
              </label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white text-gray-900"
                required
              >
                <option value="image">Image</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            {/* File URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL File *
              </label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="https://example.com/poster.jpg"
                required
              />
              {formData.fileUrl && formData.fileType === 'image' && (
                <img
                  src={formData.fileUrl}
                  alt="Preview"
                  className="mt-4 w-full h-64 object-contain rounded-lg bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                  }}
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white text-gray-900 min-h-[150px]"
                placeholder="Masukkan deskripsi poster"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
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
