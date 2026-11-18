import styled from "styled-components";
import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Container>
      <Inner>
        <Logo to="/">
          <LogoIcon>
            <HeartPulse size={22} strokeWidth={2.2} />
          </LogoIcon>

          <LogoText>
            <Title>쑥쑥로그</Title>
            <Subtitle>아이들의 건강한 하루</Subtitle>
          </LogoText>
        </Logo>
      </Inner>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px 28px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Title = styled.h1`
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.7px;
`;

const Subtitle = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
