'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

const ALLOWED_CATEGORIES = ['Pencegahan', '3M Plus'] as const;

const extractDriveId = (url: string) => {
  const bySlash = url.match(/\/d\/([^/]+)/);
  if (bySlash?.[1]) return bySlash[1];
  const byQuery = url.match(/[?&]id=([^&]+)/);
  return byQuery?.[1];
};

const getPreviewUrl = (fileUrl: string, fileType: string) => {
  const isDrive = fileUrl.includes('drive.google.com');
  if (!isDrive) return fileUrl;
  const id = extractDriveId(fileUrl);
  if (!id) return fileUrl;
  const lower = fileType.toLowerCase();
  if (lower === 'image') return `https://drive.google.com/uc?export=view&id=${id}`;
  if (lower === 'pdf') return `https://drive.google.com/file/d/${id}/preview`;
  return fileUrl;
};

const getThumbnailUrl = (fileUrl: string) => {
  const isDrive = fileUrl.includes('drive.google.com');
  if (!isDrive) return fileUrl;
  const id = extractDriveId(fileUrl);
  if (!id) return fileUrl;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
};

const getImageSources = (fileUrl: string) => {
  const sources: string[] = [];
  const isDrive = fileUrl.includes('drive.google.com');
  const id = extractDriveId(fileUrl);
  if (isDrive && id) {
    sources.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1000`);
    sources.push(`https://drive.google.com/uc?export=view&id=${id}`);
    sources.push(`https://drive.google.com/uc?export=download&id=${id}`);
  }
  sources.push(fileUrl);
  return Array.from(new Set(sources));
};

export default function EditLeafletPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pencegahan' as (typeof ALLOWED_CATEGORIES)[number],
    fileUrl: '',
    fileType: 'pdf' as 'pdf' | 'image',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/beranda');
    } else {
      fetchLeaflet();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchLeaflet = async () => {
    try {
      const docRef = doc(db, 'leaflets', params.id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const safeCategory = ALLOWED_CATEGORIES.includes(data.category)
          ? (data.category as (typeof ALLOWED_CATEGORIES)[number])
          : 'Pencegahan';
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: safeCategory,
          fileUrl: data.fileUrl || '',
          fileType: (data.fileType as 'pdf' | 'image') || 'pdf',
        });
      } else {
        alert('Leaflet tidak ditemukan');
        router.push('/admin/manage-content');
      }
    } catch (error) {
      console.error('Error fetching leaflet:', error);
      alert('Gagal memuat data leaflet');
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
      const docRef = doc(db, 'leaflets', params.id as string);

      await updateDoc(docRef, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileUrl: formData.fileUrl,
        fileType: formData.fileType,
      });

      alert('Leaflet berhasil diupdate!');
      router.push('/admin/manage-content');
    } catch (error) {
      console.error('Error updating leaflet:', error);
      alert('Gagal mengupdate leaflet');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.push('/admin/manage-content')}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4"
            >
              <ArrowLeft size={20} />
              Kembali
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Edit Leaflet</h1>
            <p className="text-gray-600">Perbarui informasi leaflet edukasi</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Leaflet *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="Masukkan judul leaflet"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-gray-900 min-h-[140px]"
                placeholder="Ringkasan isi leaflet"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as (typeof ALLOWED_CATEGORIES)[number] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-gray-900"
                  required
                >
                  {ALLOWED_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe File *</label>
                <select
                  value={formData.fileType}
                  onChange={(e) => setFormData({ ...formData, fileType: e.target.value as 'pdf' | 'image' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-gray-900"
                  required
                >
                  <option value="pdf">PDF</option>
                  <option value="image">Gambar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL File *</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-gray-900"
                placeholder="https://example.com/leaflet.pdf"
                required
              />
            </div>

            {formData.fileUrl && (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <div className="p-3 text-sm font-semibold text-gray-700">Pratinjau Leaflet</div>
                <div className="bg-white">
                  {formData.fileType === 'image' ? (
                    (() => {
                      const sources = getImageSources(formData.fileUrl);
                      return (
                        <img
                          src={sources[0]}
                          alt={formData.title || 'Preview leaflet'}
                          className="w-full max-h-96 object-contain bg-gray-50"
                          loading="lazy"
                          data-src-queue={sources.slice(1).join('|')}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            const queue = (target.dataset.srcQueue || '').split('|').filter(Boolean);
                            const next = queue.shift();
                            if (next) {
                              target.src = next;
                              target.dataset.srcQueue = queue.join('|');
                            } else {
                              target.style.display = 'none';
                            }
                          }}
                        />
                      );
                    })()
                  ) : (
                    <iframe
                      src={`${getPreviewUrl(formData.fileUrl, formData.fileType)}#toolbar=0&navpanes=0&scrollbar=0`}
                      title={formData.title || 'Preview leaflet'}
                      className="w-full h-96"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg font-semibold transition-colors"
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
