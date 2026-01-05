'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { X, Search } from 'lucide-react';
import SequentialNav from '@/components/SequentialNav';

const ALLOWED_POSTER_CATEGORIES = ['Pencegahan', '3M Plus'] as const;

// Placeholder posters with Unsplash images
const placeholderPosters = [
  {
    id: '1',
    title: 'Cegah DBD dengan 3M Plus',
    category: '3M Plus',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 245,
  },
  {
    id: '2',
    title: '3M Plus: Cara Mudah Cegah DBD',
    category: 'Pencegahan',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 189,
  },
  {
    id: '3',
    title: 'Checklist Pencegahan Rutin',
    category: 'Pencegahan',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 156,
  },
  {
    id: '4',
    title: '3 Langkah 3M Plus',
    category: '3M Plus',
    imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 203,
  },
  {
    id: '5',
    title: 'Tips Membersihkan Bak Mandi',
    category: 'Pencegahan',
    imageUrl: 'https://images.unsplash.com/photo-1600428081814-59ec59fb84a6?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 134,
  },
  {
    id: '6',
    title: 'Zona Bebas Jentik',
    category: '3M Plus',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 98,
  },
];

export default function PosterPage() {
    // Helper to extract Google Drive FILE_ID and build direct link
    function getDriveFileId(url: string) {
      // Support /file/d/FILE_ID and /open?id=FILE_ID
      const match = url.match(/\/file\/d\/([\w-]+)/);
      if (match) return match[1];
      const idMatch = url.match(/[?&]id=([\w-]+)/);
      if (idMatch) return idMatch[1];
      return '';
    }

    function getPosterImageUrl(url: string) {
      if (!url) return 'https://via.placeholder.com/600x800?text=No+Poster';
      if (url.includes('drive.google.com')) {
        const fileId = getDriveFileId(url);
        return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : url;
      }
      return url;
    }

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [posters, setPosters] = useState<any[]>([]);
  const [filteredPosters, setFilteredPosters] = useState<any[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      setIsLoading(true);
      const { db } = await import('@/lib/firebase');
      const { collection, getDocs } = await import('firebase/firestore');
      const querySnapshot = await getDocs(collection(db, 'posters'));
      const postersData: any[] = [];
      querySnapshot.forEach((doc) => {
        postersData.push({ id: doc.id, ...doc.data() });
      });
      const normalized = postersData.map((poster) => {
        const safeCategory = ALLOWED_POSTER_CATEGORIES.includes(poster.category)
          ? poster.category
          : 'Pencegahan';
        return { ...poster, category: safeCategory };
      });
      setPosters(normalized);
      setFilteredPosters(normalized);
    } catch (error) {
      console.error('Error fetching posters:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Hilangkan redirect ke login agar poster bisa diakses anonymous user

  useEffect(() => {
    let result = posters;

    // Filter by category
    if (selectedCategory !== 'Semua') {
      result = result.filter(poster => poster.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter(poster =>
        poster.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosters(result);
  }, [searchQuery, selectedCategory, posters]);

  const categories = ['Semua', ...ALLOWED_POSTER_CATEGORIES];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-sky-700 via-blue-600 to-indigo-700 text-white py-14">
          <div className="absolute -left-12 top-4 h-48 w-48 rounded-full bg-white/15 blur-3xl" aria-hidden="true"></div>
          <div className="absolute right-0 -bottom-14 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl" aria-hidden="true"></div>
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Poster Edukasi Pencegahan DBD</h1>
            <p className="text-white/90 max-w-3xl text-base md:text-lg">
              Koleksi poster edukasi pencegahan DBD sebagai sarana edukasi pencegahan DBD di masyarakat.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-white/90">
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Ringkas</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Mudah dipahami</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Praktis</span>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari poster..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Poster Grid */}
            {filteredPosters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosters.map((poster) => {
                  const imageUrl = getPosterImageUrl(poster.fileUrl || poster.imageUrl);
                  return (
                    <div
                      key={poster.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-visible group cursor-pointer"
                      onClick={() => setSelectedPoster(poster)}
                    >
                      <img
                        src={imageUrl}
                        alt={poster.title}
                        className="w-full h-64 object-contain bg-gray-100 border border-red-400"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'; }}
                      />
                      <div className="p-4">
                        <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mb-2">
                          {poster.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {poster.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Tidak ada poster ditemukan</p>
              </div>
            )}
            {/* Flow Navigation - Step 2 -> Video */}
            <SequentialNav step={2} total={5} nextHref="/video" nextLabel="Video" variant="blue" />
          </div>
        </div>
      </main>

      {/* Modal Preview */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-50 bg-gray-950 bg-opacity-80 backdrop-blur-sm"
          onClick={() => setSelectedPoster(null)}
        >
          <div
            className="relative flex h-full w-full flex-col overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute right-6 top-6 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-0 py-16 md:py-12">
              <div className="text-center text-white">
                <h2 className="text-2xl font-semibold md:text-3xl">{selectedPoster.title}</h2>
                <span className="mt-3 inline-flex items-center rounded-full bg-green-500 px-4 py-1 text-sm font-medium text-white">
                  {selectedPoster.category}
                </span>
              </div>
              <img
                src={getPosterImageUrl(selectedPoster.fileUrl || selectedPoster.imageUrl)}
                alt={selectedPoster.title}
                className="h-full w-full max-w-5xl object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x800?text=No+Poster';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
