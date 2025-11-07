'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Download, X, Search } from 'lucide-react';
import SequentialNav from '@/components/SequentialNav';

// Placeholder posters with Unsplash images
const placeholderPosters = [
  {
    id: '1',
    title: 'Kenali Gejala DBD',
    category: 'Gejala',
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
    title: 'Siklus Hidup Nyamuk Aedes',
    category: 'Edukasi',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 156,
  },
  {
    id: '4',
    title: 'Bahaya DBD untuk Anak',
    category: 'Bahaya',
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
    title: 'Fogging: Kapan Diperlukan?',
    category: 'Penanganan',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=800&fit=crop',
    downloadUrl: '#',
    downloads: 98,
  },
];

export default function PosterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [posters, setPosters] = useState(placeholderPosters);
  const [filteredPosters, setFilteredPosters] = useState(placeholderPosters);
  const [selectedPoster, setSelectedPoster] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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

  const categories = ['Semua', ...Array.from(new Set(posters.map(p => p.category)))];

  const handleDownload = (poster: any) => {
    // Simulate download
    alert(`Downloading: ${poster.title}\n\nNote: Ini adalah poster placeholder. Admin bisa upload poster asli nanti.`);
    
    // Update download count
    setPosters(prev =>
      prev.map(p =>
        p.id === poster.id ? { ...p, downloads: p.downloads + 1 } : p
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Poster Edukasi DBD
              </h1>
              <p className="text-lg text-green-100">
                Download dan bagikan poster edukasi untuk mencegah DBD di lingkungan Anda
              </p>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
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
                          ? 'bg-green-600 text-white'
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
                {filteredPosters.map((poster) => (
                  <div
                    key={poster.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedPoster(poster)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={poster.imageUrl}
                        alt={poster.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
                            <Download className="w-5 h-5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mb-2">
                        {poster.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {poster.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{poster.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Tidak ada poster ditemukan</p>
              </div>
            )}
            {/* Flow Navigation - Step 2 -> Video */}
            <SequentialNav step={2} total={5} nextHref="/video" nextLabel="Video" variant="green" />
          </div>
        </div>
      </main>

      {/* Modal Preview */}
      {selectedPoster && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPoster(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="max-h-[70vh] overflow-y-auto">
                <img
                  src={selectedPoster.imageUrl}
                  alt={selectedPoster.title}
                  className="w-full"
                />
              </div>
              <div className="p-6 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedPoster.title}
                </h2>
                <span className="inline-block text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full mb-4">
                  {selectedPoster.category}
                </span>
                <button
                  onClick={() => handleDownload(selectedPoster)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Poster</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
