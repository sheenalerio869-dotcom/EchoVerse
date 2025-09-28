import { FirestoreCommentsService } from './firestoreComments';
import * as Storage from './storage';

/**
 * Migration utility to move comments from local storage to Firestore
 * This can be called once to migrate existing comments
 */
export class CommentsMigration {
  static async migrateAllComments(): Promise<void> {
    const moodCategories = [
      'sad', 'healing', 'meditation', 'inspiration', 
      'family', 'friendship', 'dance', 'country'
    ];

    for (const mood of moodCategories) {
      try {
        await this.migrateMoodComments(mood);
        console.log(`✅ Migrated comments for mood: ${mood}`);
      } catch (error) {
        console.error(`❌ Failed to migrate comments for mood: ${mood}`, error);
      }
    }
  }

  static async migrateMoodComments(mood: string): Promise<void> {
    const storageKey = `comments:${mood}`;
    
    try {
      // Get existing comments from local storage
      const existing = await Storage.getItem(storageKey);
      if (!existing) {
        console.log(`No comments found for mood: ${mood}`);
        return;
      }

      const parsed = JSON.parse(existing);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.log(`No comments to migrate for mood: ${mood}`);
        return;
      }

      // Normalize comments (handle both string and object formats)
      const normalized = parsed.map((item: any) => {
        if (typeof item === 'string') {
          return {
            id: String(Math.random()).slice(2),
            text: item,
            createdAt: Date.now(),
          };
        }
        return item;
      });

      // Migrate each comment to Firestore
      for (const comment of normalized) {
        try {
          await FirestoreCommentsService.addComment(
            mood,
            comment.text,
            undefined, // No user ID for migrated comments
            undefined  // No user email for migrated comments
          );
        } catch (error) {
          console.error(`Failed to migrate comment for mood ${mood}:`, error);
        }
      }

      // Optionally, you can remove from local storage after successful migration
      // await Storage.removeItem(storageKey);
      console.log(`Migrated ${normalized.length} comments for mood: ${mood}`);
      
    } catch (error) {
      console.error(`Error migrating comments for mood ${mood}:`, error);
      throw error;
    }
  }

  static async checkMigrationStatus(): Promise<{ [mood: string]: { local: number; firestore: number } }> {
    const moodCategories = [
      'sad', 'healing', 'meditation', 'inspiration', 
      'family', 'friendship', 'dance', 'country'
    ];

    const status: { [mood: string]: { local: number; firestore: number } } = {};

    for (const mood of moodCategories) {
      try {
        // Check local storage
        const storageKey = `comments:${mood}`;
        const localComments = await Storage.getItem(storageKey);
        const localCount = localComments ? JSON.parse(localComments).length : 0;

        // Check Firestore
        const firestoreComments = await FirestoreCommentsService.loadComments(mood);
        const firestoreCount = firestoreComments.length;

        status[mood] = { local: localCount, firestore: firestoreCount };
      } catch (error) {
        console.error(`Error checking status for mood ${mood}:`, error);
        status[mood] = { local: 0, firestore: 0 };
      }
    }

    return status;
  }
}

