import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useAudioRecorder, useAudioRecorderState, RecordingPresets, AudioModule, setAudioModeAsync } from 'expo-audio';
import { File } from 'expo-file-system';
import { BackHeader } from '../../src/components/BackHeader';
import { useTheme, RELATION_META } from '../../src/theme';
import { fetchAiInsight, fetchContact, fetchJobHistory, transcribeVoiceNote, updateContactNotes } from '../../src/lib/api';
import type { Contact, JobHistoryEntry } from '../../src/lib/types';

function initials(name: string) {
  const p = name.trim().split(' ');
  return (p[0]?.[0] ?? '') + (p[1]?.[0] ?? '');
}

export default function ContactDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [contact, setContact] = useState<Contact | null>(null);
  const [history, setHistory] = useState<JobHistoryEntry[]>([]);
  const [notes, setNotes] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const load = useCallback(async () => {
    if (!id) return;
    const [c, h] = await Promise.all([fetchContact(id), fetchJobHistory(id)]);
    setContact(c);
    setHistory(h);
    setNotes(c.notes ?? '');
    if (c.notes) fetchAiInsight(c.notes).then((r) => setInsight(r.insight)).catch(() => {});
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function saveNotes(nextNotes: string) {
    if (!id) return;
    setSaving(true);
    try {
      await updateContactNotes(id, nextNotes);
      const { insight: newInsight } = await fetchAiInsight(nextNotes);
      setInsight(newInsight);
    } finally {
      setSaving(false);
    }
  }

  async function toggleRecording() {
    if (recorderState.isRecording) {
      await recorder.stop();
      if (!recorder.uri) return;
      setTranscribing(true);
      try {
        const file = new File(recorder.uri);
        const base64 = await file.base64();
        const { transcript } = await transcribeVoiceNote(base64, 'audio/m4a');
        const nextNotes = notes ? `${notes}\n\n${transcript}` : transcript;
        setNotes(nextNotes);
        await saveNotes(nextNotes);
      } catch (e: any) {
        setInsight(`تعذّر تحويل الصوت إلى نص: ${e?.message ?? 'تحقّق من إعداد مزوّد الصوت.'}`);
      } finally {
        setTranscribing(false);
      }
      return;
    }
    const perm = await AudioModule.requestRecordingPermissionsAsync();
    if (!perm.granted) return;
    await setAudioModeAsync({ allowsRecording: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }

  if (!contact) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.paper, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  const rel = RELATION_META[contact.relation];
  const eventName = contact.events?.name;
  const addedByName = contact.addedByProfile?.name ?? 'غير معروف';

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <BackHeader title="تفاصيل جهة الاتصال" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <View style={styles.hero}>
          <View style={[styles.avatarLg, { backgroundColor: theme.accentContrast }]}>
            <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 20 }}>{initials(contact.name)}</Text>
          </View>
          <Text style={[styles.heroName, { color: theme.ink }]}>{contact.name}</Text>
          <Text style={[styles.heroRole, { color: theme.inkSoft }]}>
            {[contact.title, contact.company].filter(Boolean).join(' — ')}
          </Text>
        </View>

        <View style={[styles.infoList, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
          <InfoRow k="البريد" v={contact.email ?? '—'} theme={theme} />
          <InfoRow k="الجوال" v={contact.phone ?? '—'} theme={theme} />
          <InfoRow k="قابلته في" v={eventName ?? 'لقاء عام'} theme={theme} />
          <InfoRow k="أضافه" v={addedByName} theme={theme} last />
        </View>

        <View style={styles.tagRow}>
          {rel && (
            <View style={[styles.pill, { backgroundColor: rel.special ? theme.goldContrast : theme.accentContrast }]}>
              <Text style={{ color: rel.special ? theme.gold : theme.accent, fontWeight: '700', fontSize: 11.5 }}>
                {rel.special ? '⭐ ' : ''}
                {rel.label}
              </Text>
            </View>
          )}
          {contact.tags.map((t) => (
            <View key={t} style={[styles.pill, { backgroundColor: theme.accentContrast }]}>
              <Text style={{ color: theme.accent, fontSize: 11.5 }}>{t}</Text>
            </View>
          ))}
        </View>

        {history.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>🔔 سجل التغييرات المهنية</Text>
            <View style={[styles.infoList, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
              {history.map((h, i) => (
                <View
                  key={h.id}
                  style={[styles.historyRow, i === history.length - 1 && { borderBottomWidth: 0 }, { borderColor: theme.line }]}
                >
                  <Text style={{ color: theme.inkSoft, fontSize: 12 }}>
                    {new Date(h.changed_at).toLocaleDateString('ar')}
                  </Text>
                  <Text style={{ color: theme.ink, fontSize: 12.5, flex: 1 }}>{h.description}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>📝 ملاحظات</Text>
        <View style={[styles.notesCard, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="اكتب ملاحظة، أو سجّلها صوتيًا…"
            placeholderTextColor={theme.inkSoft}
            style={[styles.textarea, { color: theme.ink, borderColor: theme.line, backgroundColor: theme.paper }]}
          />
          <View style={styles.btnRow}>
            <Pressable
              onPress={toggleRecording}
              style={[styles.secondaryBtn, { borderColor: theme.line, backgroundColor: theme.paper }]}
            >
              <Text style={{ color: theme.ink, fontWeight: '600', fontSize: 13 }}>
                {recorderState.isRecording ? '⏺ جارِ التسجيل… اضغط للإيقاف' : '🎙️ تسجيل ملاحظة صوتية'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => saveNotes(notes)}
              disabled={saving}
              style={[styles.primaryBtn, { backgroundColor: theme.accent, opacity: saving ? 0.7 : 1 }]}
            >
              <Text style={{ color: theme.accentContrast, fontWeight: '700', fontSize: 13 }}>حفظ</Text>
            </Pressable>
          </View>
          {transcribing && (
            <Text style={{ color: theme.inkSoft, fontSize: 12.5, marginTop: 8, textAlign: 'center' }}>
              ⏳ جارِ تحويل الصوت إلى نص عبر الذكاء الاصطناعي…
            </Text>
          )}
          {insight && (
            <View style={[styles.insightBox, { backgroundColor: theme.accentContrast }]}>
              <Text style={{ color: theme.accent, fontSize: 12.5, lineHeight: 18 }}>🤖 {insight}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ k, v, theme, last }: { k: string; v: string; theme: any; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: 1 }, { borderColor: theme.line }]}>
      <Text style={{ color: theme.inkSoft, fontSize: 13.5 }}>{k}</Text>
      <Text style={{ color: theme.ink, fontSize: 13.5 }}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  avatarLg: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  heroName: { fontSize: 19, fontWeight: '700', marginBottom: 3 },
  heroRole: { fontSize: 13 },
  infoList: { borderWidth: 1, borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 18 },
  pill: { borderRadius: 999, paddingHorizontal: 11, paddingVertical: 4 },
  sectionLabel: { fontSize: 12, marginBottom: 8 },
  historyRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1 },
  notesCard: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 20 },
  textarea: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 9, fontSize: 13, minHeight: 90, textAlignVertical: 'top' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  secondaryBtn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  primaryBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  insightBox: { borderRadius: 10, padding: 10, marginTop: 10 },
});
