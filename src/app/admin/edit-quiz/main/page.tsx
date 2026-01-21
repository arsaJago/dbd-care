"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { quizQuestions } from "@/lib/data";
import { Edit, ArrowLeft } from "lucide-react";

export default function EditQuizPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  const normalizeQuestions = (items: any[]) =>
    items.map((q) => {
      const rawOptions = Array.isArray(q.options) ? q.options : [];
      const options = rawOptions.slice(0, 2);
      while (options.length < 2) options.push('');
      const correctAnswer = typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 1
        ? q.correctAnswer
        : 0;
      return { ...q, options, correctAnswer };
    });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/beranda");
    } else {
      fetchQuiz();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchQuiz = async () => {
    try {
      const docRef = doc(db, "quizzes", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuestions(normalizeQuestions(docSnap.data().questions || []));
      } else {
        setQuestions(normalizeQuestions(quizQuestions));
      }
    } catch (error) {
      setQuestions(normalizeQuestions(quizQuestions));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: string, value: string | number | string[]) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const quizRef = doc(db, "quizzes", "main");
      const normalizedQuestions = normalizeQuestions(questions);
      try {
        await updateDoc(quizRef, { questions: normalizedQuestions });
      } catch (err) {
        // Jika update gagal (dokumen belum ada), buat baru
        const { setDoc } = await import("firebase/firestore");
        await setDoc(quizRef, { questions: normalizedQuestions });
      }
      setQuestions(normalizedQuestions);
      alert("Quiz berhasil diperbarui!");
      router.push("/admin/manage-content");
    } catch (error) {
      alert("Gagal menyimpan quiz!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/admin/manage-content")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Quiz DBD</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="bg-white rounded-xl shadow-md p-6 space-y-6"
        >
          {questions.map((q, idx) => (
            <div key={idx} className="mb-6 border-b pb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Soal {idx + 1}
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleChange(idx, "question", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-2 text-gray-900"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {q.options.map((opt: string, i: number) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const opts = [...q.options];
                      opts[i] = e.target.value;
                      handleChange(idx, "options", opts);
                    }}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 ${q.correctAnswer === i ? "border-purple-500" : ""}`}
                    required
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-700">Jawaban Benar:</span>
                {q.options.map((opt: string, i: number) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleChange(idx, "correctAnswer", i)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${q.correctAnswer === i ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </button>
                ))}
              </div>
              <textarea
                value={q.explanation}
                onChange={(e) => handleChange(idx, "explanation", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-900"
                placeholder="Penjelasan soal..."
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg transition-colors"
          >
            {saving ? "Menyimpan..." : "Simpan Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
