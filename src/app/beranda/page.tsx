'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Image as ImageIcon, Video, ClipboardCheck, List, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import MaterialCard from '@/components/MaterialCard';
import VideoCard from '@/components/VideoCard';
import { Material, Video as VideoType } from '@/types';

export default function BerandaPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [readCount, setReadCount] = useState(0);

  // Halaman beranda bisa diakses tanpa login

  useEffect(() => {
    fetchLatestMaterials();
    fetchPopularVideos();
    // In a real app, track user's read materials jika login
    if (isAuthenticated) {
      setReadCount(0);
    }
  }, [isAuthenticated]);

  const fetchLatestMaterials = async () => {
    try {
      const q = query(collection(db, 'materials'), orderBy('createdAt', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const materialsData: Material[] = [];

      querySnapshot.forEach((doc) => {
        materialsData.push({ id: doc.id, ...doc.data() } as Material);
      });

      setMaterials(materialsData);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const fetchPopularVideos = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('views', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const videosData: VideoType[] = [];

      querySnapshot.forEach((doc) => {
        videosData.push({ id: doc.id, ...doc.data() } as VideoType);
      });

      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const menuItems = [
    {
      href: '/materi',
      title: 'Materi Edukasi',
      description: 'Pelajari tentang DBD dan pencegahannya',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
    },
    {
      href: '/poster',
      title: 'Poster & Leaflet',
      description: 'Download poster untuk dibagikan',
      icon: ImageIcon,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      href: '/video',
      title: 'Video Pembelajaran',
      description: 'Tonton video edukasi DBD',
      icon: Video,
      color: 'from-red-500 to-rose-500',
    },
    {
      href: '/quiz',
      title: 'Quiz DBD',
      description: 'Uji pemahaman Anda',
      icon: ClipboardCheck,
      color: 'from-purple-500 to-pink-500',
    },
    {
      href: '/checklist',
      title: 'Checklist Pencegahan',
      description: 'Pantau kegiatan pencegahan DBD',
      icon: List,
      color: 'from-orange-500 to-amber-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Halo, {user?.username || ''}! 👋
          </h1>
          <p className="text-lg text-white/90">
            Selamat datang di DBD Care. Mari belajar bersama mencegah DBD!
          </p>
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="text-green-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Progress Belajar Anda</h2>
            </div>
            <p className="text-gray-600">
              Kamu sudah membaca <span className="font-bold text-green-600">{readCount} materi</span>. Terus semangat belajar!
            </p>
          </div>
        </div>
      </section>

      {/* Menu Cards */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Utama</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} href={item.href}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 h-full">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Materials */}
      {materials.length > 0 && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Materi Terbaru</h2>
              <Link href="/materi" className="text-green-600 hover:text-green-700 font-semibold">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Videos */}
      {videos.length > 0 && (
        <section className="py-8 px-4 pb-12">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Video Populer</h2>
              <Link href="/video" className="text-green-600 hover:text-green-700 font-semibold">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} onWatch={() => router.push('/video')} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
