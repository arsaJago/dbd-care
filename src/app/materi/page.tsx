'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import MaterialCard from '@/components/MaterialCard';
import { Material } from '@/types';
import { useActivityTracker } from '@/lib/activityTracker';

export default function MateriPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const activityTracker = useActivityTracker();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Semua', 'Pencegahan', '3M Plus'];

  // Halaman materi bisa diakses tanpa login

  useEffect(() => {
    fetchMaterials();
    // Log page visit hanya jika user login
    if (isAuthenticated) {
      activityTracker.logPageVisit('materi');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchQuery, selectedCategory]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, 'materials'));
      const materialsData: Material[] = [];

      querySnapshot.forEach((doc) => {
        materialsData.push({ id: doc.id, ...doc.data() } as Material);
      });

      setMaterials(materialsData);
      setFilteredMaterials(materialsData);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    // Filter by category
    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter((material) => material.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((material) =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  };

  if (loading || isLoading) {
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
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-16 overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute -left-10 top-6 h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden="true"></div>
        <div className="absolute right-0 -bottom-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" aria-hidden="true"></div>
        <div className="container mx-auto relative z-10 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Materi Edukasi Pencegahan DBD
          </h1>
          <p className="text-white/90 max-w-3xl text-base md:text-lg">
            Kumpulan informasi singkat seputar pencegahan, gejala, dan penanganan DBD.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/90">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Ringkas</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Mudah Dipahami</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Praktis</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12 -mt-10">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Tidak ada materi ditemukan</p>
          </div>
        )}

        {/* Flow Navigation - Step 1 -> Poster */}
        <div className="mt-12 flex flex-col items-center">
          <div className="text-sm text-gray-500 mb-3">Langkah 1 dari 5</div>
          <button
            onClick={() => router.push('/poster')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
          >
            Lanjut ke Poster
            <span className="inline-block">➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
