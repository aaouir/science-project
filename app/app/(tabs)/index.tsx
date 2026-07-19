import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ContactCard } from '../../src/components/ContactCard';
import { useTheme, RELATION_META } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { fetchContacts, fetchPendingJobAlertsCount, fetchTeam } from '../../src/lib/api';
import type { Contact } from '../../src/lib/types';

const FILTER_CHIPS = [
  { id: 'all', label: 'الكل' },
  { id: 'client', label: 'عملاء' },
  { id: 'partner', label: 'شركاء' },
  { id: 'friend', label: 'أصدقاء' },
  { id: 'special', label: '⭐ فئات خاصة' },
];

function isSpecial(relation: string) {
  return !!RELATION_META[relation]?.special;
}

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { profile } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [teamSize, setTeamSize] = useState(0);
  const [pendingAlerts, setPendingAlerts] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [c, team, alerts] = await Promise.all([fetchContacts(), fetchTeam(), fetchPendingJobAlertsCount()]);
    setContacts(c);
    setTeamSize(team.length);
    setPendingAlerts(alerts);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matchesSearch = (c: Contact) =>
      !q || `${c.name} ${c.company ?? ''}`.toLowerCase().includes(q);

    if (filter === 'all') return contacts.filter(matchesSearch);
    if (filter === 'special') return contacts.filter((c) => isSpecial(c.relation) && matchesSearch(c));
    return contacts.filter((c) => c.relation === filter && matchesSearch(c));
  }, [contacts, search, filter]);

  const specials = filter === 'all' ? filtered.filter((c) => isSpecial(c.relation)) : [];
  const rest = filter === 'all' ? filtered.filter((c) => !isSpecial(c.relation)) : filtered;

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <ScreenHeader
        title="شبكة علاقات الشركة"
        subtitle={`${contacts.length} شخص · فريق من ${teamSize}`}
        rightAction={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={() => router.push('/notifications' as any)}
              style={[styles.iconBtn, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}
            >
              <Text>🔔</Text>
              {pendingAlerts > 0 && <View style={[styles.dot, { backgroundColor: theme.stamp }]} />}
            </Pressable>
            <View style={[styles.avatar, { backgroundColor: theme.accentContrast }]}>
              <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 12 }}>
                {profile?.name?.trim().split(' ').slice(0, 2).map((p) => p[0]).join('') ?? '؟'}
              </Text>
            </View>
          </View>
        }
      />

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            <View style={[styles.searchBox, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}>
              <Text style={{ color: theme.inkSoft }}>🔎</Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="ابحث بالاسم أو الشركة…"
                placeholderTextColor={theme.inkSoft}
                style={[styles.searchInput, { color: theme.ink }]}
              />
            </View>

            <Pressable
              onPress={() => router.push('/network-ai' as any)}
              style={[styles.aiButton, { backgroundColor: theme.accentContrast }]}
            >
              <Text style={{ color: theme.accent, fontWeight: '700' }}>🤖 اسأل عن شبكتك ككل — لا عن اسم واحد</Text>
            </Pressable>

            <View style={styles.chipRow}>
              {FILTER_CHIPS.map((c) => {
                const active = filter === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setFilter(c.id)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? theme.accent : theme.paperRaised,
                        borderColor: active ? theme.accent : theme.line,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? theme.accentContrast : theme.inkSoft, fontWeight: active ? '700' : '400', fontSize: 12.5 }}>
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {specials.length > 0 && (
              <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>
                ⭐ فئات خاصة — دبلوماسيون، إعلام دولي، منظمات دولية، VIP
              </Text>
            )}
            {specials.map((c) => (
              <ContactCard key={c.id} contact={c} />
            ))}
            {specials.length > 0 && <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>كل الأشخاص</Text>}
          </View>
        }
        data={rest}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.inkSoft, padding: 24 }}>
            لا توجد نتائج مطابقة. جرّب فلترة أخرى.
          </Text>
        }
      />

      <Pressable
        onPress={() => router.push('/contact/add' as any)}
        style={[styles.fab, { backgroundColor: theme.accent, borderColor: theme.paper }]}
      >
        <Text style={{ color: theme.accentContrast, fontSize: 24, lineHeight: 26 }}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 6, right: 7, width: 8, height: 8, borderRadius: 4 },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  aiButton: { borderRadius: 10, paddingVertical: 11, alignItems: 'center', marginBottom: 12 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  sectionLabel: { fontSize: 12, marginTop: 14, marginBottom: 8 },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
