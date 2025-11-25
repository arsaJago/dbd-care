'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, 
  User, 
  Calendar, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';

interface QuizResponse {
  id: string;
  username: string;
  score: number;
  answers: number[];
  createdAt: Timestamp;
}

export default function QuizResultsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalResponses: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    passCount: 0, // Score >= 8
  });

  useEffect(() => {
    if (!isAdmin) {      router.push('/login');    } else {      fetchQuizResponses();    }
  }, [isAdmin, router]);

  const fetchQuizResponses = async () => {
    try {
      const q = query(collection(db, 'quizResponses'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const responses: QuizResponse[] = [];

      querySnapshot.forEach((doc) => {
        responses.push({ id: doc.id, ...doc.data() } as QuizResponse);
      });

      setQuizResponses(responses);
      calculateStats(responses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz responses:', error);
      setLoading(false);
    }
  };

  const calculateStats = (responses: QuizResponse[]) => {
    if (responses.length === 0) {
      setStats({
        totalResponses: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passCount: 0,
      });
      return;
    }

    const scores = responses.map(r => r.score);
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / responses.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passCount = responses.filter(r => r.score >= 8).length;

    setStats({
      totalResponses: responses.length,
      averageScore: Math.round(average * 100) / 100,
      highestScore: highest,
      lowestScore: lowest,
      passCount,
    });
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (window.confirm('Yakin ingin menghapus hasil quiz ini?')) {
      try {
        await deleteDoc(doc(db, 'quizResponses', responseId));
        const updatedResponses = quizResponses.filter(r => r.id !== responseId);
        setQuizResponses(updatedResponses);
        calculateStats(updatedResponses);
        alert('Hasil quiz berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting response:', error);
        alert('Gagal menghapus hasil quiz.');
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-blue-600 bg-blue-100';
    if (score >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 9) return '🏆 Excellent';
    if (score >= 7) return '👍 Good';
    if (score >= 5) return '📚 Fair';
    return '📖 Needs Improvement';
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hasil Quiz DBD</h1>
          <p className="text-gray-600">
            Monitor dan kelola hasil quiz pengguna
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quiz</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalResponses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata Skor</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skor Tertinggi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highestScore}/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skor Terendah</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowestScore}/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lulus (≥8)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.passCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Hasil Quiz</h2>
          </div>

          {quizResponses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quizResponses.map((response) => (
                    <React.Fragment key={response.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                              {response.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(response.score)}`}>
                            {response.score}/10
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {getScoreBadge(response.score)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(response.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setExpandedResponse(
                              expandedResponse === response.id ? null : response.id
                            )}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {expandedResponse === response.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteResponse(response.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {expandedResponse === response.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="text-sm text-gray-700">
                              <h4 className="font-semibold mb-2">Detail Jawaban:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {response.answers.map((answer, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <span className="font-medium">Soal {index + 1}:</span>
                                    <span>Pilihan {answer + 1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Belum ada hasil quiz</p>
              <p className="text-gray-500">Hasil quiz akan muncul setelah pengguna menyelesaikan quiz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
