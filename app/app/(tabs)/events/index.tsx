import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { useTheme } from '../../../src/theme';
import { fetchContacts, fetchEvents } from '../../../src/lib/api';
import type { Contact, EventRow } from '../../../src/lib/types';

export default function EventsListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useFocusEffect(
    useCallback(() => {
      Promise.all([fetchEvents(), fetchContacts()]).then(([e, c]) => {
        setEvents(e);
        setContacts(c);
      });
    }, []),
  );

  const noneCount = contacts.filter((c) => !c.event_id).length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <ScreenHeader
        title="الفعاليات"
        subtitle="اضغط فعالية لعرض من قابلتهم فيها"
        rightAction={
          <Pressable
            onPress={() => router.push('/(tabs)/events/new' as any)}
            style={[styles.iconBtn, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}
          >
            <Text style={{ fontSize: 16, color: theme.ink }}>+</Text>
          </Pressable>
        }
      />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const count = contacts.filter((c) => c.event_id === item.id).length;
          return (
            <Pressable
              onPress={() => router.push(`/(tabs)/events/${item.id}` as any)}
              style={[styles.card, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: theme.ink }]}>{item.name}</Text>
                <Text style={{ color: theme.inkSoft, fontSize: 12, marginTop: 3 }}>
                  {[item.place, item.event_date].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <View style={[styles.countPill, { backgroundColor: theme.accentContrast }]}>
                <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 11.5 }}>{count} شخص</Text>
              </View>
            </Pressable>
          );
        }}
        ListFooterComponent={
          <Pressable
            onPress={() => router.push('/(tabs)/events/none' as any)}
            style={[styles.card, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: theme.ink }]}>لقاءات عامة</Text>
              <Text style={{ color: theme.inkSoft, fontSize: 12, marginTop: 3 }}>بدون فعالية محددة</Text>
            </View>
            <View style={[styles.countPill, { backgroundColor: theme.accentContrast }]}>
              <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 11.5 }}>{noneCount} شخص</Text>
            </View>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  cardTitle: { fontSize: 14.5, fontWeight: '700' },
  countPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
});
