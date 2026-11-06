import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont,
      "Segoe UI", "Malgun Gothic", sans-serif;

    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};

    -webkit-font-smoothing: antialiased;
  }

  button, input, textarea, select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export default GlobalStyle;
