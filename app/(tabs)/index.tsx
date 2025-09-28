import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FirestoreCommentsService, CommentItem } from "../../lib/firestoreComments";
import { useAuth } from "../../lib/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

// Mood categories
const moodCategories = [
  { id: "sad", name: "Sad Songs", image: require("../../assets/images/sad.jpg") },
  { id: "healing", name: "Healing Songs", image: require("../../assets/images/healing.jpg") },
  { id: "meditation", name: "Meditation Songs", image: require("../../assets/images/meditation.jpg") },
  { id: "inspiration", name: "Inspiration Songs", image: require("../../assets/images/inspiration.jpg") },
  { id: "family", name: "Family Songs", image: require("../../assets/images/family.jpg") },
  { id: "friendship", name: "Friendship Songs", image: require("../../assets/images/friendship.webp") },
  { id: "dance", name: "Dance Songs", image: require("../../assets/images/dance.jpg") },
  { id: "country", name: "Country Songs", image: require("../../assets/images/country.jpg") },
];

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [activeMoodId, setActiveMoodId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recentComments, setRecentComments] = useState<Record<string, CommentItem[]>>({});

  // Load comments
  const loadComments = useCallback(async () => {
    const entries: Array<readonly [string, CommentItem[]]> = [];
    for (const m of moodCategories) {
      try {
        const comments = await FirestoreCommentsService.loadComments(m.id);
        const sorted = comments.sort(
          (a, b) => (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0)
        );
        entries.push([m.id, sorted.slice(0, 5)]);
      } catch (error: any) {
        // Handle permission errors gracefully - just show empty comments
        if (error.message?.includes('permissions') || error.message?.includes('Firestore permissions')) {
          console.warn(`Firestore permissions not configured for mood: ${m.id}`);
        }
        entries.push([m.id, []]);
      }
    }
    setRecentComments(Object.fromEntries(entries));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadComments();
    }, [loadComments])
  );

  // Open modal
  const openCommentModal = (moodId: string, draft?: { id?: string; text?: string }) => {
    setActiveMoodId(moodId);
    setEditingId(draft?.id ?? null);
    setCommentText(draft?.text ?? "");
    setIsCommentVisible(true);
  };

  const closeCommentModal = () => {
    setIsCommentVisible(false);
    setActiveMoodId(null);
    setCommentText("");
    setEditingId(null);
  };

  // Save or update
  const saveComment = async () => {
    if (!activeMoodId || !commentText.trim()) return;
    try {
      setIsSaving(true);
      
      if (editingId) {
        // Update existing comment
        await FirestoreCommentsService.updateComment(activeMoodId, editingId, commentText.trim());
      } else {
        // Add new comment
        await FirestoreCommentsService.addComment(
          activeMoodId, 
          commentText.trim(), 
          user?.uid, 
          user?.email || undefined
        );
      }
      
      closeCommentModal();
      loadComments();
    } catch (error: any) {
      // Handle permission errors with helpful message
      if (error.message?.includes('permissions') || error.message?.includes('Firestore permissions')) {
        Alert.alert(
          'Setup Required', 
          'Firebase permissions need to be configured. Please check the FIREBASE_SETUP_GUIDE.md file.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert("Error", "Failed to save comment.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const deleteComment = async (moodId: string, commentId: string) => {
    Alert.alert("Delete Comment", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await FirestoreCommentsService.deleteComment(moodId, commentId);
            loadComments();
          } catch {
            Alert.alert("Error", "Failed to delete comment.");
          }
        },
      },
    ]);
  };

  // Navigate to mood page
  const handleMoodPress = (moodId: string) => {
    if (moodId === 'sad') {
      // Special route for sad songs
      router.push('/artists/sad');
    } else {
      // Generic route for other moods
      router.push(`/artists/${moodId}`);
    }
  };

  // Handle search
  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const mood = moodCategories.find(
      (m) => m.id.includes(q) || m.name.toLowerCase().includes(q)
    );
    if (mood) {
      handleMoodPress(mood.id); // Use the same routing logic
    } else {
      Alert.alert("No results", "Try another keyword.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#8B4513" style={{ marginHorizontal: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#8B4513"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      <Text style={styles.title}>MOOD MUSICS</Text>
      <Text style={styles.subtitle}>Choose your songs based on your Mood Today!</Text>

      {/* Mood Grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {moodCategories.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={styles.card}
            onPress={() => handleMoodPress(mood.id)}
          >
            <Image source={mood.image} style={styles.cardImage} contentFit="cover" />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.overlay} />
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>{mood.name}</Text>

              {/* Comment previews */}
              {recentComments[mood.id]?.length > 0 && (
                <View style={{ marginTop: 5 }}>
                  {recentComments[mood.id].map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => openCommentModal(mood.id, c)}
                      onLongPress={() => deleteComment(mood.id, c.id)}
                    >
                      <Text style={styles.commentPreview} numberOfLines={1}>
                        • {c.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.commentButton}
                onPress={() => openCommentModal(mood.id)}
              >
                <Text style={styles.commentButtonText}>Add Music Suggestions</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Comment Modal */}
      <Modal transparent visible={isCommentVisible} onRequestClose={closeCommentModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editingId ? "Edit Comment" : "New Comment"}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write your comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, { backgroundColor: "#6d0315ff" }]} onPress={closeCommentModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#8B4513" }]}
                onPress={saveComment}
                disabled={isSaving}
              >
                <Text style={styles.modalButtonText}>{isSaving ? "Saving..." : "Save"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#8B4513", padding: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#deb887",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: { flex: 1, color: "#000", fontSize: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#f7c036ff", textAlign: "center", marginTop: 10 },
  subtitle: { fontSize: 14, color: "#e5c991ff", textAlign: "center", marginBottom: 15 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 30 // Add padding at bottom for better scrolling
  },
  card: {
    width: "48%",
    height: 170,
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#333333ff",
  },
  cardImage: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, borderRadius: 10 },
  cardContent: { position: "absolute", bottom: 10, left: 10, right: 10 },
  cardText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  commentPreview: { fontSize: 12, color: "#eee" },
  commentButton: {
    marginTop: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  commentButtonText: { color: "#ffffffff", fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(238, 197, 103, 0.23)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: { width: "100%", backgroundColor: "#d1984fff", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInput: {
    borderWidth: 3,
    borderColor: "#633606ff",
    borderRadius: 6,
    padding: 30,
    minHeight: 60,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
