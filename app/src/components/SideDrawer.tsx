import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useDrawer } from '../context/DrawerContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme';

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.78, 300);

const ITEMS: { href: string; icon: string; label: string }[] = [
  { href: '/(tabs)', icon: '🏠', label: 'الرئيسية' },
  { href: '/(tabs)/search', icon: '🔍', label: 'البحث' },
  { href: '/(tabs)/events', icon: '📅', label: 'الفعاليات' },
  { href: '/news', icon: '📣', label: 'أخباري' },
  { href: '/followups', icon: '🔁', label: 'تواصل دوري' },
  { href: '/settings', icon: '⚙️', label: 'الإعدادات' },
];

export function SideDrawer() {
  const { open, closeDrawer } = useDrawer();
  const { profile } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: open ? 0 : DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: open ? 1 : 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [open]);

  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', opacity: backdropOpacity }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>
      <Animated.View
        style={[
          styles.panel,
          { width: DRAWER_WIDTH, backgroundColor: theme.paperRaised, transform: [{ translateX }] },
        ]}
      >
        <View style={[styles.header, { borderColor: theme.line }]}>
          <View style={[styles.avatar, { backgroundColor: theme.accentContrast }]}>
            <Text style={{ color: theme.accent, fontWeight: '700' }}>
              {profile?.name ? profile.name.trim().split(' ').slice(0, 2).map((p) => p[0]).join('') : '؟'}
            </Text>
          </View>
          <View>
            <Text style={[styles.username, { color: theme.ink }]}>{profile?.name ?? '—'}</Text>
            <Text style={[styles.role, { color: theme.inkSoft }]}>
              {profile?.role === 'admin' ? 'مدير' : 'عضو فريق'}
            </Text>
          </View>
        </View>
        <View style={{ gap: 4 }}>
          {ITEMS.map((item) => {
            const active = pathname === item.href || (item.href === '/(tabs)' && pathname === '/');
            return (
              <Pressable
                key={item.href}
                onPress={() => {
                  closeDrawer();
                  router.push(item.href as any);
                }}
                style={[styles.item, active && { backgroundColor: theme.accentContrast }]}
              >
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text style={{ color: active ? theme.accent : theme.ink, fontWeight: active ? '700' : '400', fontSize: 14 }}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    padding: 20,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  username: { fontSize: 14.5, fontWeight: '700' },
  role: { fontSize: 11.5, marginTop: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 },
});
