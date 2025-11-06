'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { Trash2, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function ClearDataPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const clearCollection = async (collectionName: string) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let deleted = 0;
    
    for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
      deleted++;
    }
    
    return deleted;
  };

  const handleClear = async () => {
    const confirmed = window.confirm(
      '⚠️ PERINGATAN!\n\nIni akan menghapus SEMUA data:\n- Semua materi\n- Semua poster\n- Semua video\n- Semua komentar\n- Semua quiz responses\n\nData user TIDAK dihapus.\n\nLanjutkan?'
    );

    if (!confirmed) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const materials = await clearCollection('materials');
      const posters = await clearCollection('posters');
      const videos = await clearCollection('videos');
      const comments = await clearCollection('comments');
      const quizResponses = await clearCollection('quizResponses');

      setResults({
        materials,
        posters,
        videos,
        comments,
        quizResponses,
        total: materials + posters + videos + comments + quizResponses,
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4">
              <Trash2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Clear Database
            </h1>
            <p className="text-gray-600">
              Hapus semua data konten (untuk seed ulang)
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-bold mb-2">⚠️ PERINGATAN!</p>
                <p className="mb-2">Tool ini akan menghapus:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Semua materi edukasi</li>
                  <li>Semua poster</li>
                  <li>Semua video</li>
                  <li>Semua komentar</li>
                  <li>Semua quiz responses</li>
                </ul>
                <p className="mt-3 font-semibold">
                  ✅ Data user TIDAK akan dihapus
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!results && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-6 h-6" />
                  <span>Clear All Data</span>
                </>
              )}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  Berhasil Dihapus! ✅
                </h2>
                <p className="text-lg font-semibold text-green-700">
                  {results.total} dokumen terhapus
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Materi:</span>
                  <span className="font-semibold">{results.materials}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Poster:</span>
                  <span className="font-semibold">{results.posters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Video:</span>
                  <span className="font-semibold">{results.videos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Komentar:</span>
                  <span className="font-semibold">{results.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Quiz Responses:</span>
                  <span className="font-semibold">{results.quizResponses}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/seed"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  Seed Ulang
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Gunakan tool ini hanya untuk development/testing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
