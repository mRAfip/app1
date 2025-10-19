import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ArabicSuraTextProps {
  suraName: string;
  size?: number;
}

export const ArabicSuraText: React.FC<ArabicSuraTextProps> = ({ 
  suraName, 
  size = 50 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.suraLabel, { fontSize: size * 0.2 }]}>سورة</Text>
      <Text style={[styles.suraName, { fontSize: size * 0.3 }]}>{suraName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  suraLabel: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  suraName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
});
