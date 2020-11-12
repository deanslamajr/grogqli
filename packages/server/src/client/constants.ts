import { DefaultTheme } from 'styled-components';

export const cssTheme: DefaultTheme = {
  colors: {
    black: 'rgba(31, 54, 61, 1)',
    grayDark: 'rgba(188, 216, 220, 1)',
    grayLight: 'rgba(214, 231, 234, 1)',
    white: 'rgba(240, 248, 255, 1)',
    whiteDark: 'rgba(214, 236, 255, 1)',
    green: 'rgba(5, 241, 64, 1)',
    blue: 'rgba(62, 146, 204, 1)',
    blueClearDark: 'rgba(62, 146, 204, .75)',
    blueClear: 'rgba(62, 146, 204, .25)',
    red: 'rgba(236, 115, 87, 1)',
  },
  sizes: {
    navbarButtonIconSize: '2rem',
  },
  zIndex: {
    highest: 999,
    middle: 0,
    lowest: -999,
  },
  font: `'Roboto', sans-serif`,
};
