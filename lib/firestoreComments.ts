import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';


export interface CommentItem {
  id: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
  userId?: string;
  userEmail?: string;
  mood: string;
}

export class FirestoreCommentsService {
  private static getCommentsCollection(mood: string) {
    return collection(db, 'moodComments', mood, 'comments');
  }

  // Load comments for a specific mood
  static async loadComments(mood: string): Promise<CommentItem[]> {
    try {
      const commentsRef = this.getCommentsCollection(mood);
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const comments: CommentItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis(),
          userId: data.userId,
          userEmail: data.userEmail,
          mood: data.mood || mood,
        });
      });
      
      return comments;
    } catch (error: any) {
      console.error('Error loading comments:', error);
      
      // If it's a permissions error or network error, fallback to offline storage
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable, falling back to offline storage');
        
      }
      
      throw new Error('Failed to load comments');
    }
  }

  // Add a new comment
  static async addComment(mood: string, text: string, userId?: string, userEmail?: string): Promise<string> {
    try {
      const commentsRef = this.getCommentsCollection(mood);
      const docRef = await addDoc(commentsRef, {
        text: text.trim(),
        createdAt: Timestamp.now(),
        userId: userId || null,
        userEmail: userEmail || null,
        mood: mood,
      });
      
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      
      // If it's a permissions error or network error, fallback to offline storage
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable, saving to offline storage');
       
      }
      
      throw new Error('Failed to add comment');
    }
  }

  // Update an existing comment
  static async updateComment(mood: string, commentId: string, text: string): Promise<void> {
    try {
      const commentRef = doc(db, 'moodComments', mood, 'comments', commentId);
      await updateDoc(commentRef, {
        text: text.trim(),
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Error updating comment:', error);
      
      // Fallback to offline storage
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable, updating offline storage');
        
      }
      
      throw new Error('Failed to update comment');
    }
  }

  // Delete a comment
  static async deleteComment(mood: string, commentId: string): Promise<void> {
    try {
      const commentRef = doc(db, 'moodComments', mood, 'comments', commentId);
      await deleteDoc(commentRef);
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      
      // Fallback to offline storage
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable, deleting from offline storage');
        
      }
      
      throw new Error('Failed to delete comment');
    }
  }

  // Clear all comments for a mood
  static async clearAllComments(mood: string): Promise<void> {
    try {
      const commentsRef = this.getCommentsCollection(mood);
      const querySnapshot = await getDocs(commentsRef);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error: any) {
      console.error('Error clearing comments:', error);
      
      // Fallback to offline storage
      if (error.code === 'permission-denied' || 
          error.message?.includes('permissions') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('network')) {
        console.warn('Firebase unavailable, clearing offline storage');
        
      }
      
      throw new Error('Failed to clear comments');
    }
  }
}
