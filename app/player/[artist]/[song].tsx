import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, Share, Modal, ScrollView, Platform } from 'react-native';
// Optional import to avoid build errors when expo-av isn't installed yet
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExpoAV = (() => { try { return require('expo-av'); } catch { return null; } })();
const Audio = ExpoAV?.Audio;
const InterruptionModeAndroid = ExpoAV?.InterruptionModeAndroid;
const InterruptionModeIOS = ExpoAV?.InterruptionModeIOS;
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Storage from '../../../lib/storage';
import artists, { Artist, Song } from '../../../data/artists';

type SongInfo = {
  name: string;
  artist: string;
  image: string;
  duration: number;
};

type SongData = {
  [artist: string]: {
    [song: string]: SongInfo;
  };
};

const songData: SongData = {
  'eric-clapton': {
    'tears-in-heaven': {
      name: 'Tears in Heaven',
      artist: 'Eric Clapton',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b0b',
      duration: 270,
    },
    'circus-left-town': {
      name: 'Circus Left Town',
      artist: 'Eric Clapton',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b0c',
      duration: 240,
    },
    'my-fathers-eyes': {
      name: 'My Father\'s Eyes',
      artist: 'Eric Clapton',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b0d',
      duration: 320,
    },
    'lonely-stranger': {
      name: 'Lonely Stranger',
      artist: 'Eric Clapton',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b0e',
      duration: 280,
    },
    'running-on-faith': {
      name: 'Running on Faith',
      artist: 'Eric Clapton',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b0f',
      duration: 300,
    },
    'river-of-tears': {
      name: 'River of Tears',
      artist: 'Eric Clapton',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b1a',
      duration: 350,
    },
  },
  'adele': {
    'someone-like-you': {
      name: 'Someone Like You',
      artist: 'Adele Adkins',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b1b',
      duration: 285,
    },
    'all-i-ask': {
      name: 'All I Ask',
      artist: 'Adele Adkins',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b1c',
      duration: 270,
    },
    'easy-on-me': {
      name: 'Easy On Me',
      artist: 'Adele Adkins',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b1d',
      duration: 225,
    },
    'dont-you-remember': {
      name: 'Don\'t You Remember',
      artist: 'Adele Adkins',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b1e',
      duration: 240,
    },
    'love-in-the-dark': {
      name: 'Love in the Dark',
      artist: 'Adele Adkins',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b1f',
      duration: 260,
    },
    'million-years-ago': {
      name: 'Million Years Ago',
      artist: 'Adele Adkins',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b2a',
      duration: 235,
    },
  },
  'michael-jackson': {
    'heal-the-world': {
      name: 'Heal the World',
      artist: 'Michael Jackson',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b2b',
      duration: 390,
    },
    'man-in-the-mirror': {
      name: 'Man in the Mirror',
      artist: 'Michael Jackson',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b2c',
      duration: 320,
    },
  },
  'andra-day': {
    'rise-up': {
      name: 'Rise Up',
      artist: 'Andra Day',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b3b',
      duration: 300,
    },
  },
  'marconi-union': {
    'weightless': {
      name: 'Weightless',
      artist: 'Marconi Union',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b4b',
      duration: 485,
    },
  },
  'anoushka-shankar': {
    'voice-of-the-moon': {
      name: 'Voice of the Moon',
      artist: 'Anoushka Shankar',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b5b',
      duration: 360,
    },
  },
  'journey': {
    'dont-stop-believin': {
      name: 'Don\'t Stop Believin\'',
      artist: 'Journey Band',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b6b',
      duration: 250,
    },
  },
  'rachel-platten': {
    'fight-song': {
      name: 'Fight Song',
      artist: 'Rachel Platten',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b7b',
      duration: 210,
    },
  },
  'luther-vandross': {
    'dance-with-my-father': {
      name: 'Dance With My Father',
      artist: 'Luther Vandross',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b8b',
      duration: 320,
    },
  },
  'sister-sledge': {
    'we-are-family': {
      name: 'We Are Family',
      artist: 'Sister Sledge',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3b9b',
      duration: 220,
    },
  },
  'mariah-carey': {
    'anytime-you-need-a-friend': {
      name: 'Anytime You Need a Friend',
      artist: 'Mariah Carey',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3bab',
      duration: 280,
    },
  },
  'demi-lovato': {
    'skyscraper': {
      name: 'Skyscraper',
      artist: 'Demi Lovato',
      image: 'https://i.scdn.co/image/ab67616d0000b2734f1b3b0b3b0b3b0b3b0b3bbb',
      duration: 220,
    },
  },
};

