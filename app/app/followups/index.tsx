import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useTheme } from '../../src/theme';
import { fetchContacts, sendWhatsapp, touchContact } from '../../src/lib/api';
import type { Contact } from '../../src/lib/types';

function reminderTemplate(name: string) {
  return `مرحبًا ${name.split(' ')[0]}،\n\nتذكير بخصوص: `;
}
function followupTemplate(name: string) {
  return `مرحبًا ${name.split(' ')[0]}،\n\nأتابع معك بخصوص: `;
}

function relativeLabel(iso: string | null) {
  if (!iso) return 'لم يسبق التواصل';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'اليوم';
  if (days === 1) return 'قبل يوم';
  if (days < 7) return `قبل ${days} أيام`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? 'قبل أسبوع' : `قبل ${weeks} أسابيع`;
}

export default function FollowupsScreen() {
  const theme = useTheme();
  const [vips, setVips] = useState<Contact[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [template, setTemplate] = useState<'reminder' | 'followup'>('reminder');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    const all = await fetchContacts();
    setVips(all.filter((c) => c.relation === 'vip'));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function openPanel(c: Contact) {
    if (openId === c.id) {
      setOpenId(null);
      return;
    }
    setOpenId(c.id);
    setTemplate('reminder');
    setMessage(reminderTemplate(c.name));
    setConfirm(null);
  }

  function chooseTemplate(c: Contact, t: 'reminder' | 'followup') {
    setTemplate(t);
    setMessage(t === 'reminder' ? reminderTemplate(c.name) : followupTemplate(c.name));
  }

  async function handleSend(c: Contact) {
    setSending(true);
    try {
      await sendWhatsapp(c.phone ?? '', message);
      await touchContact(c.id);
      setConfirm(`✓ تم إرسال رسالة واتساب إلى ${c.name}`);
      await load();
    } catch (e: any) {
      setConfirm(`تعذّر الإرسال: ${e?.message ?? 'خطأ غير متوقع'}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <ScreenHeader title="تواصل دوري" subtitle="قائمة الـVIP التي تحتاج تواصلًا بين فترة وأخرى" />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        data={vips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const overdue = item.touchpoint_status === 'overdue';
          const open = openId === item.id;
          return (
            <View style={{ marginBottom: 10 }}>
              <Pressable
                onPress={() => openPanel(item)}
                style={[styles.card, { backgroundColor: theme.paperRaised, borderColor: theme.line, borderInlineStartWidth: 4, borderInlineStartColor: theme.gold } as any]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.ink, fontWeight: '700', fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: theme.inkSoft, fontSize: 12.5 }}>
                    {[item.title, item.company].filter(Boolean).join(' — ')}
                  </Text>
                  {overdue ? (
                    <View style={[styles.stamp, { borderColor: theme.stamp }]}>
                      <Text style={{ color: theme.stamp, fontSize: 10.5, fontWeight: '700' }}>
                        ⏰ يحتاج تواصل — آخر مرة {relativeLabel(item.last_contact_at)}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.pill, { backgroundColor: theme.accentContrast }]}>
                      <Text style={{ color: theme.accent, fontSize: 11.5, fontWeight: '600' }}>
                        ✓ آخر تواصل {relativeLabel(item.last_contact_at)}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>

              {open && (
                <View style={[styles.composeCard, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
                  <Text style={{ color: theme.stamp, fontWeight: '700', fontSize: 13, marginBottom: 10 }}>
                    💬 رسالة واتساب لـ {item.name}
                  </Text>
                  <View style={styles.segGroup}>
                    <Pressable
                      onPress={() => chooseTemplate(item, 'reminder')}
                      style={[styles.segBtn, template === 'reminder' && { backgroundColor: theme.accent }]}
                    >
                      <Text style={{ color: template === 'reminder' ? theme.accentContrast : theme.inkSoft, fontWeight: '600', fontSize: 12.5 }}>
                        🔔 تذكير
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => chooseTemplate(item, 'followup')}
                      style={[styles.segBtn, template === 'followup' && { backgroundColor: theme.accent }]}
                    >
                      <Text style={{ color: template === 'followup' ? theme.accentContrast : theme.inkSoft, fontWeight: '600', fontSize: 12.5 }}>
                        💬 متابعة موضوع
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    style={[styles.textarea, { color: theme.ink, borderColor: theme.line, backgroundColor: theme.paper }]}
                  />
                  <Pressable
                    onPress={() => handleSend(item)}
                    disabled={sending}
                    style={[styles.primaryBtn, { backgroundColor: theme.accent, opacity: sending ? 0.7 : 1 }]}
                  >
                    {sending ? <ActivityIndicator color={theme.accentContrast} /> : (
                      <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>إرسال عبر واتساب</Text>
                    )}
                  </Pressable>
                  {confirm && <Text style={{ color: theme.accent, fontSize: 12.5, fontWeight: '600', textAlign: 'center', marginTop: 10 }}>{confirm}</Text>}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.inkSoft, padding: 24 }}>
            لا يوجد أشخاص VIP حاليًا. أضف شخصًا واختر VIP كنوع العلاقة.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 14, borderWidth: 1 },
  stamp: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginTop: 6 },
  pill: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  composeCard: { borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 8 },
  segGroup: { flexDirection: 'row', gap: 3, borderRadius: 10, padding: 3, marginBottom: 10, backgroundColor: 'rgba(0,0,0,0.04)' },
  segBtn: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  textarea: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 9, fontSize: 13, minHeight: 80, textAlignVertical: 'top', marginBottom: 10 },
  primaryBtn: { borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
});
