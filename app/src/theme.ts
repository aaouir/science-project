import { useColorScheme } from 'react-native';

const light = {
  paper: '#EFE9DC',
  paperRaised: '#FFFFFF',
  ink: '#211C16',
  inkSoft: '#6B6255',
  accent: '#2F5D50',
  accentContrast: '#EAF3EE',
  stamp: '#A8462B',
  stampContrast: '#FBEEE7',
  gold: '#92701C',
  goldContrast: '#F7EDD0',
  line: 'rgba(33,28,22,0.13)',
};

const dark = {
  paper: '#17150F',
  paperRaised: '#221E17',
  ink: '#F1ECE3',
  inkSoft: '#B6AC9D',
  accent: '#7CC4A5',
  accentContrast: '#12241D',
  stamp: '#E2825A',
  stampContrast: '#3A2018',
  gold: '#E3C069',
  goldContrast: '#3A2F12',
  line: 'rgba(241,236,227,0.14)',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}

export const RELATION_META: Record<string, { label: string; special: boolean }> = {
  client: { label: 'عميل', special: false },
  partner: { label: 'شريك', special: false },
  friend: { label: 'صديق', special: false },
  media: { label: 'إعلام دولي', special: true },
  diplomat: { label: 'دبلوماسي', special: true },
  intl_org: { label: 'منظمة دولية', special: true },
  vip: { label: 'VIP', special: true },
};
