'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Image as ImageIcon, 
  Video, 
  ClipboardCheck, 
  Users, 
  TrendingUp, 
  Award,
  Shield,
  Heart,
  Activity,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import MaterialCard from '@/components/MaterialCard';
import { Material } from '@/types';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState({
    materials: 0,
    posters: 0,
    videos: 0,
    users: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchLatestMaterials();
  }, []);

  const fetchStats = async () => {
    try {
      const materialsCount = await getDocs(collection(db, 'materials'));
      const postersCount = await getDocs(collection(db, 'posters'));
      const videosCount = await getDocs(collection(db, 'videos'));
      const usersCount = await getDocs(collection(db, 'users'));

      setStats({
        materials: materialsCount.size,
        posters: postersCount.size,
        videos: videosCount.size,
        users: usersCount.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  const features = [
    {
      icon: BookOpen,
      title: 'Materi Lengkap',
      description: 'Berbagai materi edukasi tentang pencegahan dan penanganan DBD',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: ImageIcon,
      title: 'Poster & Leaflet',
      description: 'Download poster edukasi untuk dibagikan ke keluarga dan tetangga',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Video,
      title: 'Video Pembelajaran',
      description: 'Tonton video singkat dan mudah dipahami tentang pencegahan DBD',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: ClipboardCheck,
      title: 'Quiz Interaktif',
      description: 'Uji pemahaman DBD dengan pertanyaan singkat dan edukatif',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const statsData = [
    { icon: BookOpen, label: 'Materi Edukasi', value: stats.materials, color: 'text-green-600' },
    { icon: ImageIcon, label: 'Poster Tersedia', value: stats.posters, color: 'text-blue-600' },
    { icon: Video, label: 'Video Pembelajaran', value: stats.videos, color: 'text-red-600' },
    { icon: Users, label: 'Pengguna Terdaftar', value: stats.users, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-emerald-900/30 to-transparent" aria-hidden="true"></div>
        <div className="container mx-auto py-14 md:py-20 lg:py-24 min-h-[360px] md:min-h-[420px] lg:min-h-[460px] flex items-center relative z-10">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center px-3 py-1 bg-white/15 rounded-full text-2xl font-semibold backdrop-blur-sm">
               <span className="mr-2">Halo!</span>
               <span aria-hidden="true">👋</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Cegah DBD Mulai Dari Sekarang
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              DBD Care adalah media edukasi digital untuk meningkatkan pengetahuan dan sikap masyarakat dalam pencegahan Demam Berdarah Dengue dengan mudah dan interaktif.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <Link
                href="/materi"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/30 transition duration-200"
              >
                Mulai Belajar
              </Link>
              <Link
                href="/materi"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/85 text-emerald-800 hover:bg-white font-semibold rounded-lg transition duration-200"
              >
                Lihat Materi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <Icon size={40} className={`mx-auto mb-3 ${stat.color}`} />
                  <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Akses berbagai materi edukasi dan tools untuk membantu mencegah DBD di keluarga Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Materials Section */}
      {materials.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Materi Terbaru
              </h2>
              <p className="text-gray-600 text-lg">
                Jelajahi materi edukasi DBD terbaru
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/materi"
                className="inline-block px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Lihat Semua Materi
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-500 to-blue-500 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <Award size={64} className="mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Jadilah Pahlawan Anti DBD!
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Bergabung dengan ribuan orangtua yang sudah berkomitmen melindungi keluarga dari DBD
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg shadow-xl"
          >
            Daftar Gratis Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
