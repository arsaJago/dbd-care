'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Circle, Trophy, RefreshCw } from 'lucide-react';
import { checklistItems } from '@/lib/data';

export default function ChecklistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Load from localStorage
      const saved = localStorage.getItem('dbd-checklist');
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems(new Array(checklistItems.length).fill(false));
      }
    }
  }, [isAuthenticated, router]);

  const handleToggle = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    localStorage.setItem('dbd-checklist', JSON.stringify(newCheckedItems));

    // Check if all items are checked
    const allChecked = newCheckedItems.every(item => item === true);
    if (allChecked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin mereset semua checklist?');
    if (confirmed) {
      const resetItems = new Array(checklistItems.length).fill(false);
      setCheckedItems(resetItems);
      localStorage.setItem('dbd-checklist', JSON.stringify(resetItems));
    }
  };

  const completedCount = checkedItems.filter(item => item).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

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
              <div className="flex items-center justify-between mb-4">
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
                  onClick={handleReset}
                  className="text-purple-600 hover:text-purple-700 flex items-center space-x-1 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border-2 ${
                    checkedItems[index]
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-transparent'
                  }`}
                  onClick={() => handleToggle(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {checkedItems[index] ? (
                        <CheckCircle2 className="w-7 h-7 text-purple-600" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          checkedItems[index]
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
                </div>
              ))}
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
          </div>
        </div>
      </main>

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
