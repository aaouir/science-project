import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { BackHeader } from '../../src/components/BackHeader';
import { useTheme, RELATION_META } from '../../src/theme';
import { fetchContacts, sendNewsBroadcast } from '../../src/lib/api';
import type { Contact } from '../../src/lib/types';

function isSpecial(relation: string) {
  return !!RELATION_META[relation]?.special;
}

export default function ComposeNewsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [titleAr, setTitleAr] = useState('تعييني عضوًا في اللجنة الاستشارية');
  const [bodyAr, setBodyAr] = useState(
    'تم اختياري مؤخرًا للانضمام إلى اللجنة الاستشارية لقطاع التقنية، وهو ما يسعدني مشاركته معكم.',
  );
  const [titleEn, setTitleEn] = useState('My appointment to the Advisory Committee');
  const [bodyEn, setBodyEn] = useState(
    'I was recently selected to join the Technology Sector Advisory Committee, and wanted to share this news with you.',
  );

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [sending, setSending] = useState(false);
  const [sentText, setSentText] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchContacts().then(setContacts);
    }, []),
  );

  function toggleRecipient(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function selectSpecial() {
    setSelectedIds((prev) => {
      const specialIds = contacts.filter((c) => isSpecial(c.relation)).map((c) => c.id);
      return Array.from(new Set([...prev, ...specialIds]));
    });
  }

  const firstRecipient = contacts.find((c) => c.id === selectedIds[0]);
  const preview = useMemo(() => {
    if (!firstRecipient) return null;
    const first = firstRecipient.name.split(' ')[0];
    const title = lang === 'ar' ? titleAr : titleEn;
    const body = lang === 'ar' ? bodyAr : bodyEn;
    const greet = lang === 'ar' ? `مرحبًا ${first}،\n\n` : `Hi ${first},\n\n`;
    const sign = lang === 'ar' ? '\n\nتحياتي،' : '\n\nBest regards,';
    return { title, message: greet + body + sign };
  }, [firstRecipient, lang, titleAr, bodyAr, titleEn, bodyEn]);

  async function handleSend() {
    setSending(true);
    try {
      await sendNewsBroadcast({ title_ar: titleAr, body_ar: bodyAr, title_en: titleEn, body_en: bodyEn, channel, lang, recipientIds: selectedIds });
      setSentText(`✓ تم إرسال الخبر إلى ${selectedIds.length} شخص عبر ${channel === 'email' ? 'البريد الإلكتروني' : 'واتساب'}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <BackHeader
        title={step === 1 ? 'محتوى الخبر' : step === 2 ? 'اختيار المستلمين' : 'المراجعة والإرسال'}
        onBack={() => (step > 1 ? setStep((s) => (s - 1) as 1 | 2) : router.back())}
      />
      <View style={styles.stepper}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={[styles.seg, { backgroundColor: n <= step ? theme.accent : theme.line }]} />
        ))}
      </View>

      {step === 1 && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Field label="عنوان الخبر (عربي)" value={titleAr} onChange={setTitleAr} theme={theme} />
          <Field label="تفاصيل الخبر (عربي)" value={bodyAr} onChange={setBodyAr} multiline theme={theme} />
          <Field label="Title (English)" value={titleEn} onChange={setTitleEn} theme={theme} />
          <Field label="Details (English)" value={bodyEn} onChange={setBodyEn} multiline theme={theme} />
          <Pressable onPress={() => setStep(2)} style={[styles.primaryBtn, { backgroundColor: theme.accent }]}>
            <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>التالي: اختيار المستلمين</Text>
          </Pressable>
        </ScrollView>
      )}

      {step === 2 && (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={contacts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <Pressable onPress={selectSpecial} style={[styles.primaryBtn, { backgroundColor: theme.accent, marginBottom: 12 }]}>
                <Text style={{ color: theme.accentContrast, fontWeight: '700', textAlign: 'center' }}>
                  ⭐ تحديد الفئات الخاصة تلقائيًا (دبلوماسيون، إعلام دولي، منظمات دولية، VIP)
                </Text>
              </Pressable>
              <Text style={{ color: theme.inkSoft, fontSize: 12, marginBottom: 6 }}>
                تم اختيار {selectedIds.length} شخص
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const rel = RELATION_META[item.relation];
            const checked = selectedIds.includes(item.id);
            return (
              <Pressable onPress={() => toggleRecipient(item.id)} style={[styles.recipientRow, { borderColor: theme.line }]}>
                <View style={[styles.checkbox, { borderColor: theme.line, backgroundColor: checked ? theme.accent : 'transparent' }]}>
                  {checked && <Text style={{ color: theme.accentContrast, fontSize: 12 }}>✓</Text>}
                </View>
                <Text style={{ color: theme.ink, fontSize: 13.5 }}>
                  {item.name} <Text style={{ color: theme.inkSoft, fontSize: 12 }}>— {rel?.label}{rel?.special ? ' ⭐' : ''}</Text>
                </Text>
              </Pressable>
            );
          }}
          ListFooterComponent={
            <Pressable
              onPress={() => setStep(3)}
              disabled={!selectedIds.length}
              style={[styles.primaryBtn, { backgroundColor: theme.accent, marginTop: 14, opacity: selectedIds.length ? 1 : 0.5 }]}
            >
              <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>التالي: المراجعة والإرسال</Text>
            </Pressable>
          }
        />
      )}

      {step === 3 && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {!sentText ? (
            <>
              <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>قناة الإرسال</Text>
              <View style={styles.segGroup}>
                {(['email', 'whatsapp'] as const).map((c) => (
                  <Pressable key={c} onPress={() => setChannel(c)} style={[styles.segBtn, channel === c && { backgroundColor: theme.accent }]}>
                    <Text style={{ color: channel === c ? theme.accentContrast : theme.inkSoft, fontWeight: '600', fontSize: 12.5 }}>
                      {c === 'email' ? '📧 البريد' : '💬 واتساب'}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>لغة الإرسال</Text>
              <View style={styles.segGroup}>
                {(['ar', 'en'] as const).map((l) => (
                  <Pressable key={l} onPress={() => setLang(l)} style={[styles.segBtn, lang === l && { backgroundColor: theme.accent }]}>
                    <Text style={{ color: lang === l ? theme.accentContrast : theme.inkSoft, fontWeight: '600', fontSize: 12.5 }}>
                      {l === 'ar' ? 'عربي' : 'English'}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={{ color: theme.inkSoft, fontSize: 12, marginVertical: 10 }}>
                سيتم الإرسال إلى {selectedIds.length} شخص عبر {channel === 'email' ? 'البريد الإلكتروني' : 'واتساب'}
              </Text>
              {preview && (
                <View style={[styles.previewCard, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
                  <Text style={{ color: theme.stamp, fontWeight: '700', fontSize: 13, marginBottom: 8 }}>
                    معاينة الرسالة لـ {firstRecipient?.name}
                  </Text>
                  {channel === 'email' && <Text style={{ color: theme.ink, fontWeight: '700', marginBottom: 6 }}>{preview.title}</Text>}
                  <Text style={{ color: theme.ink, fontSize: 13, lineHeight: 20 }}>{preview.message}</Text>
                </View>
              )}
              <Pressable
                onPress={handleSend}
                disabled={sending}
                style={[styles.primaryBtn, { backgroundColor: theme.accent, marginTop: 14, opacity: sending ? 0.7 : 1 }]}
              >
                {sending ? <ActivityIndicator color={theme.accentContrast} /> : (
                  <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>إرسال إلى الجميع</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <View style={[styles.successBadge, { backgroundColor: theme.accentContrast }]}>
                <Text style={{ fontSize: 26 }}>✓</Text>
              </View>
              <Text style={{ color: theme.ink, fontWeight: '700', fontSize: 15, textAlign: 'center', marginBottom: 16 }}>{sentText}</Text>
              <Pressable onPress={() => router.replace('/news' as any)} style={[styles.primaryBtn, { backgroundColor: theme.accent }]}>
                <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>تم</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function Field({ label, value, onChange, multiline, theme }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: theme.inkSoft, fontSize: 11.5, marginBottom: 5 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        style={[
          styles.input,
          multiline && { minHeight: 80, textAlignVertical: 'top' },
          { borderColor: theme.line, color: theme.ink, backgroundColor: theme.paperRaised },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingBottom: 10 },
  seg: { flex: 1, height: 4, borderRadius: 3 },
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  primaryBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  recipientRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 1 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 11, marginBottom: 6, marginTop: 4 },
  segGroup: { flexDirection: 'row', gap: 3, borderRadius: 10, padding: 3, marginBottom: 6, backgroundColor: 'rgba(0,0,0,0.04)' },
  segBtn: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  previewCard: { borderWidth: 1, borderRadius: 14, padding: 14 },
  successBadge: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 14 },
});
