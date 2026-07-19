import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BackHeader } from '../src/components/BackHeader';
import { useTheme } from '../src/theme';
import { askNetwork } from '../src/lib/api';

const SUGGESTIONS = ['من يهتم بالاستثمار أو الاستدامة؟', 'من لديه صلات حكومية أو دبلوماسية؟', 'من يحتاج متابعة قريبًا؟'];

export default function NetworkAiScreen() {
  const theme = useTheme();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  async function ask(q: string) {
    setQuestion(q);
    setLoading(true);
    setAnswer(null);
    try {
      const { answer: a } = await askNetwork(q);
      setAnswer(a);
    } catch (e: any) {
      setAnswer(`تعذّر التحليل: ${e?.message ?? 'خطأ غير متوقع'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <BackHeader title="اسأل عن شبكتك" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: theme.inkSoft, fontSize: 12.5, marginBottom: 12, lineHeight: 19 }}>
          يقرأ الذكاء الاصطناعي كل الملاحظات والعلاقات والفعاليات معًا — كمجتمع مترابط — لا كأسماء منفصلة، ليجيب على أسئلتك.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} onPress={() => ask(s)} style={[styles.chip, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}>
                <Text style={{ color: theme.inkSoft, fontSize: 12.5 }}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          multiline
          placeholder="اكتب سؤالك هنا…"
          placeholderTextColor={theme.inkSoft}
          style={[styles.textarea, { color: theme.ink, borderColor: theme.line, backgroundColor: theme.paperRaised }]}
        />
        <Pressable onPress={() => ask(question)} disabled={loading || !question.trim()} style={[styles.primaryBtn, { backgroundColor: theme.accent, opacity: loading ? 0.7 : 1 }]}>
          {loading ? <ActivityIndicator color={theme.accentContrast} /> : (
            <Text style={{ color: theme.accentContrast, fontWeight: '700' }}>اسأل الذكاء الاصطناعي</Text>
          )}
        </Pressable>

        {answer && (
          <View style={[styles.answerCard, { backgroundColor: theme.paperRaised, borderColor: theme.line }]}>
            <Text style={{ color: theme.stamp, fontWeight: '700', marginBottom: 8 }}>🤖 الإجابة</Text>
            <Text style={{ color: theme.ink, fontSize: 13, lineHeight: 21 }}>{answer}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  textarea: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, minHeight: 60, textAlignVertical: 'top', marginBottom: 12 },
  primaryBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  answerCard: { borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 16 },
});
