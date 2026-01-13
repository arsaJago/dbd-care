'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, AlertCircle, FileText } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

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

export default function UploadLeafletPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pencegahan',
    fileUrl: '',
    fileType: 'pdf',
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (!formData.title || !formData.description || !formData.fileUrl) {
        throw new Error('Judul, deskripsi, dan URL file wajib diisi');
      }

      await addDoc(collection(db, 'leaflets'), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileUrl: formData.fileUrl,
        fileType: formData.fileType,
        downloads: 0,
        createdAt: Timestamp.now(),
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: 'Pencegahan',
        fileUrl: '',
        fileType: 'pdf',
      });

      setTimeout(() => {
        router.push('/admin/manage-content');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">Upload Leaflet Edukasi</h1>
                <p className="text-teal-50 text-lg">Tambahkan leaflet edukasi DBD siap unduh</p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Leaflet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                    placeholder="Contoh: Langkah 3M Plus Cegah DBD"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Singkat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                    placeholder="Ringkasan isi leaflet"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                      required
                    >
                      <option value="Pencegahan">Pencegahan</option>
                      <option value="3M Plus">3M Plus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe File <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="fileType"
                      value={formData.fileType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                      required
                    >
                      <option value="pdf">PDF</option>
                      <option value="image">Gambar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL File Leaflet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                    placeholder="https://example.com/leaflet.pdf"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Gunakan URL hosting eksternal (ImgBB/Cloudinary/Drive). Pastikan dapat diakses publik.
                  </p>
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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-medium">✅ Leaflet berhasil ditambahkan!</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Leaflet</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/admin/manage-content')}
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
