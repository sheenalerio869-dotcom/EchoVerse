import { Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
};

export default function IconButton({ icon, label, onPress, color = "#D4AF37", backgroundColor = "#8B4513" }: Props) {
  return (
    <Pressable style={[styles.iconButton, { backgroundColor }]} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={[styles.iconButtonLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    minWidth: 80,
  },
  iconButtonLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});
