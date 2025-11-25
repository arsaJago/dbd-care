'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

export default function EditMateriPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Pencegahan' as 'Pencegahan' | 'Gejala' | 'Pengobatan' | '3M Plus',
    thumbnailUrl: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    } else {
      fetchMaterial();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchMaterial = async () => {
    try {
      const docRef = doc(db, 'materials', params.id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
          thumbnailUrl: data.thumbnailUrl,
        });
      } else {
        alert('Materi tidak ditemukan');
        router.push('/admin/manage-content');
      }
    } catch (error) {
      console.error('Error fetching material:', error);
      alert('Gagal memuat data materi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.thumbnailUrl) {
      alert('Semua field harus diisi!');
      return;
    }

    try {
      setSaving(true);
      const docRef = doc(db, 'materials', params.id as string);
      
      await updateDoc(docRef, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        thumbnailUrl: formData.thumbnailUrl,
      });

      alert('Materi berhasil diupdate!');
      router.push('/admin/manage-content');
    } catch (error) {
      console.error('Error updating material:', error);
      alert('Gagal mengupdate materi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft size={20} />
              Kembali
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Edit Materi
            </h1>
            <p className="text-gray-600">
              Perbarui informasi materi edukasi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Materi *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="Masukkan judul materi"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                required
              >
                <option value="Pencegahan">Pencegahan</option>
                <option value="Gejala">Gejala</option>
                <option value="Pengobatan">Pengobatan</option>
                <option value="3M Plus">3M Plus</option>
              </select>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Thumbnail *
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.thumbnailUrl && (
                <img
                  src={formData.thumbnailUrl}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konten Materi *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900 min-h-[300px]"
                placeholder="Masukkan konten materi (mendukung HTML)"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Tips: Gunakan tag HTML seperti &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt; untuk format konten
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors"
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
