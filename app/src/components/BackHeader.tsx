import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';

export function BackHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => (onBack ? onBack() : router.back())}
        style={[styles.backBtn, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}
        accessibilityLabel="رجوع"
      >
        <Text style={{ color: theme.ink, fontSize: 16 }}>›</Text>
      </Pressable>
      <Text style={[styles.title, { color: theme.ink }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.backBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontSize: 17, fontWeight: '700', textAlign: 'center' },
});
