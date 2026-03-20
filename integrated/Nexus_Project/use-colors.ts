import { useColorScheme } from 'react-native';
import { theme } from '../lib/theme';

export function useColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return isDark ? theme.dark : theme.light;
}
