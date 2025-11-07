import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export interface ActivityLog {
  username: string;
  action: 'page_visit' | 'material_view' | 'video_play' | 'poster_download' | 'quiz_start' | 'quiz_complete';
  target: string;
  targetId?: string;
  metadata?: Record<string, any>;
  createdAt: Timestamp;
}

export class ActivityTracker {
  private static instance: ActivityTracker;
  private currentUser: string | null = null;

  private constructor() {}

  public static getInstance(): ActivityTracker {
    if (!ActivityTracker.instance) {
      ActivityTracker.instance = new ActivityTracker();
    }
    return ActivityTracker.instance;
  }

  public setCurrentUser(username: string) {
    this.currentUser = username;
  }

  public async logActivity(
    action: ActivityLog['action'],
    target: string,
    targetId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.currentUser) {
      console.warn('ActivityTracker: No user set, skipping log');
      return;
    }

    try {
      const activityLog: Omit<ActivityLog, 'id'> = {
        username: this.currentUser,
        action,
        target,
        targetId,
        metadata,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'activityLogs'), activityLog);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Convenience methods
  public async logPageVisit(page: string, metadata?: Record<string, any>) {
    await this.logActivity('page_visit', page, undefined, metadata);
  }

  public async logMaterialView(materialId: string, materialTitle: string) {
    await this.logActivity('material_view', 'material', materialId, { title: materialTitle });
  }

  public async logVideoPlay(videoId: string, videoTitle: string) {
    await this.logActivity('video_play', 'video', videoId, { title: videoTitle });
  }

  public async logPosterDownload(posterId: string, posterTitle: string) {
    await this.logActivity('poster_download', 'poster', posterId, { title: posterTitle });
  }

  public async logQuizStart() {
    await this.logActivity('quiz_start', 'quiz');
  }

  public async logQuizComplete(score: number, totalQuestions: number) {
    await this.logActivity('quiz_complete', 'quiz', undefined, { 
      score, 
      totalQuestions, 
      percentage: (score / totalQuestions) * 100 
    });
  }
}

// Export singleton instance
export const activityTracker = ActivityTracker.getInstance();

// Hook for React components
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export function useActivityTracker() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.username) {
      activityTracker.setCurrentUser(user.username);
    }
  }, [user]);

  return activityTracker;
}