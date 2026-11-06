import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <Container>
      <Header />

      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

export default Layout;

const Container = styled.div`
  min-height: 100vh;
`;

const Main = styled.main`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 36px 28px 80px;

  @media (max-width: 768px) {
    padding: 24px 18px 60px;
  }
`;
