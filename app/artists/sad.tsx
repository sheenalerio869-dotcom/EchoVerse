import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const artists = [
 {
  id: "1", // ✅ string instead of number
  name: "Eric Clapton",
  image: require("../../assets/images/eric_clapton.jpg"), // ✅ local asset
},

  {
    id: "2",
    name: "Adele Adkins",
    image: require("../../assets/images/adele_adkins.jpg"),
  },
 {
    id: "3",
    name: "Nine Inch Nails",
    image: require("../../assets/images/nine_inch_nails.webp"),
  },
 {
    id: "4",
    name: "Lord Huron",
    image: require("../../assets/images/lord_huron.jpg"),
  },
 {
    id: "5",
    name: "R.E.M.",
    image: require("../../assets/images/r.e.m.jpeg"),
  },
  {
    id: "6",
    name: "The Beatles",
    image: require("../../assets/images/the_beatles.jpg"),
  },
{
    id: "7",
    name: "Bon Iver",
    image: require("../../assets/images/bon_iver.jpg"),
  },
{
    id: "8",
    name: "Elton John",
    image: require("../../assets/images/elton_john.jpg"),
  },
{
    id: "9",
    name: "Pearl Jam",
    image: require("../../assets/images/pearl_jam.webp"),
  },
{
    id: "10",
    name: "Simon & Garfunkel",
    image: require("../../assets/images/simon_garfunkel.jpg"),
  },
];

export default function SadSongsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleArtistPress = (artistId: string) => {
    router.push(`/songs/${artistId}` as any);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Search', `Searching for: "${searchQuery}"`);
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
            <MaterialIcons name="search" size={24} color="#836400ff" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#481b04ff"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <MaterialIcons name="person" size={20} color="#f3cf9eff" />
        </TouchableOpacity>
      </View>

      {/* Navigation and Title */}
      <View style={styles.navSection}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SAD SONGS</Text>
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
                source={artist.image}
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
    paddingTop: 20,
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
    color: '#481b04ff',
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
    backgroundColor: '#8B4513',
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
    color: '#ffc927ff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e7cf83ff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#8B4513',
  },
  scrollContent: { paddingBottom: 30 }, // Add padding for better scrolling
 artistsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  paddingHorizontal: 10,
},

 artistCard: {
  width: '47%',               
  marginBottom: 20,
  marginHorizontal: 4,    
  borderRadius: 30,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: '#D2B48C',
  backgroundColor: '#8B4513',
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowOffset: { width: 20, height: 2 },
  shadowRadius: 6,
  elevation: 4,
},
artistImage: {
  width: '100%',
  aspectRatio: 1,               // keeps square
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
    color: '#eee1c2ff',
    textAlign: 'left',
  },
});
