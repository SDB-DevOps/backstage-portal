import {
  createUnifiedTheme,
  palettes,
  UnifiedTheme,
} from '@backstage/theme';

export const enterpriseDarkTheme: UnifiedTheme = createUnifiedTheme({
  palette: {
    ...palettes.dark,
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
    navigation: {
      background: '#0d1117',
      indicator: '#58a6ff',
      color: '#c9d1d9',
      selectedColor: '#ffffff',
      navItem: {
        hoverBackground: '#161b22',
      },
    },
  },
  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  defaultPageTheme: 'home',
});
