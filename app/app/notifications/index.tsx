import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { BackHeader } from '../../src/components/BackHeader';
import { useTheme } from '../../src/theme';
import { approveJobAlert, dismissJobAlert, fetchJobAlerts } from '../../src/lib/api';
import type { JobAlert } from '../../src/lib/types';

const FIELD_LABEL: Record<string, string> = { title: 'المسمى الوظيفي', company: 'جهة العمل' };

export default function NotificationsScreen() {
  const theme = useTheme();
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setAlerts(await fetchJobAlerts());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function handleApprove(alert: JobAlert) {
    setBusyId(alert.id);
    try {
      await approveJobAlert(alert);
      await load();
    } finally {
      setBusyId(null);
    }
  }
  async function handleDismiss(alert: JobAlert) {
    setBusyId(alert.id);
    try {
      await dismissJobAlert(alert.id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const pending = alerts.filter((a) => a.status === 'pending');
  const handled = alerts.filter((a) => a.status !== 'pending');

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <BackHeader title="إشعارات تغيّر الوظيفة" />
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View>
            <Text style={{ color: theme.inkSoft, fontSize: 12.5, marginBottom: 14 }}>
              تُرصد هذه التغييرات عبر مزوّد بيانات مرخّص، وتُحدَّث دوريًا وليس لحظيًا.
            </Text>

            {alerts.length === 0 && (
              <Text style={{ textAlign: 'center', color: theme.inkSoft, padding: 24 }}>لا توجد إشعارات حاليًا.</Text>
            )}

            {pending.length > 0 && <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>تحديثات جديدة</Text>}
            {pending.map((a) => (
              <View key={a.id} style={[styles.card, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
                <View style={[styles.bicon, { backgroundColor: theme.goldContrast }]}>
                  <Text>💼</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.ink, fontSize: 13, lineHeight: 19 }}>
                    <Text style={{ fontWeight: '700' }}>{a.contacts?.name}</Text>: {FIELD_LABEL[a.field]} من "{a.old_value}" إلى{' '}
                    <Text style={{ fontWeight: '700' }}>"{a.new_value}"</Text>
                  </Text>
                  <View style={styles.btnRow}>
                    <Pressable
                      onPress={() => handleDismiss(a)}
                      disabled={busyId === a.id}
                      style={[styles.secondaryBtn, { borderColor: theme.line, backgroundColor: theme.paper }]}
                    >
                      <Text style={{ color: theme.ink, fontSize: 12.5, fontWeight: '600' }}>تجاهل</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleApprove(a)}
                      disabled={busyId === a.id}
                      style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
                    >
                      {busyId === a.id ? (
                        <ActivityIndicator color={theme.accentContrast} size="small" />
                      ) : (
                        <Text style={{ color: theme.accentContrast, fontSize: 12.5, fontWeight: '700' }}>
                          قبول وتحديث البطاقة
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}

            {handled.length > 0 && <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>تم التعامل معها</Text>}
            {handled.map((a) => (
              <View key={a.id} style={[styles.card, { backgroundColor: theme.paperRaised, borderColor: theme.line, opacity: 0.6 }]}>
                <View style={[styles.bicon, { backgroundColor: theme.goldContrast }]}>
                  <Text>💼</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.ink, fontSize: 13 }}>
                    {a.contacts?.name}: {FIELD_LABEL[a.field]} → "{a.new_value}"
                  </Text>
                  <Text style={{ color: theme.inkSoft, fontSize: 11, fontWeight: '700', marginTop: 4 }}>
                    {a.status === 'approved' ? 'تم التحديث ✓' : 'تم التجاهل'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 12, marginTop: 4, marginBottom: 8 },
  card: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  bicon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  secondaryBtn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  primaryBtn: { flex: 1.4, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
});
