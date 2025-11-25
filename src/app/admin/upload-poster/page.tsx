'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FileImage, Upload, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function UploadPosterPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Gejala',
    imageUrl: '',
    downloadUrl: '',
  });

  useEffect(() => {
    if (!isAdmin) {      router.push('/login');    }
  }, [isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Validation
      if (!formData.title || !formData.imageUrl) {
        throw new Error('Judul dan URL gambar wajib diisi');
      }

      // Add to Firestore
      await addDoc(collection(db, 'posters'), {
        title: formData.title,
        category: formData.category,
        imageUrl: formData.imageUrl,
        downloadUrl: formData.downloadUrl || formData.imageUrl,
        downloads: 0,
        createdAt: Timestamp.now(),
      });

      setSuccess(true);
      setFormData({
        title: '',
        category: 'Gejala',
        imageUrl: '',
        downloadUrl: '',
      });

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Upload Poster Edukasi
              </h1>
              <p className="text-lg text-green-100">
                Tambahkan poster edukasi DBD baru
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                <strong>Note:</strong> Karena Firebase Storage memerlukan upgrade billing, 
                silakan upload poster ke layanan eksternal seperti:
              </p>
              <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
                <li><a href="https://imgbb.com" target="_blank" className="underline">ImgBB</a> (gratis, tanpa login)</li>
                <li><a href="https://cloudinary.com" target="_blank" className="underline">Cloudinary</a> (gratis, dengan login)</li>
                <li><a href="https://postimages.org" target="_blank" className="underline">PostImages</a> (gratis)</li>
              </ul>
              <p className="text-blue-700 mt-2">
                Copy URL gambar yang dihasilkan, lalu paste di form di bawah.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Poster <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Contoh: Kenali Gejala DBD"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="Gejala">Gejala</option>
                    <option value="Pencegahan">Pencegahan</option>
                    <option value="Penanganan">Penanganan</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Bahaya">Bahaya</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Gambar Poster <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://i.ibb.co/xxxxx/poster.jpg"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL gambar dari layanan hosting eksternal (ImgBB, Cloudinary, dll)
                  </p>
                </div>

                {/* Download URL (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Download (opsional)
                  </label>
                  <input
                    type="url"
                    name="downloadUrl"
                    value={formData.downloadUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/poster-hd.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL untuk download versi HD. Kosongkan untuk menggunakan URL gambar yang sama
                  </p>
                </div>

                {/* Preview */}
                {formData.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=Invalid+URL';
                        }}
                      />
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
                      ✅ Poster berhasil ditambahkan! Redirecting...
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Poster</span>
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

