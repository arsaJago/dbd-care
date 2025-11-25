import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const useActivityTracker = () => {
  const { user } = useAuth();

  const trackActivity = async (
    activityType: string,
    details: Record<string, any> = {}
  ) => {
    if (!user) return;

    try {
      // Filter out undefined values from details
      const filteredDetails = Object.fromEntries(
        Object.entries(details).filter(([_, value]) => value !== undefined)
      );

      await addDoc(collection(db, 'activityLogs'), {
        username: user.username,
        activityType,
        details: filteredDetails,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const logPageVisit = async (pageName: string) => {
    await trackActivity('page_visit', { page: pageName });
  };

  return { trackActivity, logPageVisit };
};
