import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ContactCard } from '../../src/components/ContactCard';
import { useTheme, RELATION_META } from '../../src/theme';
import { fetchContacts, fetchEvents, fetchTeam } from '../../src/lib/api';
import type { Contact, EventRow, Profile } from '../../src/lib/types';

function ChipRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {options.map((o) => {
            const active = value === o.id;
            return (
              <Pressable
                key={o.id}
                onPress={() => onChange(o.id)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? theme.accent : theme.paperRaised, borderColor: active ? theme.accent : theme.line },
                ]}
              >
                <Text style={{ color: active ? theme.accentContrast : theme.inkSoft, fontWeight: active ? '700' : '400', fontSize: 12.5 }}>
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default function SearchScreen() {
  const theme = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [query, setQuery] = useState('');
  const [relationFilter, setRelationFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [addedByFilter, setAddedByFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [c, e, t] = await Promise.all([fetchContacts(), fetchEvents(), fetchTeam()]);
        setContacts(c);
        setEvents(e);
        setTeam(t);
      })();
    }, []),
  );

  const relationOptions = [
    { id: 'all', label: 'كل أنواع العلاقة' },
    ...Object.entries(RELATION_META).map(([id, meta]) => ({ id, label: (meta.special ? '⭐ ' : '') + meta.label })),
  ];
  const eventOptions = [
    { id: 'all', label: 'كل الفعاليات' },
    { id: 'none', label: 'بدون فعالية' },
    ...events.map((e) => ({ id: e.id, label: e.name })),
  ];
  const teamOptions = [{ id: 'all', label: 'أي عضو فريق' }, ...team.map((m) => ({ id: m.id, label: m.name }))];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchesQ =
        !q ||
        `${c.name} ${c.company ?? ''} ${c.email ?? ''} ${c.phone ?? ''}`.toLowerCase().includes(q);
      const matchesRel = relationFilter === 'all' || c.relation === relationFilter;
      const matchesEvent =
        eventFilter === 'all' || (eventFilter === 'none' ? !c.event_id : c.event_id === eventFilter);
      const matchesAddedBy = addedByFilter === 'all' || c.added_by === addedByFilter;
      return matchesQ && matchesRel && matchesEvent && matchesAddedBy;
    });
  }, [contacts, query, relationFilter, eventFilter, addedByFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <ScreenHeader title="البحث" subtitle="ابحث وفلتر بدقة عبر كل شبكتك" />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} />}
        ListHeaderComponent={
          <View>
            <View style={[styles.searchBox, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}>
              <Text style={{ color: theme.inkSoft }}>🔎</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="الاسم، الشركة، البريد، أو الهاتف…"
                placeholderTextColor={theme.inkSoft}
                style={[styles.searchInput, { color: theme.ink }]}
              />
            </View>
            <ChipRow label="نوع العلاقة" options={relationOptions} value={relationFilter} onChange={setRelationFilter} />
            <ChipRow label="الفعالية" options={eventOptions} value={eventFilter} onChange={setEventFilter} />
            <ChipRow label="أضافه" options={teamOptions} value={addedByFilter} onChange={setAddedByFilter} />
            <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>{results.length} نتيجة</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.inkSoft, padding: 24 }}>
            لا توجد نتائج مطابقة لهذه الفلاتر.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 14 },
  fieldLabel: { fontSize: 11.5, marginBottom: 6 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  sectionLabel: { fontSize: 12, marginTop: 4, marginBottom: 8 },
});
