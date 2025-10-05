import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  theme?: 'primary' | 'secondary';
};

export default function Button({ label, onPress, theme = 'primary' }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, theme === 'primary' ? styles.primary : styles.secondary]}
    >
      <Text style={[styles.text, theme === 'primary' ? styles.textPrimary : styles.textSecondary]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 240,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#fff',
    borderColor: '#ffe600',
    borderWidth: 3,
  },
  
  secondary: {
    backgroundColor: '#fe926aff',
     borderColor: '#ffe600',
    borderWidth: 3,
  },
  text: {
    fontWeight: 'bold',
  },
  textPrimary: {
    color: '#6f350bff',
  },
  textSecondary: {
    color: '#000',
  },
});
