import { useState } from 'react';
import { ImageSourcePropType, StyleSheet, FlatList, Platform, Pressable, View, Button } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  onSelectMultiple: (images: ImageSourcePropType[]) => void;
  onClose: () => void;
};

export default function EmojiList({ onSelectMultiple, onClose }: Props) {
  const [emoji] = useState<ImageSourcePropType[]>([
    require('../assets/images/emoji1.png'),
    require('../assets/images/emoji2.png'),
    require('../assets/images/emoji3.png'),
    require('../assets/images/emoji4.png'),
    require('../assets/images/emoji5.png'),
    require('../assets/images/emoji6.png'),
  ]);

  const [selectedEmojis, setSelectedEmojis] = useState<ImageSourcePropType[]>([]);

  const toggleEmoji = (item: ImageSourcePropType) => {
    setSelectedEmojis((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        data={emoji}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleEmoji(item)}>
            <Image
              source={item}
              style={[
                styles.image,
                selectedEmojis.includes(item) && { opacity: 0.5 },
              ]}
            />
          </Pressable>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <Button
        title="Add Selected Emojis"
        color="#712d08ff" 
        onPress={() => {
          onSelectMultiple(selectedEmojis);
          onClose();
        }}
        disabled={selectedEmojis.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#aa4c1aff',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 6,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 10,
  },
  selectedImage: {
    borderWidth: 3,
    borderColor: '#86460b',
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 12,
  },
  doneButton: {
    backgroundColor: '#ebdc13ff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#86460b',
    fontWeight: 'bold',
  },
});
