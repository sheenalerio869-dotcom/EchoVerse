import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

// Artists grouped by mood
const artistsData = {
  healing: [
    { id: 'michael-jackson', name: 'Michael Jackson', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b0d' },
    { id: 'andra-day', name: 'Andra Day', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b0e' },
  ],
  meditation: [
    { id: 'marconi-union', name: 'Marconi Union', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b0f' },
    { id: 'anoushka-shankar', name: 'Anoushka Shankar', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b1a' },
  ],
  inspiration: [
    { id: 'journey', name: 'Journey Band', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b1b' },
    { id: 'rachel-platten', name: 'Rachel Platten', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b1c' },
  ],
  family: [
    { id: 'luther-vandross', name: 'Luther Vandross', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b1d' },
    { id: 'sister-sledge', name: 'Sister Sledge', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b1e' },
  ],
  friendship: [
    { id: 'mariah-carey', name: 'Mariah Carey', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b1f' },
    { id: 'demi-lovato', name: 'Demi Lovato', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b2a' },
  ],
  dance: [
    { id: 'madonna', name: 'Madonna', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b2b' },
    { id: 'beyonce', name: 'Beyoncé', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b2c' },
  ],
  country: [
    { id: 'johnny-cash', name: 'Johnny Cash', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b2d' },
    { id: 'dolly-parton', name: 'Dolly Parton', image: 'https://i.scdn.co/image/ab6761610000e5eb4f1b3b0b3b0b3b0b3b0b3b2e' },
  ],
};

// Titles for moods
const moodTitles = {
  sad: 'SAD SONGS',
  healing: 'HEALING SONGS',
  meditation: 'MEDITATION SONGS',
  inspiration: 'INSPIRATION SONGS',
  family: 'FAMILY SONGS',
  friendship: 'FRIENDSHIP SONGS',
  dance: 'DANCE SONGS',
  country: 'COUNTRY SONGS',
};

export default function ArtistsScreen() {
  const router = useRouter();
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  const artists = artistsData[mood as keyof typeof artistsData] || [];
  const title = moodTitles[mood as keyof typeof moodTitles] || 'SONGS';

  const handleArtistPress = (artistId: string) => {
    router.push(`/songs/${artistId}` as any);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Search', `Searching for: "${searchQuery}"`);
      // TODO: connect search to your backend or filter artists
    }
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/about' as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearch}>
            <MaterialIcons name="search" size={24} color="#D4AF37" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#8B4513"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <MaterialIcons name="person" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Navigation and Title */}
      <View style={styles.navSection}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Choose Your Artists</Text>
        </View>
      </View>

      {/* Artists Grid */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.artistsContainer}>
          {artists.map((artist) => (
            <TouchableOpacity
              key={artist.id}
              style={styles.artistCard}
              onPress={() => handleArtistPress(artist.id)}
            >
              <Image
                source={{ uri: artist.image }}
                style={styles.artistImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.artistOverlay} />
              <Text style={styles.artistName}>{artist.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B4513',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#A0522D',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D2B48C',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#8B4513',
  },
  profileButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#A0522D',
  },
  backButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#D4AF37',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#8B4513',
  },
  scrollContent: { paddingBottom: 30 }, // Add padding for better scrolling
  artistsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  artistCard: {
    width: '48%',
    backgroundColor: '#8B4513',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  artistImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  artistOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  artistName: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left',
  },
});
