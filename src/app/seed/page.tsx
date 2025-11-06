'use client';

import { useState } from 'react';
import { seedAll } from '@/lib/seedData';
import { Database, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const seedResults = await seedAll();
      setResults(seedResults);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat seeding database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-4">
              <Database className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Database Seeder
            </h1>
            <p className="text-gray-600">
              Populate database dengan data dummy untuk testing
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Data yang akan ditambahkan:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>5 Materi edukasi DBD</li>
                  <li>6 Poster dengan placeholder images</li>
                  <li>6 Video YouTube tentang DBD</li>
                </ul>
                <p className="mt-3 text-blue-700">
                  <strong>Note:</strong> Data yang sudah ada tidak akan di-duplicate.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!results && (
            <button
              onClick={handleSeed}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Seeding Database...</span>
                </>
              ) : (
                <>
                  <Database className="w-6 h-6" />
                  <span>Seed Database</span>
                </>
              )}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 mb-1">Seeding Failed</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  Seeding Berhasil! 🎉
                </h2>
                <p className="text-green-700">
                  Database berhasil di-populate dengan data dummy
                </p>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-3 gap-4">
                {/* Materials */}
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {results.materials.success}
                  </p>
                  <p className="text-sm text-blue-800 font-medium">Materi</p>
                  {results.materials.skipped > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      {results.materials.skipped} skipped
                    </p>
                  )}
                </div>

                {/* Posters */}
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {results.posters.success}
                  </p>
                  <p className="text-sm text-green-800 font-medium">Poster</p>
                  {results.posters.skipped > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      {results.posters.skipped} skipped
                    </p>
                  )}
                </div>

                {/* Videos */}
                <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                  <p className="text-3xl font-bold text-purple-600 mb-1">
                    {results.videos.success}
                  </p>
                  <p className="text-sm text-purple-800 font-medium">Video</p>
                  {results.videos.skipped > 0 && (
                    <p className="text-xs text-purple-600 mt-1">
                      {results.videos.skipped} skipped
                    </p>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Berhasil:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {results.total.success}
                  </span>
                </div>
                {results.total.skipped > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 text-sm">Total Dilewati:</span>
                    <span className="text-lg font-semibold text-gray-500">
                      {results.total.skipped}
                    </span>
                  </div>
                )}
                {results.total.failed > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-red-600 text-sm">Total Gagal:</span>
                    <span className="text-lg font-semibold text-red-600">
                      {results.total.failed}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href="/beranda"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  Lihat Website
                </a>
                <button
                  onClick={() => {
                    setResults(null);
                    setError('');
                  }}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Seed Lagi
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              DBD Care - Database Seeder v1.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Untuk testing & development only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
