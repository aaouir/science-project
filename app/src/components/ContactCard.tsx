import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, RELATION_META } from '../theme';
import type { Contact } from '../lib/types';

function initials(name: string) {
  const parts = name.trim().split(' ');
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

export function ContactCard({ contact }: { contact: Contact }) {
  const theme = useTheme();
  const router = useRouter();
  const rel = RELATION_META[contact.relation];
  const eventName = contact.events?.name;
  const addedByName = contact.addedByProfile?.name ?? 'غير معروف';

  return (
    <Pressable
      onPress={() => router.push(`/contact/${contact.id}` as any)}
      style={[
        styles.card,
        { backgroundColor: theme.paperRaised, borderColor: theme.line },
        { borderInlineStartWidth: 4, borderInlineStartColor: rel?.special ? theme.gold : theme.accent } as any,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: theme.accentContrast }]}>
        <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 13 }}>{initials(contact.name)}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.name, { color: theme.ink }]} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={[styles.role, { color: theme.inkSoft }]} numberOfLines={1}>
          {[contact.title, contact.company].filter(Boolean).join(' — ')}
        </Text>
        <View style={styles.badgeRow}>
          {eventName ? (
            <View style={[styles.stamp, { borderColor: theme.stamp }]}>
              <Text style={{ color: theme.stamp, fontSize: 10.5, fontWeight: '700' }}>{eventName}</Text>
            </View>
          ) : null}
          {rel ? (
            <View
              style={[
                styles.pill,
                { backgroundColor: rel.special ? theme.goldContrast : theme.accentContrast },
              ]}
            >
              <Text
                style={{
                  color: rel.special ? theme.gold : theme.accent,
                  fontSize: 11.5,
                  fontWeight: rel.special ? '700' : '600',
                }}
              >
                {rel.special ? '⭐ ' : ''}
                {rel.label}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.addedBy, { color: theme.inkSoft }]}>أضافه {addedByName}</Text>
      </View>
      <Text style={{ color: theme.inkSoft, fontSize: 16 }}>‹</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  role: { fontSize: 12.5 },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 6 },
  stamp: { borderWidth: 1.5, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  pill: { borderRadius: 999, paddingHorizontal: 11, paddingVertical: 4 },
  addedBy: { fontSize: 11, marginTop: 6 },
});
