'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Trophy, RefreshCw } from 'lucide-react';
import { defaultChecklistItems } from '@/lib/data';
import { ChecklistItem } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import SequentialNav from '@/components/SequentialNav';

export default function ChecklistPage() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const checklistQuery = query(collection(db, 'checklist'), orderBy('order', 'asc'));
        const snapshot = await getDocs(checklistQuery);

        const items: ChecklistItem[] = snapshot.empty
          ? defaultChecklistItems
          : snapshot.docs
              .map((docSnapshot, index) => {
                const data = docSnapshot.data() as Record<string, unknown>;
                return {
                  id: docSnapshot.id,
                  title: (data.title as string) || `Checklist ${index + 1}`,
                  description: (data.description as string) || '',
                  category: (data.category as string) || 'Lainnya',
                  frequency: (data.frequency as string) || 'Tidak ditentukan',
                  order: typeof data.order === 'number' ? (data.order as number) : index + 1,
                } satisfies ChecklistItem;
              })
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const saved = localStorage.getItem('dbd-checklist');
        let savedState: Record<string, boolean> = {};
        if (saved) {
          try {
            savedState = JSON.parse(saved);
          } catch (error) {
            console.warn('Gagal membaca progres checklist tersimpan:', error);
          }
        }

        const normalized = items.reduce<Record<string, boolean>>((acc, item) => {
          acc[item.id] = Boolean(savedState[item.id]);
          return acc;
        }, {});

        setChecklistItems(items);
        setCheckedItems(normalized);
        localStorage.setItem('dbd-checklist', JSON.stringify(normalized));
      } catch (error) {
        console.error('Error fetching checklist:', error);
        const fallbackState = defaultChecklistItems.reduce<Record<string, boolean>>((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {});

        setChecklistItems(defaultChecklistItems);
        setCheckedItems(fallbackState);
        localStorage.setItem('dbd-checklist', JSON.stringify(fallbackState));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChecklist();
  }, []);

  const handleToggle = (itemId: string) => {
    const updated = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(updated);
    localStorage.setItem('dbd-checklist', JSON.stringify(updated));

    const allChecked = checklistItems.length > 0 && checklistItems.every(item => updated[item.id]);
    if (allChecked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin mereset semua checklist?');
    if (confirmed) {
      const resetState = checklistItems.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {});
      setCheckedItems(resetState);
      localStorage.setItem('dbd-checklist', JSON.stringify(resetState));
    }
  };

  const completedCount = checklistItems.reduce((total, item) => (checkedItems[item.id] ? total + 1 : total), 0);
  const progressPercentage = checklistItems.length > 0 ? (completedCount / checklistItems.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
        </div>
      )}

      <main className="flex-grow pt-16">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Checklist Pencegahan DBD
              </h1>
              <p className="text-lg text-purple-100">
                Pastikan keluarga Anda aman dari bahaya DBD dengan mengikuti checklist ini
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4" aria-live="polite">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Progress Anda
                  </h2>
                  <p className="text-gray-600">
                    {completedCount} dari {checklistItems.length} item selesai
                  </p>
                </div>
                {progressPercentage === 100 && (
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">Sempurna!</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {progressPercentage.toFixed(0)}% Selesai
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-purple-600 hover:text-purple-700 flex items-center space-x-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2"
                  aria-label="Reset checklist"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {checklistItems.map((item) => {
                const isChecked = Boolean(checkedItems[item.id]);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`block w-full text-left bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isChecked ? 'border-purple-500 bg-purple-50' : 'border-transparent'
                    }`}
                    onClick={() => handleToggle(item.id)}
                    aria-pressed={isChecked}
                    aria-label={`${isChecked ? 'Batal centang' : 'Centang'} ${item.title}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {isChecked ? (
                          <CheckCircle2 className="w-7 h-7 text-purple-600" />
                        ) : (
                          <Circle className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold mb-2 ${
                            isChecked
                              ? 'text-purple-700 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                        <div className="mt-3 flex items-center space-x-2">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.frequency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Completion Message */}
            {progressPercentage === 100 && (
              <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Selamat! Anda Hebat! 🎉
                </h3>
                <p className="text-lg text-green-100 mb-4">
                  Anda telah menyelesaikan semua checklist pencegahan DBD.
                  Keluarga Anda sekarang lebih aman dari bahaya DBD!
                </p>
                <p className="text-sm text-green-100">
                  Jangan lupa untuk mengecek kembali secara berkala (minimal 1 minggu sekali)
                </p>
              </div>
            )}

            {/* Flow Navigation - Step 5 -> Beranda */}
            <SequentialNav step={5} total={5} nextHref="/beranda" nextLabel="Beranda" variant="purple" className="mb-12" />
          </div>
        </div>
      </main>

      <div
        className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-full bg-white shadow-lg px-4 py-3 md:hidden"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
          <span className="font-semibold">Progress {progressPercentage.toFixed(0)}%</span>
          <div
            className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden"
            role="progressbar"
            aria-label="Kemajuan checklist"
            aria-valuenow={Number(progressPercentage.toFixed(0))}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
              style={{ width: `${progressPercentage}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: fall 3s linear forwards;
        }
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