// Waveform component
const Waveform = ({ progress }: { progress: number }) => {
  const bars = Array.from({ length: 50 }, (_, i) => {
    const height = Math.random() * 40 + 10;
    const isActive = i / 50 <= progress;
    return (
      <View
        key={i}
        style={[
          styles.waveformBar,
          {
            height: height,
            backgroundColor: isActive ? '#D4AF37' : '#8B4513',
          },
        ]}
      />
    );
  });

  return <View style={styles.waveform}>{bars}</View>;
};

export default function PlayerScreen() {
  const router = useRouter();
  const { artist, song } = useLocalSearchParams<{ artist: string; song: string }>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [remoteAudioUrl, setRemoteAudioUrl] = useState<string | undefined>(undefined);
  const [remoteImageUrl, setRemoteImageUrl] = useState<string | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Find the song from artists data
  const findSongInfo = () => {
    for (const artistData of artists) {
      const artistSlug = artistData.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/&/g, 'and');
      
      if (artistSlug === artist) {
        for (const songData of artistData.songs) {
          const songSlug = songData.title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/'/g, '')
            .replace(/"/g, '');
          
          if (songSlug === song) {
            return {
              name: songData.title,
              artist: artistData.name,
              image: songData.image,
              file: songData.file,
              duration: 240, // Default duration in seconds
            };
          }
        }
      }
    }
    return null;
  };

  const songInfo = findSongInfo();
  const songKey = useMemo(() => `${artist}:${song}`, [artist, song]);
  const appMusicDir = `${FileSystem.documentDirectory || ''}Echoverse/Downloads`;
  const localAudioPath = `${appMusicDir}/${artist}-${song}.m4a`;
  const localCoverPath = `${appMusicDir}/${artist}-${song}-cover.jpg`;

  // Detect saved state for current track
  useEffect(() => {
    (async () => {
      try {
        const listRaw = await Storage.getItem('saved:songs');
        const keys: string[] = listRaw ? JSON.parse(listRaw) : [];
        setIsSaved(keys.includes(songKey));
      } catch {}
    })();
  }, [songKey]);

  // Fetch real audio preview and artwork from iTunes Search API
  useEffect(() => {
    (async () => {
      try {
        const term = encodeURIComponent(`${songInfo?.name || ''} ${songInfo?.artist || ''}`.trim());
        if (!term) return;
        const url = `https://itunes.apple.com/search?media=music&limit=1&term=${term}`;
        const res = await fetch(url);
        const data = await res.json();
        const item = data?.results?.[0];
        if (item) {
          setRemoteAudioUrl(item.previewUrl);
          const art = item.artworkUrl100?.replace('100x100', '600x600') || item.artworkUrl100;
          if (art) setRemoteImageUrl(art);
        } else {
          setRemoteAudioUrl(undefined);
          setRemoteImageUrl(undefined);
        }
      } catch {
        setRemoteAudioUrl(undefined);
        setRemoteImageUrl(undefined);
      }
    })();
  }, [artist, song]);

  // Setup audio session
  useEffect(() => {
    (async () => {
      try {
        if (!Audio?.setAudioModeAsync) return;
        await Audio.setAudioModeAsync({
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS?.DuckOthers ?? 1,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid?.DuckOthers ?? 1,
          playThroughEarpieceAndroid: false,
        });
      } catch {}
    })();
  }, []);

  // Load/unload sound when song changes
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      // Unload existing
      if (sound) {
        try { await sound.unloadAsync(); } catch {}
      }
      setIsLoaded(false);
      setProgress(0);
      setCurrentTime(0);

      // Use local audio file from assets
      const sourceUri = songInfo?.file;
      if (!sourceUri) {
        setIsPlaying(false);
        return;
      }
      try {
        if (!Audio?.Sound?.createAsync) return;
        const { sound: snd } = await Audio.Sound.createAsync(
          sourceUri,
          { shouldPlay: false },
          (status: any) => {
            if (isCancelled) return;
            if (status.isLoaded) {
              setIsLoaded(true);
              const dur = Math.max(1, Math.floor((status.durationMillis || songInfo?.duration * 1000) / 1000));
              const cur = Math.floor((status.positionMillis || 0) / 1000);
              setCurrentTime(cur);
              setProgress(Math.min(1, cur / dur));
              setIsPlaying(Boolean(status.isPlaying));
            }
          }
        );
        setSound(snd);
      } catch (e) {
        Alert.alert('Audio', 'Failed to load audio for this track.');
      }
    })();
    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist, song]);

  if (!songInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Song not found</Text>
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const togglePlayPause = async () => {
    try {
      if (!sound || !isLoaded || !sound.getStatusAsync) return;
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (status.isPlaying && sound.pauseAsync) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else if (sound.playAsync) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch {}
  };

  const handlePrevious = () => {
    // Find current artist and song list
    const currentArtist = artists.find(a => {
      const artistSlug = a.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/&/g, 'and');
      return artistSlug === artist;
    });
    
    if (!currentArtist) return;
    
    const songSlugs = currentArtist.songs.map(s =>
      s.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/'/g, '')
        .replace(/"/g, '')
    );
    
    const idx = songSlugs.indexOf(song);
    if (idx > 0) {
      const prev = songSlugs[idx - 1];
      router.replace(`/player/${artist}/${prev}` as any);
    } else {
      Alert.alert('Info', 'No previous song in this artist list.');
    }
  };

  const handleNext = () => {
    // Find current artist and song list
    const currentArtist = artists.find(a => {
      const artistSlug = a.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/&/g, 'and');
      return artistSlug === artist;
    });
    
    if (!currentArtist) return;
    
    const songSlugs = currentArtist.songs.map(s =>
      s.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/'/g, '')
        .replace(/"/g, '')
    );
    
    const idx = songSlugs.indexOf(song);
    if (idx !== -1 && idx < songSlugs.length - 1) {
      const next = songSlugs[idx + 1];
      router.replace(`/player/${artist}/${next}` as any);
    } else {
      Alert.alert('Info', 'No next song in this artist list.');
    }
  };

  const handleChat = () => {
    Alert.alert('Chat', 'Opening chat about this song...');
    // Here you would implement chat functionality
  };

  const [lyricsVisible, setLyricsVisible] = useState(false);
  const lyricsMap: Record<string, string> = {
    'eric-clapton:tears-in-heaven': `Would it be the same
If I saw you in heaven?
I must be strong and carry on,
'Cause I know I don't belong here in heaven...`,
    'eric-clapton:my-fathers-eyes': `Sailing down behind the sun,
Waiting for my prince to come,
Praying for the healing rain
To restore my soul again...`,
    'eric-clapton:circus-left-town': `The circus left town,\nAnd I miss you like crazy...`,
    'eric-clapton:lonely-stranger': `I'm a lonely stranger here,\nWell beyond my day...`,
    'eric-clapton:running-on-faith': `Lately I've been running on faith,\nWhat else can a poor boy do?`,
    'eric-clapton:river-of-tears': `It's three miles to the river,\nAnd I'm walking down the road...`,
    'adele:someone-like-you': `Never mind, I'll find someone like you
I wish nothing but the best for you, too...`,
    'adele:easy-on-me': `Go easy on me, baby
I was still a child...`,
    'adele:all-i-ask': `If this is my last night with you,\nHold me like I'm more than just a friend...`,
    'adele:dont-you-remember': `Don't you remember?\nThe reason you loved me before...`,
    'adele:love-in-the-dark': `Take your eyes off me so I can leave...`,
    'adele:million-years-ago': `I only wanted to have fun,\nLearning to fly, learning to run...`,
    'michael-jackson:heal-the-world': `Heal the world, make it a better place
For you and for me and the entire human race...`,
    'michael-jackson:man-in-the-mirror': `I'm starting with the man in the mirror,\nI'm asking him to change his ways...`,
    'journey:dont-stop-believin': `Just a small-town girl, livin' in a lonely world...
Don't stop believin'...`,
    'rachel-platten:fight-song': `This is my fight song,
Take back my life song,
Prove I'm alright song...`,
    'andra-day:rise-up': `And I'll rise up,\nI'll rise like the day...`,
    'marconi-union:weightless': `Instrumental ambient track.\n(Enjoy the calming vibes.)`,
    'anoushka-shankar:voice-of-the-moon': `Instrumental sitar composition.\n(Feel the tranquil flow.)`,
    'luther-vandross:dance-with-my-father': `If I could get another chance,\nAnother walk, another dance with him...`,
    'sister-sledge:we-are-family': `We are family,\nI got all my sisters with me...`,
    'mariah-carey:anytime-you-need-a-friend': `Anytime you need a friend,\nI will be here...`,
    'demi-lovato:skyscraper': `Go on and try to tear me down,\nI will be rising from the ground...`,
  };
  const handleLyrics = () => {
    setLyricsVisible(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this song: "${songInfo.name}" by ${songInfo.artist}`,
        title: 'Share Song',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share song');
    }
  };

  const ensureDirExists = async (dir: string) => {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  };

  const handleDownload = async () => {
    try {
      if (isSaved || isSaving) return;
      setIsSaving(true);
      await ensureDirExists(appMusicDir);
      const filePath = `${appMusicDir}/${artist}-${song}.json`;

      // Copy local audio file to downloads directory for offline access
      if (songInfo?.file && Platform.OS !== 'web') {
        try {
          // Note: In a real app, you might want to copy the bundled asset to the downloads directory
          // For now, we'll just save the metadata since the audio is already bundled
        } catch {}
      }

      // Download cover if available
      let finalImage = remoteImageUrl || songInfo.image;
      let imageLocalPath: string | undefined = undefined;
      if (Platform.OS !== 'web' && remoteImageUrl) {
        try {
          await FileSystem.downloadAsync(remoteImageUrl, localCoverPath);
          imageLocalPath = localCoverPath;
          finalImage = imageLocalPath;
        } catch {}
      }

      // Write metadata JSON (after downloads, so we can include local paths)
      const payload = {
        id: songKey,
        name: songInfo.name,
        artist: songInfo.artist,
        image: finalImage,
        imageLocalPath,
        savedAt: Date.now(),
      } as any;
      if (Platform.OS !== 'web') {
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(payload, null, 2));
      }

      // Track in lightweight storage list
      const savedListRaw = await Storage.getItem('saved:songs');
      const savedList = savedListRaw ? JSON.parse(savedListRaw) : [];
      const nextList = Array.isArray(savedList) ? Array.from(new Set([...savedList, songKey])) : [songKey];
      await Storage.setItem('saved:songs', JSON.stringify(nextList));

      setIsSaved(true);
      setToastMessage('Saved to your app folder');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1600);
    } catch (e) {
      Alert.alert('Error', 'Failed to save music.');
    } finally {
      setIsSaving(false);
    }
  };

  // Progress tracking is handled by the audio status callback above
  // No need for manual simulation when using real audio

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#D4AF37" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.songTitle}>"{songInfo.name}"</Text>
          <Text style={styles.artistName}>by : {songInfo.artist}</Text>
        </View>
      </View>

      {/* Album Art */}
      <View style={styles.albumArtContainer}>
        <Image source={remoteImageUrl ? { uri: remoteImageUrl } : songInfo?.image} style={styles.albumArt} />
      </View>

      {/* Waveform */}
      <View style={styles.waveformContainer}>
        <Waveform progress={progress} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
          <MaterialIcons name="skip-previous" size={32} color="#D4AF37" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          <MaterialIcons 
            name={isPlaying ? "pause" : "play-arrow"} 
            size={40} 
            color="#D4AF37" 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
          <MaterialIcons name="skip-next" size={32} color="#D4AF37" />
        </TouchableOpacity>
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleChat}>
          <MaterialIcons name="chat" size={24} color="#D4AF37" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLyrics}>
          <MaterialIcons name="lyrics" size={24} color="#D4AF37" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <MaterialIcons name="share" size={24} color="#D4AF37" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, isSaving && { opacity: 0.6 }]}
          onPress={async () => {
            if (isSaved) {
              try {
                const savedListRaw = await Storage.getItem('saved:songs');
                const savedList = savedListRaw ? JSON.parse(savedListRaw) : [];
                const next = Array.isArray(savedList) ? savedList.filter((k: string) => k !== songKey) : [];
                await Storage.setItem('saved:songs', JSON.stringify(next));
                if (Platform.OS !== 'web') {
                  const filePath = `${appMusicDir}/${artist}-${song}.json`;
                  await FileSystem.deleteAsync(filePath, { idempotent: true });
                  await FileSystem.deleteAsync(localAudioPath, { idempotent: true });
                }
                setIsSaved(false);
                setToastMessage('Removed from saved');
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 1600);
              } catch {
                Alert.alert('Error', 'Failed to remove saved song.');
              }
            } else {
              await handleDownload();
            }
          }}
          disabled={isSaving}
        >
          <MaterialIcons name={isSaved ? 'delete' : 'download'} size={24} color="#D4AF37" />
        </TouchableOpacity>
      </View>

      {/* Lyrics Modal */}
      <Modal visible={lyricsVisible} animationType="slide" transparent onRequestClose={() => setLyricsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Lyrics</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
              <Text style={styles.modalText}>
                {lyricsMap[songKey] || 'Lyrics not available yet for this track.'}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setLyricsVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#8B4513',
  },
  backButton: {
    backgroundColor: '#A0522D',
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
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 16,
    color: '#D4AF37',
  },
  albumArtContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  albumArt: {
    width: 300,
    height: 300,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#A0522D',
  },
  waveformContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  waveformBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  progressContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#A0522D',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    marginLeft: -8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  controlButton: {
    backgroundColor: '#A0522D',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  playButton: {
    backgroundColor: '#A0522D',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  actionButton: {
    backgroundColor: '#A0522D',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 18,
    color: '#D4AF37',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#A0522D',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 260,
  },
  modalText: {
    color: '#FFE6C7',
    lineHeight: 22,
  },
  modalCloseBtn: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#8B4513',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCloseText: {
    color: '#FFDAB9',
    fontWeight: '700',
  },
});
