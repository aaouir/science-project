import React, { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setError(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? 'تعذّر تسجيل الدخول. تحقق من البريد وكلمة المرور.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.paper }]}>
      <View style={styles.center}>
        <View style={[styles.logo, { backgroundColor: theme.accentContrast }]}>
          <Text style={{ fontSize: 24 }}>🗂️</Text>
        </View>
        <Text style={[styles.title, { color: theme.ink }]}>شبكة علاقات الشركة</Text>
        <Text style={[styles.subtitle, { color: theme.inkSoft }]}>تسجيل الدخول لفريق العلاقات العامة</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.inkSoft }]}>البريد الإلكتروني للشركة</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="name@company.com"
            placeholderTextColor={theme.inkSoft}
            style={[styles.input, { borderColor: theme.line, color: theme.ink, backgroundColor: theme.paperRaised }]}
          />
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.inkSoft }]}>كلمة المرور</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={theme.inkSoft}
            style={[styles.input, { borderColor: theme.line, color: theme.ink, backgroundColor: theme.paperRaised }]}
          />
        </View>

        {error ? <Text style={{ color: theme.stamp, fontSize: 12.5, marginBottom: 8 }}>{error}</Text> : null}

        <Pressable
          onPress={handleLogin}
          disabled={busy || !email || !password}
          style={[styles.button, { backgroundColor: theme.accent, opacity: busy ? 0.7 : 1 }]}
        >
          {busy ? <ActivityIndicator color={theme.accentContrast} /> : (
            <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>دخول</Text>
          )}
        </Pressable>

        <Text style={[styles.hint, { color: theme.inkSoft }]}>
          حسابك يُنشأ من قبل مدير الفريق عبر "دعوة عضو" في الإعدادات.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 14 },
  title: { fontSize: 19, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 12.5, textAlign: 'center', marginBottom: 26 },
  field: { marginBottom: 12 },
  label: { fontSize: 11.5, marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  button: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 18, lineHeight: 18 },
});
