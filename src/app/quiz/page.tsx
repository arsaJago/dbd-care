'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { quizQuestions as defaultQuestions } from '@/lib/data';
import { doc, getDoc } from 'firebase/firestore';

type QuizState = 'intro' | 'quiz' | 'result';

export default function QuizPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<any[]>(defaultQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(defaultQuestions.length).fill(-1));
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quizzes', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const q = docSnap.data().questions || defaultQuestions;
          setQuestions(q);
          setSelectedAnswers(new Array(q.length).fill(-1));
        } else {
          setQuestions(defaultQuestions);
          setSelectedAnswers(new Array(defaultQuestions.length).fill(-1));
        }
      } catch (error) {
        setQuestions(defaultQuestions);
        setSelectedAnswers(new Array(defaultQuestions.length).fill(-1));
      }
    };
    fetchQuiz();
  }, []);

  // Halaman quiz bisa diakses tanpa login

  const startQuiz = () => {
    setQuizState('quiz');
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setScore(0);
    setShowExplanation(false);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const handleFinish = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizState('result');

    // Save to Firestore
    if (user) {
      try {
        await addDoc(collection(db, 'quizResponses'), {
          username: user.username,
          score: finalScore,
          answers: selectedAnswers,
          createdAt: Timestamp.now(),
        });
      } catch (error) {
        console.error('Error saving quiz response:', error);
      }
    }
  };

  const getScorePercentage = () => {
    return (score / questions.length) * 100;
  };

  const getScoreFeedback = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return { text: 'Luar Biasa! 🎉', color: 'text-green-600', badge: true };
    if (percentage >= 60) return { text: 'Bagus! 👍', color: 'text-blue-600', badge: false };
    return { text: 'Belajar Lagi! 📚', color: 'text-orange-600', badge: false };
  };

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

  // Intro State
  if (quizState === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={40} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Quiz DBD
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Uji pemahaman Anda tentang Demam Berdarah Dengue dengan quiz interaktif ini!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">Informasi Quiz:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Total 10 pertanyaan multiple choice</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Anda bisa kembali ke soal sebelumnya</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Skor minimal 80% untuk mendapat badge "Pahlawan Cegah DBD"</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Setiap jawaban akan ada penjelasannya</span>
                </li>
              </ul>
            </div>
            <button
              onClick={startQuiz}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition text-lg shadow-lg"
            >
              Mulai Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz State
  if (quizState === 'quiz') {
    const question = questions[currentQuestion];
    const isAnswered = selectedAnswers[currentQuestion] !== -1;
    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Soal {currentQuestion + 1} dari {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {(question.options as string[]).map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation (show after answered) */}
            {isAnswered && showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Penjelasan:</p>
                    <p className="text-sm text-blue-800">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />
              <span>Sebelumnya</span>
            </button>

            {isAnswered && !showExplanation && (
              <button
                onClick={() => setShowExplanation(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Lihat Penjelasan
              </button>
            )}

            {isLastQuestion ? (
              <button
                onClick={handleFinish}
                disabled={!isAnswered}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Lihat Hasil</span>
                <CheckCircle size={20} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Selanjutnya</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Result State
  const feedback = getScoreFeedback();
  const percentage = getScorePercentage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-white">{score}</span>
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${feedback.color}`}>
              {feedback.text}
            </h1>
            <p className="text-xl text-gray-600">
              Skor Anda: {score} dari {questions.length} ({percentage.toFixed(0)}%)
            </p>
          </div>

          {/* Badge */}
          {feedback.badge && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center mb-8">
              <Award size={48} className="mx-auto mb-3 text-white" />
              <p className="text-white font-bold text-lg">
                🏆 Selamat! Anda mendapat badge "Pahlawan Anti DBD" 🏆
              </p>
            </div>
          )}

          {/* Review Answers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Jawaban</h2>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                      ) : (
                        <XCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-semibold">Jawaban Anda:</span> {question.options[selectedAnswers[index]]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">Jawaban Benar:</span> {question.options[question.correctAnswer]}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 italic">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startQuiz}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              <RotateCcw size={20} />
              <span>Ulangi Quiz</span>
            </button>
            <button
              onClick={() => router.push('/beranda')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
