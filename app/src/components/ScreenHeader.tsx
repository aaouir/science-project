import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDrawer } from '../context/DrawerContext';
import { useTheme } from '../theme';

export function ScreenHeader({
  title,
  subtitle,
  rightAction,
  showMenu = true,
}: {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  showMenu?: boolean;
}) {
  const { openDrawer } = useDrawer();
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {showMenu ? (
        <Pressable
          onPress={openDrawer}
          style={[styles.iconBtn, { borderColor: theme.line, backgroundColor: theme.paperRaised }]}
          accessibilityLabel="القائمة"
        >
          <Text style={{ fontSize: 16, color: theme.ink }}>☰</Text>
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.title, { color: theme.ink }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: theme.inkSoft }]}>{subtitle}</Text> : null}
      </View>
      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 19, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
});
