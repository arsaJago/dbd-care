'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Play, X, Search, Eye } from 'lucide-react';
import SequentialNav from '@/components/SequentialNav';
import { extractYouTubeId } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { Video } from '@/types';

export default function VideoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const videosData: Video[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        videosData.push({
          id: doc.id,
          ...data,
          category: data.category || 'Lainnya',
        } as Video & { category?: string });
      });

      setVideos(videosData);
      setFilteredVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = (videos as (Video & { category?: string })[]);

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

  const categories = ['Semua', ...Array.from(new Set((videos as (Video & { category?: string })[]).map(v => v.category || 'Lainnya')))];

  const handlePlayVideo = async (video: Video) => {
    setSelectedVideo(video);
    
    // Update view count in Firebase
    try {
      const videoRef = doc(db, 'videos', video.id);
      await updateDoc(videoRef, {
        views: increment(1)
      });
      
      // Update local state
      setVideos(prev =>
        prev.map(v =>
          v.id === video.id ? { ...v, views: v.views + 1 } : v
        )
      );
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const getYouTubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 ">
      <main className="flex-grow">
        {/* Header Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-rose-700 via-red-600 to-amber-500 text-white py-14">
          <div className="absolute -left-12 top-6 h-48 w-48 rounded-full bg-white/15 blur-3xl" aria-hidden="true"></div>
          <div className="absolute right-0 -bottom-14 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl" aria-hidden="true"></div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Video Edukasi Pencegahan DBD</h1>
            <p className="text-white/90 text-base md:text-lg mb-4">
              Tonton penjelasan singkat dan tenang terkait edukasi pencegahan Demam Berdarah.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-white/90">
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Durasi pendek</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Bahasa sederhana</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Bisa diputar ulang</span>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
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
                        src={getYouTubeThumbnail(video.youtubeId)}
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
                        {(video as Video & { category?: string }).category}
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
            {/* Flow Navigation - Step 3 -> Quiz */}
            <SequentialNav step={4} total={6} nextHref="/quiz" nextLabel="Quiz" variant="red" />
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
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <span className="inline-block text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full mb-4">
                  {(selectedVideo as Video & { category?: string }).category}
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
