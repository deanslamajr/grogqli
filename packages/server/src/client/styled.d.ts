// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      // new colors
      highGray: string;
      borders: string;
      selectedMenuItemBackground: string;
      selectedMenuItemUnderline: string;
      selectedMenuItemText: string;
      unselectedMenuItemText: string;
      // old colors
      black: string;
      grayDark: string;
      grayLight: string;
      white: string;
      whiteDark: string;
      green: string;
      blue: string;
      blueClearDark: string;
      blueClear: string;
      red: string;
    };
    sizes: {
      formFieldWidth: string;
      navbarButtonIconSize: string;
    };
    zIndex: {
      highest: number;
      middle: number;
      lowest: number;
    };
    font: string;
  }
}
