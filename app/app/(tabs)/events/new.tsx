import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BackHeader } from '../../../src/components/BackHeader';
import { useTheme } from '../../../src/theme';
import { createEvent } from '../../../src/lib/api';

export default function NewEventScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createEvent({ name: name.trim(), event_date: date.trim(), place: place.trim() });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <BackHeader title="فعالية جديدة" />
      <View style={{ padding: 16 }}>
        <Field label="اسم الفعالية" value={name} onChange={setName} placeholder="مثال: معرض التوظيف 2026" theme={theme} />
        <Field label="التاريخ" value={date} onChange={setDate} placeholder="مثال: 14 يوليو 2026" theme={theme} />
        <Field label="المكان" value={place} onChange={setPlace} placeholder="مثال: جدة" theme={theme} />
        <Pressable
          onPress={handleSave}
          disabled={saving || !name.trim()}
          style={[styles.button, { backgroundColor: theme.accent, opacity: saving ? 0.7 : 1 }]}
        >
          {saving ? <ActivityIndicator color={theme.accentContrast} /> : (
            <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>حفظ الفعالية</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, value, onChange, placeholder, theme }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: theme.inkSoft, fontSize: 11.5, marginBottom: 5 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.inkSoft}
        style={[styles.input, { borderColor: theme.line, color: theme.ink, backgroundColor: theme.paperRaised }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  button: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
});
