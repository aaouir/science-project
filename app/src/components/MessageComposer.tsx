import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { sendEmail, sendWhatsapp } from '../lib/api';

type Draft = {
  email: { ar: { subject: string; body: string }; en: { subject: string; body: string } };
  whatsapp: { ar: string; en: string };
};

export function MessageComposer({
  draft,
  recipientEmail,
  recipientPhone,
  recipientName,
}: {
  draft: Draft;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  recipientName: string;
}) {
  const theme = useTheme();
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  const isEmail = channel === 'email';
  const subject = isEmail ? draft.email[lang].subject : '';
  const [bodyOverride, setBodyOverride] = useState<string | null>(null);
  const body = bodyOverride ?? (isEmail ? draft.email[lang].body : draft.whatsapp[lang]);

  function selectChannel(c: 'email' | 'whatsapp') {
    setChannel(c);
    setBodyOverride(null);
    setSent(null);
  }
  function selectLang(l: 'ar' | 'en') {
    setLang(l);
    setBodyOverride(null);
    setSent(null);
  }

  async function handleSend() {
    setSending(true);
    setSent(null);
    try {
      if (isEmail) {
        if (!recipientEmail) throw new Error('لا يوجد بريد إلكتروني لهذا الشخص');
        await sendEmail(recipientEmail, subject, body);
      } else {
        if (!recipientPhone) throw new Error('لا يوجد رقم واتساب لهذا الشخص');
        await sendWhatsapp(recipientPhone, body);
      }
      setSent(`✓ تم إرسال الرسالة عبر ${isEmail ? 'البريد الإلكتروني' : 'واتساب'} إلى ${recipientName}`);
    } catch (e: any) {
      setSent(`تعذّر الإرسال: ${e?.message ?? 'خطأ غير متوقع'}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
      <Text style={[styles.head, { color: theme.stamp }]}>رسالة ترحيب مقترحة</Text>

      <View style={styles.segGroup}>
        {(['email', 'whatsapp'] as const).map((c) => (
          <Pressable
            key={c}
            onPress={() => selectChannel(c)}
            style={[styles.segBtn, channel === c && { backgroundColor: theme.accent }]}
          >
            <Text style={{ color: channel === c ? theme.accentContrast : theme.inkSoft, fontWeight: '600', fontSize: 12.5 }}>
              {c === 'email' ? '📧 البريد' : '💬 واتساب'}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.segGroup}>
        {(['ar', 'en'] as const).map((l) => (
          <Pressable
            key={l}
            onPress={() => selectLang(l)}
            style={[styles.segBtn, lang === l && { backgroundColor: theme.accent }]}
          >
            <Text style={{ color: lang === l ? theme.accentContrast : theme.inkSoft, fontWeight: '600', fontSize: 12.5 }}>
              {l === 'ar' ? 'عربي' : 'English'}
            </Text>
          </Pressable>
        ))}
      </View>

      {isEmail && (
        <>
          <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>الموضوع</Text>
          <Text style={[styles.subjectText, { color: theme.ink, borderColor: theme.line }]}>{subject}</Text>
        </>
      )}
      <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>الرسالة</Text>
      <TextInput
        value={body}
        onChangeText={setBodyOverride}
        multiline
        style={[styles.textarea, { color: theme.ink, borderColor: theme.line, backgroundColor: theme.paper }]}
      />

      <Pressable
        onPress={handleSend}
        disabled={sending}
        style={[styles.sendBtn, { backgroundColor: theme.accent, opacity: sending ? 0.7 : 1 }]}
      >
        {sending ? (
          <ActivityIndicator color={theme.accentContrast} />
        ) : (
          <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>
            إرسال عبر {isEmail ? 'البريد' : 'واتساب'}
          </Text>
        )}
      </Pressable>
      {sent ? <Text style={{ color: theme.accent, fontSize: 12.5, fontWeight: '600', textAlign: 'center', marginTop: 10 }}>{sent}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 8 },
  head: { fontWeight: '700', fontSize: 13, marginBottom: 10 },
  segGroup: { flexDirection: 'row', gap: 3, borderRadius: 10, padding: 3, marginBottom: 8, backgroundColor: 'rgba(0,0,0,0.04)' },
  segBtn: { flex: 1, borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  fieldLabel: { fontSize: 11, marginTop: 8, marginBottom: 4 },
  subjectText: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 9, fontSize: 13, fontWeight: '700' },
  textarea: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 9, fontSize: 13, minHeight: 90, textAlignVertical: 'top' },
  sendBtn: { borderRadius: 10, paddingVertical: 11, alignItems: 'center', marginTop: 12 },
});
