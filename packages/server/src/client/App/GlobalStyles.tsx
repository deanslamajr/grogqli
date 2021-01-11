import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.font};
    height: 100vh;
    background-color: ${(props) => props.theme.colors.generalBackgroundColor};
  }
`;

export default GlobalStyles;
