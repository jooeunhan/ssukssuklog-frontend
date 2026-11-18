import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { theme } from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";

import Layout from "./components/common/Layout";
import HealthDashboard from "./pages/HealthDashboard";
import HealthInput from "./pages/HealthInput";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HealthDashboard />} />
            <Route path="/health-input" element={<HealthInput />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
