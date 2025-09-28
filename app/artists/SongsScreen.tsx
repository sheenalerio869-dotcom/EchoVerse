// app/artists/SongsScreen.tsx
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import artists, { Artist, Song } from "../../data/artists";

export default function SongsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // normalize
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Find artist
  const artist: Artist | undefined = artists.find((a) => a.id.toString() === id);

  if (!artist) {
    return (
      <View style={styles.center}>
        <Text>Artist not found!</Text>
      </View>
    );
  }

  // Filter songs with search
  const filteredSongs = artist.songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with Search + Profile */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#fff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs..."
            placeholderTextColor="#ddd"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/(tabs)/about" as any)}>
          <MaterialIcons name="person" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.artistName}>{artist.name.toUpperCase()} SONGS</Text>
        <Text style={styles.subtitle}>Here are some of the Sad Songs of this Artist</Text>
      </View>

      {/* Songs List */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {filteredSongs.length === 0 ? (
          <Text style={styles.noSongs}>No songs found</Text>
        ) : (
          filteredSongs.map((song: Song) => (
            <TouchableOpacity
              key={song.id}
              style={styles.songCard}
              onPress={() => {
                // Create URL-friendly artist and song names
                const artistSlug = artist.name.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/&/g, 'and');
                
                const songSlug = song.title.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/'/g, '')
                  .replace(/"/g, '');
                
                router.push(`/player/${artistSlug}/${songSlug}` as any);
              }}
            >
              <Image source={song.image} style={styles.songImage} contentFit="cover" />
              <Text style={styles.songTitle}>“{song.title}”</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#8B4513" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#A0522D",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B8860B",
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
  },
  profileButton: {
    backgroundColor: "#B8860B",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // Title Section
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  artistName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
  },

  // Songs
  scrollContainer: { flex: 1, paddingHorizontal: 10 },
  scrollContent: { paddingBottom: 30 }, // Add padding for better scrolling
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5C2E0B",
    borderRadius: 15,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },

  noSongs: { fontSize: 16, color: "gray", textAlign: "center", marginTop: 20 },

  // Center fallback
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
