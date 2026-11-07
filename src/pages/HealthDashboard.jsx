import { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  Baby,
  Plus,
  Thermometer,
  CalendarDays,
  Activity,
  BrainCircuit,
  ClipboardList,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  child,
  temperatureData,
  healthRecords,
  aiAnalysis,
} from "../data/dummyHealth";
import api from "../api/client";

function HealthDashboard() {
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/children/1/dashboard");

        console.log("대시보드 API 응답:", response.data);
      } catch (error) {
        console.error("대시보드 API 오류:", error);
      }
    };

    fetchDashboard();
  }, []);

  const latestTemperature =
    temperatureData[temperatureData.length - 1]?.temperature;

  return (
    <Container>
      <PageHeader>
        <div>
          <PageTitle>아동 개인 건강 분석</PageTitle>
          <PageDescription>
            우리 아이의 건강 변화를 한눈에 살펴봐요.
          </PageDescription>
        </div>

        <InputButton to="/health-input">
          <Plus size={18} />
          증상 입력하기
        </InputButton>
      </PageHeader>

      <ProfileCard>
        <ProfileIcon>
          <Baby size={30} />
        </ProfileIcon>

        <ProfileInfo>
          <ChildName>{child.name}</ChildName>
          <ChildDetail>
            {child.className} · 만 {child.age}세 · {child.gender}
          </ChildDetail>
          <ChildDetail>알레르기: {child.allergies.join(", ")}</ChildDetail>
        </ProfileInfo>
      </ProfileCard>

      <SummaryGrid>
        <SummaryCard $color="pink">
          <SummaryLabel>
            <Thermometer size={17} />
            최근 체온
          </SummaryLabel>
          <SummaryValue>{latestTemperature}℃</SummaryValue>
        </SummaryCard>

        <SummaryCard $color="yellow">
          <SummaryLabel>
            <Activity size={17} />
            개인 기준 체온
          </SummaryLabel>
          <SummaryValue>36.6℃</SummaryValue>
        </SummaryCard>

        <SummaryCard $color="white">
          <SummaryLabel>
            <CalendarDays size={17} />
            최근 건강 기록
          </SummaryLabel>
          <SummaryValue>{healthRecords.length}건</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <ContentGrid>
        <SectionCard>
          <SectionTitle>
            <Activity size={20} />
            최근 7일 체온 변화
          </SectionTitle>

          <ChartArea>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E4E5" />
                <XAxis dataKey="date" />
                <YAxis domain={[36, 38]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#D9869D"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="체온"
                  unit="℃"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartArea>
        </SectionCard>

        <AnalysisCard>
          <SectionTitle>
            <BrainCircuit size={20} />
            AI 건강 분석
          </SectionTitle>

          <StatusBadge>{aiAnalysis.status}</StatusBadge>

          <AnalysisLabel>관찰된 증상</AnalysisLabel>
          <SymptomList>
            {aiAnalysis.symptoms.map((symptom) => (
              <SymptomTag key={symptom}>{symptom}</SymptomTag>
            ))}
          </SymptomList>

          <AnalysisText>{aiAnalysis.summary}</AnalysisText>

          <Recommendation>
            <strong>관찰 제안</strong>
            <p>{aiAnalysis.recommendation}</p>
          </Recommendation>
        </AnalysisCard>
      </ContentGrid>

      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <ClipboardList size={20} />
            최근 건강 기록
          </SectionTitle>
        </SectionHeader>

        <RecordList>
          {healthRecords.map((record) => (
            <RecordItem key={record.id}>
              <RecordInfo>
                <RecordDate>{record.date}</RecordDate>
                <RecordNote>{record.note}</RecordNote>
              </RecordInfo>

              <RecordTemperature>{record.temperature}℃</RecordTemperature>
            </RecordItem>
          ))}
        </RecordList>
      </SectionCard>
    </Container>
  );
}

export default HealthDashboard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PageTitle = styled.h2`
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.7px;
`;

const PageDescription = styled.p`
  margin-top: 7px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const InputButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  border-radius: 13px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 25px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primaryLight};
`;

const ProfileIcon = styled.div`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ChildName = styled.h3`
  font-size: 21px;
  font-weight: 800;
`;

const ChildDetail = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  padding: 22px;
  border-radius: 18px;
  background: ${({ theme, $color }) =>
    $color === "pink"
      ? theme.colors.primaryLight
      : $color === "yellow"
        ? theme.colors.secondaryLight
        : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SummaryLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
`;

const SummaryValue = styled.div`
  margin-top: 15px;
  font-size: 27px;
  font-weight: 800;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.section`
  min-width: 0;
  padding: 25px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 17px;
  font-weight: 800;

  svg {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ChartArea = styled.div`
  width: 100%;
  height: 280px;
  margin-top: 22px;
`;

const AnalysisCard = styled(SectionCard)`
  background: ${({ theme }) => theme.colors.secondaryLight};
`;

const StatusBadge = styled.span`
  display: inline-block;
  width: fit-content;
  margin-top: 20px;
  padding: 7px 12px;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
`;

const AnalysisLabel = styled.p`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 700;
`;

const SymptomList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const SymptomTag = styled.span`
  padding: 6px 11px;
  border-radius: 20px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;
`;

const AnalysisText = styled.p`
  margin-top: 18px;
  font-size: 14px;
  line-height: 1.8;
`;

const Recommendation = styled.div`
  margin-top: 18px;
  padding: 15px;
  background: white;
  border-radius: 13px;
  font-size: 13px;
  line-height: 1.7;

  p {
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const RecordList = styled.div`
  margin-top: 15px;
`;

const RecordItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 17px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RecordDate = styled.span`
  font-size: 13px;
  font-weight: 700;
`;

const RecordNote = styled.span`
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RecordTemperature = styled.span`
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primaryDark};
`;
