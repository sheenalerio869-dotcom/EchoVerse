import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import artists, { Artist, Song } from "../../data/artists";

export default function SongsScreen() {
  const router = useRouter();
  const { artist } = useLocalSearchParams<{ artist: string }>();

  // Find the artist by ID
  const artistData = artists.find(a => a.id === artist);
  const songs = artistData?.songs || [];

  const handleBack = () => {
    router.back();
  };

  const handleSongPress = (song: Song) => {
    if (!artistData) return;
    
    // Create URL-friendly slugs
    const artistSlug = artistData.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/&/g, 'and');
    
    const songSlug = song.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/'/g, '')
      .replace(/"/g, '');
    
    router.push(`/player/${artistSlug}/${songSlug}` as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navSection}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{artistData?.name || 'Songs'}</Text>
      </View>

      {/* Song List */}
      <ScrollView
        contentContainerStyle={styles.songsContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {songs.map((song) => (
          <TouchableOpacity
            key={song.id}
            style={styles.songCard}
            onPress={() => handleSongPress(song)}
          >
            <Image source={song.image} style={styles.songImage} contentFit="cover" />
            <View style={styles.overlay} />
            <Text style={styles.songTitle}>{song.title}</Text>
          </TouchableOpacity>
        ))}

        {songs.length === 0 && (
          <Text style={styles.noSongs}>No songs found for this artist.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B4513",
  },
  navSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#A0522D",
  },
  backButton: {
    backgroundColor: "#8B4513",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  songsContainer: {
    padding: 20,
    paddingBottom: 40, // Add extra padding at bottom for better scrolling
  },
  songCard: {
    backgroundColor: "#8B4513",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D2B48C",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  songImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  songTitle: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  noSongs: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
  },
});
