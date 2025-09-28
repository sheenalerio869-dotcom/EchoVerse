import * as Storage from './storage';

export interface CommentItem {
  id: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
  userId?: string;
  userEmail?: string;
  mood: string;
}

/**
 * Offline fallback for comments when Firebase is not available
 * This ensures the app works even without network connectivity
 */
export class OfflineCommentsService {
  private static getStorageKey(mood: string): string {
    return `offline_comments:${mood}`;
  }

  // Load comments from local storage
  static async loadComments(mood: string): Promise<CommentItem[]> {
    try {
      const storageKey = this.getStorageKey(mood);
      const existing = await Storage.getItem(storageKey);
      const parsed = existing ? JSON.parse(existing) : [];
      
      const comments: CommentItem[] = Array.isArray(parsed)
        ? parsed.map((item: any) => {
            if (typeof item === 'string') {
              return {
                id: String(Math.random()).slice(2),
                text: item,
                createdAt: Date.now(),
                mood,
              };
            }
            return {
              ...item,
              mood: item.mood || mood,
            };
          })
        : [];
      
      return comments.sort((a, b) => (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0));
    } catch (error) {
      console.error('Error loading offline comments:', error);
      return [];
    }
  }

  // Add a new comment to local storage
  static async addComment(mood: string, text: string, userId?: string, userEmail?: string): Promise<string> {
    try {
      const storageKey = this.getStorageKey(mood);
      const existing = await Storage.getItem(storageKey);
      const parsed = existing ? JSON.parse(existing) : [];
      
      const newComment: CommentItem = {
        id: String(Date.now()),
        text: text.trim(),
        createdAt: Date.now(),
        userId,
        userEmail,
        mood,
      };
      
      const updated = [...parsed, newComment];
      await Storage.setItem(storageKey, JSON.stringify(updated));
      
      return newComment.id;
    } catch (error) {
      console.error('Error adding offline comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  // Update an existing comment
  static async updateComment(mood: string, commentId: string, text: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(mood);
      const existing = await Storage.getItem(storageKey);
      const parsed = existing ? JSON.parse(existing) : [];
      
      const updated = parsed.map((comment: any) =>
        comment.id === commentId
          ? { ...comment, text: text.trim(), updatedAt: Date.now() }
          : comment
      );
      
      await Storage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating offline comment:', error);
      throw new Error('Failed to update comment');
    }
  }

  // Delete a comment
  static async deleteComment(mood: string, commentId: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(mood);
      const existing = await Storage.getItem(storageKey);
      const parsed = existing ? JSON.parse(existing) : [];
      
      const filtered = parsed.filter((comment: any) => comment.id !== commentId);
      await Storage.setItem(storageKey, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting offline comment:', error);
      throw new Error('Failed to delete comment');
    }
  }

  // Clear all comments for a mood
  static async clearAllComments(mood: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(mood);
      await Storage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing offline comments:', error);
      throw new Error('Failed to clear comments');
    }
  }
}

