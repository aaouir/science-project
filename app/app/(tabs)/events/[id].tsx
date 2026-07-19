import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { BackHeader } from '../../../src/components/BackHeader';
import { ContactCard } from '../../../src/components/ContactCard';
import { useTheme } from '../../../src/theme';
import { fetchContactsByEvent, fetchEvents } from '../../../src/lib/api';
import type { Contact, EventRow } from '../../../src/lib/types';

export default function EventDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isGeneral = id === 'none';

  const [event, setEvent] = useState<EventRow | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const list = await fetchContactsByEvent(isGeneral ? null : id);
        setContacts(list);
        if (!isGeneral) {
          const events = await fetchEvents();
          setEvent(events.find((e) => e.id === id) ?? null);
        }
      })();
    }, [id, isGeneral]),
  );

  const title = isGeneral ? 'لقاءات عامة' : event?.name ?? 'الفعالية';
  const meta = isGeneral ? 'بدون فعالية محددة' : [event?.place, event?.event_date].filter(Boolean).join(' · ');

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <BackHeader title={title} />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} />}
        ListHeaderComponent={
          <View>
            <Text style={{ color: theme.inkSoft, fontSize: 12.5, marginBottom: 14 }}>{meta}</Text>
            {!isGeneral && (
              <Pressable
                onPress={() => router.push({ pathname: '/contact/add', params: { eventId: id } } as any)}
                style={[styles.addBtn, { backgroundColor: theme.accent }]}
              >
                <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>
                  + إضافة شخص قابلته في هذه الفعالية
                </Text>
              </Pressable>
            )}
            <Text style={{ color: theme.inkSoft, fontSize: 12, marginBottom: 8 }}>
              {contacts.length} شخص التقيت بهم هنا
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.inkSoft, padding: 24 }}>
            لم تُضف بعد بطاقات لأشخاص هنا.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 16 },
});
