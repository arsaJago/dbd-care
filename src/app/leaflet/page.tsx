'use client';

import { useEffect, useState } from 'react';
import { Search, Download, FileText } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { Leaflet } from '@/types';
import SequentialNav from '@/components/SequentialNav';

const categories = ['Semua', 'Pencegahan', '3M Plus'] as const;

const extractDriveId = (url: string) => {
  const bySlash = url.match(/\/d\/([^/]+)/);
  if (bySlash?.[1]) return bySlash[1];
  const byQuery = url.match(/[?&]id=([^&]+)/);
  return byQuery?.[1];
};

const getPreviewUrl = (leaflet: Leaflet) => {
  const isDrive = leaflet.fileUrl.includes('drive.google.com');
  if (!isDrive) return leaflet.fileUrl;
  const id = extractDriveId(leaflet.fileUrl);
  if (!id) return leaflet.fileUrl;

  const type = leaflet.fileType?.toLowerCase?.();
  if (type === 'image') return `https://drive.google.com/uc?export=view&id=${id}`;
  if (type === 'pdf') return `https://drive.google.com/file/d/${id}/preview`;
  return leaflet.fileUrl;
};

const getThumbnailUrl = (leaflet: Leaflet) => {
  const isDrive = leaflet.fileUrl.includes('drive.google.com');
  if (!isDrive) return leaflet.fileUrl;
  const id = extractDriveId(leaflet.fileUrl);
  if (!id) return leaflet.fileUrl;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
};

const getDownloadUrl = (leaflet: Leaflet) => {
  const isDrive = leaflet.fileUrl.includes('drive.google.com');
  if (!isDrive) return leaflet.fileUrl;
  const id = extractDriveId(leaflet.fileUrl);
  if (!id) return leaflet.fileUrl;
  return `https://drive.google.com/uc?export=download&id=${id}`;
};

export default function LeafletPage() {
  const [leaflets, setLeaflets] = useState<Leaflet[]>([]);
  const [filtered, setFiltered] = useState<Leaflet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaflets();
  }, []);

  useEffect(() => {
    let result = leaflets;
    if (selectedCategory !== 'Semua') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFiltered(result);
  }, [searchQuery, selectedCategory, leaflets]);

  const fetchLeaflets = async () => {
    try {
      setIsLoading(true);
      const snap = await getDocs(collection(db, 'leaflets'));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Leaflet[];
      setLeaflets(data);
      setFiltered(data);
    } catch (error) {
      console.error('Error fetching leaflets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (leaflet: Leaflet) => {
    try {
      const docRef = doc(db, 'leaflets', leaflet.id);
      await updateDoc(docRef, { downloads: increment(1) });
      setLeaflets((prev) => prev.map((l) => (l.id === leaflet.id ? { ...l, downloads: l.downloads + 1 } : l)));
    } catch (error) {
      console.error('Error updating downloads:', error);
    }
    const downloadUrl = getDownloadUrl(leaflet);
    window.open(downloadUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat leaflet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white py-14">
          <div className="absolute -left-12 top-4 h-48 w-48 rounded-full bg-white/15 blur-3xl" aria-hidden="true"></div>
          <div className="absolute right-0 -bottom-14 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" aria-hidden="true"></div>
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Leaflet Edukasi DBD</h1>
            <p className="text-white/90 max-w-3xl text-base md:text-lg">
              Koleksi leaflet edukasi pencegahan DBD yang siap diunduh dan dibagikan.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-white/90">
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Praktis</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Bisa dicetak</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Untuk keluarga</span>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari leaflet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48 bg-gray-50 border-b border-gray-100">
                      {item.fileType?.toLowerCase?.() === 'image' ? (
                        <img
                          src={getThumbnailUrl(item)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement & { dataset: { fallbackApplied?: string } };
                            if (target.dataset.fallbackApplied === '1') {
                              target.style.display = 'none';
                              return;
                            }
                            target.dataset.fallbackApplied = '1';
                            target.src = getPreviewUrl(item);
                          }}
                        />
                      ) : item.fileType?.toLowerCase?.() === 'pdf' ? (
                        <iframe
                          src={`${getPreviewUrl(item)}#toolbar=0&navpanes=0&scrollbar=0`}
                          title={item.title}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500 text-sm gap-2">
                          <FileText className="w-4 h-4" />
                          Pratinjau tidak tersedia
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-block text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {item.fileType?.toUpperCase?.() || item.fileType}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{item.downloads} unduhan</span>
                        <button
                          onClick={() => handleDownload(item)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
                        >
                          <Download className="w-4 h-4" />
                          Unduh
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Tidak ada leaflet ditemukan</p>
              </div>
            )}

            <SequentialNav step={3} total={6} nextHref="/video" nextLabel="Video" variant="blue" />
          </div>
        </div>
      </main>
    </div>
  );
}
