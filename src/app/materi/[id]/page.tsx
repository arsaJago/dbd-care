'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Material, Comment } from '@/types';
import { formatDate, formatDateTime } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import MaterialCard from '@/components/MaterialCard';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [material, setMaterial] = useState<Material | null>(null);
  const [relatedMaterials, setRelatedMaterials] = useState<Material[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMaterial();
      incrementViews();
      fetchComments();
    }
  }, [params.id]);

  const fetchMaterial = async () => {
    try {
      const docRef = doc(db, 'materials', params.id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const materialData = { id: docSnap.id, ...docSnap.data() } as Material;
        setMaterial(materialData);
        fetchRelatedMaterials(materialData.category);
      }
    } catch (error) {
      console.error('Error fetching material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      const docRef = doc(db, 'materials', params.id as string);
      await updateDoc(docRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const fetchRelatedMaterials = async (category: string) => {
    try {
      const q = query(
        collection(db, 'materials'),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      const materialsData: Material[] = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== params.id) {
          materialsData.push({ id: doc.id, ...doc.data() } as Material);
        }
      });

      setRelatedMaterials(materialsData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related materials:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('materialId', '==', params.id)
      );
      const querySnapshot = await getDocs(q);
      const commentsData: Comment[] = [];

      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });

      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        materialId: params.id,
        username: user.username,
        content: commentText.trim(),
        createdAt: Timestamp.now(),
      });

      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Gagal mengirim komentar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Materi tidak ditemukan</p>
          <button
            onClick={() => router.push('/materi')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Kembali ke Materi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/materi')}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Materi</span>
        </button>

        {/* Main Content */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Thumbnail */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={material.thumbnailUrl}
              alt={material.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full">
                {material.category}
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Title & Meta */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {material.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{material.views} views</span>
              </div>
              <span>•</span>
              <span>{formatDate(material.createdAt)}</span>
            </div>

            {/* Content */}
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown>{material.content}</ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Komentar ({comments.length})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis komentar Anda..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="mt-3 flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}</span>
              </button>
            </form>
          ) : (
            <div className="mb-8 rounded-lg bg-gray-100 px-4 py-3 text-gray-700">
              Silakan{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-semibold text-green-600 hover:text-green-700"
              >
                masuk
              </button>{' '}
              untuk memberikan komentar.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {comment.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{comment.username}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 pl-10">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Belum ada komentar. Jadilah yang pertama!
              </p>
            )}
          </div>
        </div>

        {/* Related Materials */}
        {relatedMaterials.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Materi Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedMaterials.map((relatedMaterial) => (
                <MaterialCard key={relatedMaterial.id} material={relatedMaterial} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
