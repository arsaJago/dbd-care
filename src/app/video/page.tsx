'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Play, X, Search, Eye } from 'lucide-react';
import { extractYouTubeId } from '@/lib/utils';

// Placeholder videos - pakai video YouTube sebenarnya tentang DBD
const placeholderVideos = [
  {
    id: '1',
    title: 'Apa Itu Demam Berdarah Dengue (DBD)?',
    category: 'Pengenalan',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '5:24',
    views: 1243,
    description: 'Pengenalan lengkap tentang penyakit DBD dan cara penularannya',
  },
  {
    id: '2',
    title: 'Gerakan 3M Plus Cegah DBD',
    category: 'Pencegahan',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '4:12',
    views: 892,
    description: 'Tutorial praktis melakukan 3M Plus di rumah Anda',
  },
  {
    id: '3',
    title: 'Kenali Gejala DBD Sejak Dini',
    category: 'Gejala',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '6:45',
    views: 1567,
    description: 'Pelajari gejala DBD agar bisa segera ditangani',
  },
  {
    id: '4',
    title: 'Cara Merawat Penderita DBD di Rumah',
    category: 'Perawatan',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '8:30',
    views: 743,
    description: 'Tips merawat anggota keluarga yang terkena DBD',
  },
  {
    id: '5',
    title: 'Fogging: Kapan dan Bagaimana?',
    category: 'Penanganan',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '3:56',
    views: 654,
    description: 'Mengenal proses fogging untuk memberantas nyamuk DBD',
  },
  {
    id: '6',
    title: 'Nyamuk Aedes Aegypti: Musuh Utama Kita',
    category: 'Edukasi',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '7:20',
    views: 1089,
    description: 'Mengenal karakteristik dan habitat nyamuk penyebab DBD',
  },
];

export default function VideoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState(placeholderVideos);
  const [filteredVideos, setFilteredVideos] = useState(placeholderVideos);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let result = videos;

    // Filter by category
    if (selectedCategory !== 'Semua') {
      result = result.filter(video => video.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVideos(result);
  }, [searchQuery, selectedCategory, videos]);

  const categories = ['Semua', ...Array.from(new Set(videos.map(v => v.category)))];

  const handlePlayVideo = (video: any) => {
    setSelectedVideo(video);
    
    // Update view count
    setVideos(prev =>
      prev.map(v =>
        v.id === video.id ? { ...v, views: v.views + 1 } : v
      )
    );
  };

  const getYouTubeThumbnail = (youtubeUrl: string) => {
    const videoId = extractYouTubeId(youtubeUrl);
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Video Edukasi DBD
              </h1>
              <p className="text-lg text-red-100">
                Belajar tentang pencegahan DBD melalui video edukatif dan mudah dipahami
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
                    placeholder="Cari video..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Grid */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={getYouTubeThumbnail(video.youtubeUrl)}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>

                    <div className="p-4">
                      <span className="inline-block text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full mb-2">
                        {video.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Tidak ada video ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-white rounded-xl overflow-hidden">
              {/* YouTube Embed */}
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.youtubeUrl)}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <span className="inline-block text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full mb-3">
                  {selectedVideo.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedVideo.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedVideo.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{selectedVideo.views.toLocaleString()} views</span>
                  <span className="mx-2">•</span>
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
