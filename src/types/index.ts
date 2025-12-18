import { Timestamp } from 'firebase/firestore';

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Timestamp;
}

export interface Material {
  id: string;
  title: string;
  content: string;
  category: 'Pencegahan' | 'Gejala' | 'Pengobatan' | '3M Plus';
  thumbnailUrl: string;
  views: number;
  createdAt: Timestamp;
}

export interface Poster {
  id: string;
  title: string;
  description: string;
  category: 'Poster Anak' | 'Poster Keluarga' | 'Infografis';
  fileUrl: string;
  fileType: 'image' | 'pdf';
  downloads: number;
  createdAt: Timestamp;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  description: string;
  duration: string;
  views: number;
  createdAt: Timestamp;
}

export interface QuizResponse {
  id: string;
  username: string;
  score: number;
  answers: number[];
  createdAt: Timestamp;
}

export interface Comment {
  id: string;
  materialId: string;
  username: string;
  content: string;
  createdAt: Timestamp;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  order?: number;
}
