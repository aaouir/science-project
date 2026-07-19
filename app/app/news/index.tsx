import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useTheme } from '../../src/theme';
import { fetchNewsBroadcasts } from '../../src/lib/api';

export default function NewsListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [broadcasts, setBroadcasts] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchNewsBroadcasts().then(setBroadcasts);
    }, []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <ScreenHeader
        title="أخباري"
        subtitle="شارك أخبارك مع أشخاص مختارين"
        rightAction={
          <Pressable
            onPress={() => router.push('/news/compose' as any)}
            style={[styles.iconBtn, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}
          >
            <Text style={{ fontSize: 16, color: theme.ink }}>+</Text>
          </Pressable>
        }
      />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        data={broadcasts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.ink, fontWeight: '700', fontSize: 14.5 }}>{item.title_ar || item.title_en}</Text>
              <Text style={{ color: theme.inkSoft, fontSize: 12, marginTop: 3 }}>
                {new Date(item.sent_at).toLocaleDateString('ar')} · {item.channel === 'email' ? '📧 البريد' : '💬 واتساب'}
              </Text>
            </View>
            <View style={[styles.countPill, { backgroundColor: theme.accentContrast }]}>
              <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 11.5 }}>
                {item.news_recipients?.[0]?.count ?? 0} شخص
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.inkSoft, padding: 24 }}>
            لم تشارك أي خبر بعد. اضغط + لإضافة أول خبر.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  countPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
});
