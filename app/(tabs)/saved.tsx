import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../lib/AuthContext";
import { FirestoreSavedItemsService, SavedItem } from "../../lib/firestoreSavedItems";

export default function SavedScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [input, setInput] = useState("");
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load saved items from Firestore or fallback to AsyncStorage
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        
        if (user?.uid) {
          // Try to load from Firestore first
          try {
            const firestoreItems = await FirestoreSavedItemsService.loadSavedItems(user.uid);
            setItems(firestoreItems);
          } catch (error) {
            console.log("Firestore unavailable, using local storage:", error);
            // Fallback to AsyncStorage
            const stored = await AsyncStorage.getItem("savedItems");
            if (stored) {
              const localItems = JSON.parse(stored);
              // Convert string array to SavedItem array for backward compatibility
              const convertedItems: SavedItem[] = Array.isArray(localItems)
                ? localItems.map((item: any, index: number) => ({
                    id: typeof item === 'string' ? `local-${index}` : item.id || `local-${index}`,
                    text: typeof item === 'string' ? item : item.text || '',
                    createdAt: typeof item === 'string' ? Date.now() : item.createdAt || Date.now(),
                    userId: user.uid,
                  }))
                : [];
              setItems(convertedItems);
            }
          }
        } else {
          // User not authenticated, use local storage only
          const stored = await AsyncStorage.getItem("savedItems");
          if (stored) {
            const localItems = JSON.parse(stored);
            const convertedItems: SavedItem[] = Array.isArray(localItems)
              ? localItems.map((item: any, index: number) => ({
                  id: typeof item === 'string' ? `local-${index}` : item.id || `local-${index}`,
                  text: typeof item === 'string' ? item : item.text || '',
                  createdAt: typeof item === 'string' ? Date.now() : item.createdAt || Date.now(),
                  userId: 'anonymous',
                }))
              : [];
            setItems(convertedItems);
          }
        }
      } catch (err) {
        console.log("Error loading items:", err);
        Alert.alert("Error", "Failed to load saved items");
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [user]);

  // 🔹 Save items to AsyncStorage as backup (for offline use)
  useEffect(() => {
    const saveToLocal = async () => {
      try {
        // Convert SavedItem array back to simple format for AsyncStorage compatibility
        const simpleItems = items.map(item => item.text);
        await AsyncStorage.setItem("savedItems", JSON.stringify(simpleItems));
      } catch (err) {
        console.log("Error saving to local storage:", err);
      }
    };
    if (items.length > 0) {
      saveToLocal();
    }
  }, [items]);

  // ✅ Add or Update
  const handleSave = async () => {
    if (!input.trim()) return;

    setSaving(true);
    try {
      if (editingItem) {
        // Update existing item
        if (user?.uid) {
          try {
            await FirestoreSavedItemsService.updateSavedItem(user.uid, editingItem.id, input);
            // Update local state
            setItems(prev => prev.map(item =>
              item.id === editingItem.id
                ? { ...item, text: input, updatedAt: Date.now() }
                : item
            ));
          } catch (error) {
            console.log("Firestore update failed, updating locally:", error);
            // Fallback to local update
            setItems(prev => prev.map(item =>
              item.id === editingItem.id
                ? { ...item, text: input, updatedAt: Date.now() }
                : item
            ));
          }
        } else {
          // Update locally for non-authenticated users
          setItems(prev => prev.map(item =>
            item.id === editingItem.id
              ? { ...item, text: input, updatedAt: Date.now() }
              : item
          ));
        }
        setEditingItem(null);
      } else {
        // Add new item
        const newItem: SavedItem = {
          id: `temp-${Date.now()}`,
          text: input,
          createdAt: Date.now(),
          userId: user?.uid || 'anonymous',
        };

        if (user?.uid) {
          try {
            const firestoreId = await FirestoreSavedItemsService.addSavedItem(user.uid, input);
            // Update with Firestore ID
            newItem.id = firestoreId;
            setItems(prev => [...prev, newItem]);
          } catch (error) {
            console.log("Firestore add failed, saving locally:", error);
            // Add locally even if Firestore fails
            setItems(prev => [...prev, newItem]);
          }
        } else {
          // Add locally for non-authenticated users
          setItems(prev => [...prev, newItem]);
        }
      }

      setInput("");
    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert("Error", "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  // ✏️ Edit
  const handleEdit = (item: SavedItem) => {
    setInput(item.text);
    setEditingItem(item);
  };

  // ❌ Delete
  const handleDelete = async (item: SavedItem) => {
    try {
      if (user?.uid && !item.id.startsWith('local-') && !item.id.startsWith('temp-')) {
        try {
          await FirestoreSavedItemsService.deleteSavedItem(user.uid, item.id);
        } catch (error) {
          console.log("Firestore delete failed, deleting locally:", error);
        }
      }
      
      // Remove from local state
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#f7c036ff" />
        <Text style={styles.loadingText}>Loading saved items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SAVED ITEMS</Text>
      
      {user ? (
        <Text style={styles.userInfo}>Synced with Firestore for {user.email}</Text>
      ) : (
        <Text style={styles.userInfo}>Local storage only (login to sync)</Text>
      )}

      {/* Input + Button */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter item..."
          placeholderTextColor="#e8db78ff"
        />
        <TouchableOpacity
          style={[styles.addButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : editingItem ? "Update" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        bounces={true}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item.text}</Text>
              <Text style={styles.itemDate}>
                {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved items yet</Text>
            <Text style={styles.emptySubText}>Add your first item above!</Text>
          </View>
        }
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#8B4513" },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#fff",
  },
  userInfo: {
    fontSize: 12,
    color: "#e8db78ff",
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  inputRow: { flexDirection: "row", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#f7c036ff",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  actions: { flexDirection: "row" },
  editButton: {
    backgroundColor: "#712d08ff",
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 6,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#e8db78ff",
    fontStyle: "italic",
  },
  listContent: {
    paddingBottom: 30, // Add padding for better scrolling
  },
});
