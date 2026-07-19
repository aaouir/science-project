import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { BackHeader } from '../../src/components/BackHeader';
import { MessageComposer } from '../../src/components/MessageComposer';
import { useTheme, RELATION_META } from '../../src/theme';
import { createContact, draftWelcomeMessage, extractCardFields, fetchEvents } from '../../src/lib/api';
import type { EventRow, Relation } from '../../src/lib/types';

type Fields = { name: string; title: string; company: string; email: string; phone: string };

export default function AddContactScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId?: string }>();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const [fields, setFields] = useState<Fields>({ name: '', title: '', company: '', email: '', phone: '' });
  const [tagsText, setTagsText] = useState('');
  const [relation, setRelation] = useState<Relation>('client');
  const [eventId, setEventId] = useState<string | null>(params.eventId ?? null);
  const [events, setEvents] = useState<EventRow[]>([]);

  const [saving, setSaving] = useState(false);
  const [savedName, setSavedName] = useState('');
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [savedPhone, setSavedPhone] = useState<string | null>(null);
  const [draft, setDraft] = useState<Awaited<ReturnType<typeof draftWelcomeMessage>>['draft'] | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchEvents().then(setEvents).catch(() => {});
    }, []),
  );

  async function processImage(base64: string, mediaType: string) {
    setScanning(true);
    setScanError(null);
    try {
      const { fields: extracted } = await extractCardFields(base64, mediaType);
      setFields({
        name: extracted.name ?? '',
        title: extracted.title ?? '',
        company: extracted.company ?? '',
        email: extracted.email ?? '',
        phone: extracted.phone ?? '',
      });
      setStep(2);
    } catch (e: any) {
      setScanError(e?.message ?? 'تعذّرت قراءة البطاقة. يمكنك تعبئة البيانات يدويًا.');
      setStep(2);
    } finally {
      setScanning(false);
      setShowCamera(false);
    }
  }

  async function capturePhoto() {
    if (!cameraRef.current || !cameraReady) return;
    const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.6 });
    if (photo?.base64) await processImage(photo.base64, 'image/jpeg');
  }

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      await processImage(result.assets[0].base64, result.assets[0].mimeType ?? 'image/jpeg');
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const tags = tagsText.split('،').map((t) => t.trim()).filter(Boolean);
      const contact = await createContact({
        name: fields.name,
        title: fields.title,
        company: fields.company,
        email: fields.email,
        phone: fields.phone,
        relation,
        event_id: eventId,
        tags,
      });
      setSavedName(contact.name);
      setSavedEmail(contact.email);
      setSavedPhone(contact.phone);
      setStep(3);

      const event = events.find((e) => e.id === eventId);
      if (event) {
        setDraftLoading(true);
        try {
          const { draft: d } = await draftWelcomeMessage({
            contactName: contact.name,
            contactTitle: contact.title ?? undefined,
            contactCompany: contact.company ?? undefined,
            eventName: event.name,
          });
          setDraft(d);
        } catch {
          setDraft(null);
        } finally {
          setDraftLoading(false);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  const selectedEvent = events.find((e) => e.id === eventId);

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <BackHeader
        title={step === 1 ? 'تصوير البطاقة' : step === 2 ? 'مراجعة البيانات' : 'تم الحفظ'}
        onBack={() => (step > 1 && step < 3 ? setStep((s) => (s - 1) as 1 | 2) : router.back())}
      />
      <View style={styles.stepper}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={[styles.seg, { backgroundColor: n <= step ? theme.accent : theme.line }]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        {step === 1 && (
          <View>
            {showCamera ? (
              <View style={{ height: 380, borderRadius: 16, overflow: 'hidden' }}>
                <CameraView
                  ref={cameraRef}
                  style={{ flex: 1 }}
                  facing="back"
                  onCameraReady={() => setCameraReady(true)}
                />
                <Pressable
                  onPress={capturePhoto}
                  disabled={!cameraReady || scanning}
                  style={[styles.captureBtn, { backgroundColor: theme.accent }]}
                >
                  {scanning ? <ActivityIndicator color={theme.accentContrast} /> : (
                    <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>التقط الصورة</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <View style={[styles.scanZone, { borderColor: theme.line }]}>
                <View style={[styles.camIcon, { backgroundColor: theme.accentContrast }]}>
                  <Text style={{ fontSize: 24 }}>📷</Text>
                </View>
                <Text style={[styles.scanText, { color: theme.inkSoft }]}>
                  وجّه الكاميرا نحو بطاقة العمل، وسيقرأ التطبيق الاسم والمسمى والشركة والبريد تلقائيًا.
                </Text>
                <Pressable
                  onPress={async () => {
                    if (!permission?.granted) {
                      const res = await requestPermission();
                      if (!res.granted) return;
                    }
                    setShowCamera(true);
                  }}
                  style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
                >
                  <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>التقط الصورة</Text>
                </Pressable>
                <Pressable onPress={pickFromGallery} style={{ marginTop: 12, alignItems: 'center' }}>
                  <Text style={{ color: theme.accent, fontWeight: '600', fontSize: 13 }}>أو اختر صورة من المعرض</Text>
                </Pressable>
              </View>
            )}
            {scanning && !showCamera && (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ActivityIndicator color={theme.accent} />
                <Text style={{ color: theme.inkSoft, marginTop: 8 }}>جارِ استخراج البيانات…</Text>
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <View>
            {scanError ? <Text style={{ color: theme.stamp, marginBottom: 12, fontSize: 12.5 }}>{scanError}</Text> : null}
            <Field label="الاسم الكامل" value={fields.name} onChange={(v) => setFields((f) => ({ ...f, name: v }))} />
            <Field label="المسمى الوظيفي" value={fields.title} onChange={(v) => setFields((f) => ({ ...f, title: v }))} />
            <Field label="الشركة" value={fields.company} onChange={(v) => setFields((f) => ({ ...f, company: v }))} />
            <Field label="البريد الإلكتروني" value={fields.email} onChange={(v) => setFields((f) => ({ ...f, email: v }))} keyboardType="email-address" />
            <Field label="رقم الجوال" value={fields.phone} onChange={(v) => setFields((f) => ({ ...f, phone: v }))} keyboardType="phone-pad" />

            <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>قابلته في فعالية؟ (اختياري)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ChipOption label="بدون فعالية" active={!eventId} onPress={() => setEventId(null)} theme={theme} />
                {events.map((e) => (
                  <ChipOption key={e.id} label={e.name} active={eventId === e.id} onPress={() => setEventId(e.id)} theme={theme} />
                ))}
              </View>
            </ScrollView>

            <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>نوع العلاقة</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {Object.entries(RELATION_META).map(([id, meta]) => (
                  <ChipOption
                    key={id}
                    label={(meta.special ? '⭐ ' : '') + meta.label}
                    active={relation === id}
                    onPress={() => setRelation(id as Relation)}
                    theme={theme}
                  />
                ))}
              </View>
            </ScrollView>

            <Field label="وسوم (افصل بفاصلة عربية «،»)" value={tagsText} onChange={setTagsText} />

            <Pressable
              onPress={handleSave}
              disabled={saving || !fields.name}
              style={[styles.primaryBtn, { backgroundColor: theme.accent, opacity: saving ? 0.7 : 1, marginTop: 8 }]}
            >
              {saving ? <ActivityIndicator color={theme.accentContrast} /> : (
                <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>حفظ جهة الاتصال</Text>
              )}
            </Pressable>
          </View>
        )}

        {step === 3 && (
          <View>
            <View style={[styles.successBadge, { backgroundColor: theme.accentContrast }]}>
              <Text style={{ fontSize: 26 }}>✓</Text>
            </View>
            <Text style={[styles.successText, { color: theme.ink }]}>تمت إضافة {savedName}</Text>
            <Text style={[styles.successSub, { color: theme.inkSoft }]}>
              {selectedEvent ? `مرتبطة بفعالية ${selectedEvent.name} — إليك رسالة الترحيب المقترحة` : 'بدون فعالية — لا حاجة لرسالة ترحيب'}
            </Text>

            {draftLoading && <ActivityIndicator color={theme.accent} style={{ marginVertical: 16 }} />}
            {draft && (
              <MessageComposer draft={draft} recipientEmail={savedEmail} recipientPhone={savedPhone} recipientName={savedName} />
            )}

            <Pressable
              onPress={() => router.replace('/(tabs)' as any)}
              style={[styles.primaryBtn, { backgroundColor: theme.accent, marginTop: 16 }]}
            >
              <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>تم</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: 'email-address' | 'phone-pad';
}) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.fieldLabel, { color: theme.inkSoft }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={[styles.input, { borderColor: theme.line, color: theme.ink, backgroundColor: theme.paperRaised }]}
      />
    </View>
  );
}

function ChipOption({ label, active, onPress, theme }: { label: string; active: boolean; onPress: () => void; theme: any }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? theme.accent : theme.paperRaised, borderColor: active ? theme.accent : theme.line }]}
    >
      <Text style={{ color: active ? theme.accentContrast : theme.inkSoft, fontWeight: active ? '700' : '400', fontSize: 12.5 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingBottom: 10 },
  seg: { flex: 1, height: 4, borderRadius: 3 },
  scanZone: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, padding: 28, alignItems: 'center' },
  camIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  scanText: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 18 },
  primaryBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', width: '100%' },
  captureBtn: { position: 'absolute', bottom: 16, alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  fieldLabel: { fontSize: 11.5, marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  successBadge: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  successText: { fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  successSub: { fontSize: 12.5, textAlign: 'center', marginBottom: 8 },
});
