import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useTheme } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { fetchTeam, inviteTeamMember } from '../../src/lib/api';
import type { Profile } from '../../src/lib/types';

export default function SettingsScreen() {
  const theme = useTheme();
  const { profile, signOut } = useAuth();
  const [team, setTeam] = useState<Profile[]>([]);
  const [jobTrackOn, setJobTrackOn] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchTeam().then(setTeam);
    }, []),
  );

  async function handleInvite() {
    setInviting(true);
    setInviteMsg(null);
    try {
      await inviteTeamMember(inviteEmail.trim(), inviteName.trim());
      setInviteMsg('تم الإرسال ✓');
      setInviteName('');
      setInviteEmail('');
      setTeam(await fetchTeam());
    } catch (e: any) {
      setInviteMsg(e?.message ?? 'تعذّرت الدعوة');
    } finally {
      setInviting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <ScreenHeader title="الإعدادات" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <Row theme={theme} k="الحساب" v={profile?.email ?? '—'} />
        <Row theme={theme} k="البريد الإلكتروني" sub="للإرسال المباشر من التطبيق" right={<Pill theme={theme} label="متصل ✓" on />} />
        <Row theme={theme} k="واتساب" sub="للإرسال المباشر من التطبيق" right={<Pill theme={theme} label="متصل ✓" on />} />
        <Row
          theme={theme}
          k="تتبع تغيّر الوظيفة والترقيات"
          sub="عبر مزوّد بيانات مرخّص (Apollo / People Data Labs) — يتطلب اشتراكًا منفصلًا"
          right={
            <Pressable onPress={() => setJobTrackOn((v) => !v)}>
              <Pill theme={theme} label={jobTrackOn ? 'مفعّل ✓' : 'غير مفعّل'} on={jobTrackOn} />
            </Pressable>
          }
        />

        <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>فريق العلاقات العامة</Text>
        {team.map((m) => (
          <Row
            key={m.id}
            theme={theme}
            k={m.name + (m.id === profile?.id ? ' (أنت)' : '')}
            sub={m.email}
            right={<Pill theme={theme} label={m.role === 'admin' ? 'مدير' : 'عضو'} on={m.role === 'admin'} />}
          />
        ))}

        {profile?.role === 'admin' && (
          <View style={{ marginTop: 8 }}>
            <Pressable onPress={() => setInviteOpen((v) => !v)} style={[styles.secondaryBtn, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}>
              <Text style={{ color: theme.ink, fontWeight: '600' }}>+ دعوة عضو جديد</Text>
            </Pressable>
            {inviteOpen && (
              <View style={{ marginTop: 10 }}>
                <TextInput
                  value={inviteName}
                  onChangeText={setInviteName}
                  placeholder="الاسم"
                  placeholderTextColor={theme.inkSoft}
                  style={[styles.input, { borderColor: theme.line, color: theme.ink, backgroundColor: theme.paperRaised, marginBottom: 8 }]}
                />
                <TextInput
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  placeholder="البريد الإلكتروني"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor={theme.inkSoft}
                  style={[styles.input, { borderColor: theme.line, color: theme.ink, backgroundColor: theme.paperRaised, marginBottom: 8 }]}
                />
                <Pressable
                  onPress={handleInvite}
                  disabled={inviting || !inviteName.trim() || !inviteEmail.trim()}
                  style={[styles.primaryBtn, { backgroundColor: theme.accent, opacity: inviting ? 0.7 : 1 }]}
                >
                  {inviting ? <ActivityIndicator color={theme.accentContrast} /> : (
                    <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>إرسال الدعوة</Text>
                  )}
                </Pressable>
                {inviteMsg && <Text style={{ color: theme.accent, fontSize: 12.5, marginTop: 8, textAlign: 'center' }}>{inviteMsg}</Text>}
              </View>
            )}
          </View>
        )}

        <Pressable onPress={signOut} style={[styles.secondaryBtn, { borderColor: theme.line, backgroundColor: theme.paperRaised, marginTop: 20 }]}>
          <Text style={{ color: theme.stamp, fontWeight: '700' }}>تسجيل الخروج</Text>
        </Pressable>

        <Text style={{ color: theme.inkSoft, fontSize: 12, textAlign: 'center', marginTop: 20 }}>الإصدار 1.0</Text>
      </ScrollView>
    </View>
  );
}

function Row({ theme, k, v, sub, right }: { theme: any; k: string; v?: string; sub?: string; right?: React.ReactNode }) {
  return (
    <View style={[styles.row, { borderColor: theme.line }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.ink, fontSize: 13.5 }}>{k}</Text>
        {(v || sub) && <Text style={{ color: theme.inkSoft, fontSize: 11.5, marginTop: 2 }}>{v ?? sub}</Text>}
      </View>
      {right}
    </View>
  );
}

function Pill({ theme, label, on }: { theme: any; label: string; on: boolean }) {
  return (
    <View style={[styles.pill, { backgroundColor: on ? theme.accentContrast : 'transparent', borderColor: on ? 'transparent' : theme.line }]}>
      <Text style={{ color: on ? theme.accent : theme.inkSoft, fontSize: 11.5, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, gap: 10 },
  sectionLabel: { fontSize: 12, marginTop: 18, marginBottom: 4 },
  pill: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 4 },
  secondaryBtn: { borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
});
