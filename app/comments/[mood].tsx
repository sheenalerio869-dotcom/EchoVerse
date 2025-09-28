import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FirestoreCommentsService, CommentItem } from '../../lib/firestoreComments';
import { useAuth } from '../../lib/AuthContext';

export default function MoodCommentsScreen() {
  const router = useRouter();
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const comments = await FirestoreCommentsService.loadComments(mood);
      setComments(comments);
    } catch (e: any) {
      // Handle permission errors gracefully
      if (e.message?.includes('permissions') || e.message?.includes('Firestore permissions')) {
        console.warn('Firestore permissions not configured. Comments will be empty.');
        setComments([]);
      } else {
        Alert.alert('Error', 'Failed to load comments.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [mood]);

  useFocusEffect(
    useCallback(() => {
      loadComments();
    }, [loadComments])
  );

  const clearAll = async () => {
    try {
      await FirestoreCommentsService.clearAllComments(mood);
      setComments([]);
    } catch (e) {
      Alert.alert('Error', 'Failed to clear comments.');
    }
  };

  const deleteOne = async (id: string) => {
    try {
      await FirestoreCommentsService.deleteComment(mood, id);
      const next = comments.filter((c) => c.id !== id);
      setComments(next);
    } catch (e) {
      Alert.alert('Error', 'Failed to delete comment.');
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setDraftText('');
    setIsModalVisible(true);
  };

  const openEdit = (item: CommentItem) => {
    setEditingId(item.id);
    setDraftText(item.text);
    setIsModalVisible(true);
  };

  const saveDraft = async () => {
    const text = draftText.trim();
    if (!text) {
      setIsModalVisible(false);
      return;
    }
    try {
      if (editingId) {
        // Update existing comment
        await FirestoreCommentsService.updateComment(mood, editingId, text);
        const next = comments.map((c) => (c.id === editingId ? { ...c, text, updatedAt: Date.now() } : c));
        setComments(next);
      } else {
        // Add new comment
        const commentId = await FirestoreCommentsService.addComment(
          mood, 
          text, 
          user?.uid, 
          user?.email || undefined
        );
        const newComment: CommentItem = {
          id: commentId,
          text,
          createdAt: Date.now(),
          userId: user?.uid,
          userEmail: user?.email || undefined,
          mood,
        };
        setComments([newComment, ...comments]);
      }
    } catch (e: any) {
      // Handle permission errors with helpful message
      if (e.message?.includes('permissions') || e.message?.includes('Firestore permissions')) {
        Alert.alert(
          'Setup Required', 
          'Firebase permissions need to be configured. Please check the setup guide in the project files.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to save comment.');
      }
    } finally {
      setIsModalVisible(false);
      setDraftText('');
      setEditingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Comments</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addBtnText}>Add Comment</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : comments.length === 0 ? (
        <Text style={styles.empty}>No comments yet.</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadComments} />}
          renderItem={({ item, index }) => (
            <View style={styles.commentCard}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{(index + 1).toString()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentMeta}>
                  {new Date(item.createdAt).toLocaleString()}
                  {item.updatedAt ? ` • edited ${new Date(item.updatedAt).toLocaleString()}` : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteOne(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: '#2E8B57' }]} onPress={() => openEdit(item)}>
                <Text style={styles.deleteText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Comment' : 'New Comment'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write your comment..."
              placeholderTextColor="#8B4513"
              value={draftText}
              onChangeText={setDraftText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveBtn]} onPress={saveDraft}>
                <Text style={[styles.modalButtonText, styles.saveBtnText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B4513',
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#A0522D',
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#8B4513',
    borderRadius: 8,
  },
  backText: {
    color: '#D4AF37',
    fontWeight: '700',
  },
  title: {
    color: '#D4AF37',
    fontWeight: '800',
    fontSize: 18,
  },
  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#8B4513',
    borderRadius: 8,
  },
  clearText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loading: {
    color: '#FFDAB9',
    textAlign: 'center',
    marginTop: 20,
  },
  empty: {
    color: '#FFDAB9',
    textAlign: 'center',
    marginTop: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addBtn: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#5C3317',
    fontWeight: '800',
  },
  list: {
    padding: 16,
    gap: 10,
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#5C3317',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  commentText: {
    color: '#ffb9e9ff',
    flex: 1,
  },
  commentMeta: {
    color: '#D2B48C',
    fontSize: 12,
    marginTop: 4,
  },
  deleteBtn: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#8B0000',
    borderRadius: 8,
    alignSelf: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#A0522D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#D4AF37',
    fontWeight: '800',
    fontSize: 12,
  },

  // ✅ Modal styles (finished & themed)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D4AF37',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D2B48C',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF8DC',
    color: '#5C3317',
    minHeight: 80,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#8B0000',
  },
  saveBtn: {
    backgroundColor: '#2E8B57',
  },
  modalButtonText: {
    color: '#ffffffff',
    fontWeight: '700',
  },
  saveBtnText: {
    color: '#FFD700',
    fontWeight: '800',
  },
});
