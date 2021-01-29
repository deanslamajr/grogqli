import { DefaultTheme } from 'styled-components';

export const cssTheme: DefaultTheme = {
  colors: {
    // new colors
    sessionMenuBackgroundDark: 'rgba(231, 234, 237, 1)',
    generalBackgroundColor: 'rgba(255, 255, 255, 1)',
    highGray: 'rgba(243, 243, 243, 1)',
    borders: 'rgba(208, 208, 208, 1)',
    selectedMenuItemBackground: 'rgba(233, 233, 233, 1)',
    selectedMenuItemUnderline: 'rgba(46, 79, 235, 1)',
    selectedMenuItemText: 'rgba(51, 51, 51, 1)',
    darkerSelectedMenuItemText: 'rgba(38, 38, 38, 1)',
    unselectedMenuItemText: 'rgba(90, 93, 95, 1)',
    // old colors
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
    menuBarHeight: '29px',
    formFieldWidth: '20rem',
    navbarButtonIconSize: '2rem',
  },
  zIndex: {
    highest: 999,
    middle: 0,
    lowest: -999,
  },
  font: `'Roboto', sans-serif`,
};
