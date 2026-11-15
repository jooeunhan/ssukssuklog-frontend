import { useEffect, useState } from "react";
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

import { getDashboard } from "../api/children";
import { getHealthRecords, analyzeHealthRecord } from "../api/health";

function HealthDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      try {
        const [dashboardData, recordsData] = await Promise.all([
          getDashboard(1),
          getHealthRecords(1),
        ]);

        if (!active) return;

        setDashboard(dashboardData);
        setHealthRecords(recordsData);
      } catch (err) {
        if (!active) return;
        console.error("대시보드 api 오류:", err);
        setError("건강 정보를 불러오지 못했음.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      active = false;
    };
  }, []);

  const handleAnalyze = async () => {
    const record = dashboard?.latest_record;

    if (!record || analyzing) return;

    // 분석 필수 입력 확인
    if (
      record.morning_temp == null ||
      record.noon_temp == null ||
      record.afternoon_temp == null ||
      !record.clinical_note?.trim()
    ) {
      setAnalysisError(
        "체온 3회와 관찰 기록을 모두 입력해야 AI 분석을 진행할 수 있어요."
      );
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);

    try {
      // Qwen → RF-D 분석 요청
      await analyzeHealthRecord(1, record.id);

      // 분석 완료 후 최신 데이터 다시 조회
      const [dashboardData, recordsData] = await Promise.all([
        getDashboard(1),
        getHealthRecords(1),
      ]);

      setDashboard(dashboardData);
      setHealthRecords(recordsData);
    } catch (err) {
      console.error("AI 분석 오류:", err);

      setAnalysisError(
        err.response?.data?.detail ||
        "AI 분석 중 오류가 발생했어요. 다시 시도해 주세요."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <Container>건강 정보를 불러오는 중...</Container>
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  const child = dashboard.child;
  const latestRecord = dashboard.latest_record;
  const baseline = dashboard.baseline?.baseline;

  const averageBaseline = baseline
    ? (
      (baseline.morning + baseline.noon + baseline.afternoon) / 3
    ).toFixed(1)
    : null;

  const temperatureDeviation = dashboard.temperature_deviation;

  const formatDeviation = (value) => {
    if (value == null) return null;

    const rounded = Number(value.toFixed(1));

    if (rounded === 0) return "±0.0℃";

    return `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)}℃`;
  };

  const temperatureData = (dashboard.temperature_history ?? [])
    .slice(-7)
    .map((record) => ({
      date: record.date.slice(5),
      morning: record.morning_temp,
      noon: record.noon_temp,
      afternoon: record.afternoon_temp,
    }));

  const latestTemperature = latestRecord
    ? (
      latestRecord.afternoon_temp ??
      latestRecord.noon_temp ??
      latestRecord.morning_temp
    )
    : null;

  const latestSymptoms = latestRecord?.selected_symptoms ?? [];

  const healthStatus = latestRecord?.health_status;

  const aiAnalysis = latestRecord?.ai_analysis;

  const analysisCompleted =
    latestRecord?.analysis_status === "completed";

  const healthStatusLabels = {
    0: "일상 관찰",
    1: "추가 관찰",
    2: "우선 확인",
  };

  const healthStatusDescriptions = {
    0: "현재 기록을 기준으로 일상적인 관찰을 이어갈 수 있어요.",
    1: "평소와 다른 변화가 관찰되어 조금 더 세심한 확인이 필요해요.",
    2: "관찰 기록에서 우선 확인이 필요한 변화가 나타났어요.",
  };

  const healthStatusLabel =
    healthStatusLabels[healthStatus] ?? "분석 결과 없음";

  const extractedSymptoms = Object.entries(
    aiAnalysis?.symptom_scores ?? {}
  );


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
            {child.class_name} · 만 {child.age}세 · {child.gender}
          </ChildDetail>
          <ChildDetail>
            알레르기: {child.allergies?.length
              ? child.allergies.join(", ")
              : "없음"}
          </ChildDetail>
        </ProfileInfo>
      </ProfileCard>

      <SummaryGrid>
        <SummaryCard $color="pink">
          <SummaryLabel>
            <Thermometer size={17} />
            최근 체온
          </SummaryLabel>
          <SummaryValue>
            {latestTemperature !== null
              ? `${latestTemperature.toFixed(1)}℃`
              : "기록 없음"}
          </SummaryValue>
        </SummaryCard>


        <SummaryCard $color="yellow">
          <SummaryLabel>
            <Activity size={17} />
            개인 기준 체온
          </SummaryLabel>

          <SummaryValue>
            {averageBaseline !== null
              ? `${averageBaseline}℃`
              : "데이터 부족"}
          </SummaryValue>

          {temperatureDeviation && (
            <DeviationList>
              <DeviationItem>
                <span>오전</span>
                <strong>
                  {formatDeviation(temperatureDeviation.morning) ?? "-"}
                </strong>
              </DeviationItem>

              <DeviationItem>
                <span>점심</span>
                <strong>
                  {formatDeviation(temperatureDeviation.noon) ?? "-"}
                </strong>
              </DeviationItem>

              <DeviationItem>
                <span>오후</span>
                <strong>
                  {formatDeviation(temperatureDeviation.afternoon) ?? "-"}
                </strong>
              </DeviationItem>
            </DeviationList>
          )}
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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F0E4E5"
                />
                <XAxis dataKey="date" />
                <YAxis domain={[35.5, 39]} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="morning"
                  stroke="#E6B65C"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="오전"
                  unit="℃"
                  connectNulls={false}
                />

                <Line
                  type="monotone"
                  dataKey="noon"
                  stroke="#D9869D"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="점심"
                  unit="℃"
                  connectNulls={false}
                />

                <Line
                  type="monotone"
                  dataKey="afternoon"
                  stroke="#8EACD0"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="오후"
                  unit="℃"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartArea>
        </SectionCard>


        <AnalysisCard>

          <AnalysisHeader>
            <SectionTitle>
              <BrainCircuit size={20} />
              AI 건강 분석
            </SectionTitle>


            <AnalyzeButton
              type="button"
              onClick={handleAnalyze}
              disabled={
                analyzing ||
                !latestRecord ||
                latestRecord.analysis_status === "processing"
              }
            >
              {analyzing ? (
                <>
                  <LoadingSpinner />
                  분석 중...
                </>
              ) : (
                "분석하기"
              )}
            </AnalyzeButton>

            {analyzing && (
              <LoadingMessage role="status">
                AI가 건강 관찰 기록을 분석하고 있어요.
                첫 분석은 분석 시간이 조금 걸릴 수 있어요.
              </LoadingMessage>
            )}

          </AnalysisHeader>

          {analysisError && (
            <AnalysisError>{analysisError}</AnalysisError>
          )}

          <StatusBadge>
            {analyzing
              ? "분석 중"
              : dashboard.analysis_status === "pending"
                ? "분석 대기"
                : dashboard.analysis_status === "processing"
                  ? "분석 중"
                  : dashboard.analysis_status === "failed"
                    ? "분석 실패"
                    : dashboard.analysis_status === "completed"
                      ? "분석 완료"
                      : "분석 대기"}
          </StatusBadge>

          {analysisCompleted && healthStatus !== null && healthStatus !== undefined ? (
            <>
              <HealthStatusBox $status={healthStatus}>
                <HealthStatusTitle>
                  {healthStatus}단계 · {healthStatusLabel}
                </HealthStatusTitle>

                <HealthStatusDescription>
                  {healthStatusDescriptions[healthStatus]}
                </HealthStatusDescription>
              </HealthStatusBox>

              <AnalysisLabel>AI가 추출한 관찰 증상</AnalysisLabel>

              <SymptomList>
                {extractedSymptoms.length > 0 ? (
                  extractedSymptoms.map(([symptom, score]) => (
                    <SymptomTag key={symptom}>
                      {symptom} · {score.toFixed(2)}
                    </SymptomTag>
                  ))
                ) : (
                  <span>추출된 증상 없음</span>
                )}
              </SymptomList>

              <AnalysisLabel>교사가 선택한 증상</AnalysisLabel>

              <SymptomList>
                {latestSymptoms.length > 0 ? (
                  latestSymptoms.map((symptom) => (
                    <SymptomTag key={symptom}>
                      {symptom}
                    </SymptomTag>
                  ))
                ) : (
                  <span>선택된 증상 없음</span>
                )}
              </SymptomList>

              <Recommendation>
                <strong>건강 관찰 안내</strong>
                <p>
                  {healthStatusDescriptions[healthStatus]}
                </p>
              </Recommendation>
            </>
          ) : (
            <AnalysisText>
              {dashboard.analysis_status === "failed"
                ? "AI 분석에 실패했어요. 다시 분석해 주세요."
                : "아직 AI 분석 결과가 없어요."}
            </AnalysisText>
          )}
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
          {healthRecords.slice(0, 7).map((record) => {
            const temperature =
              record.afternoon_temp ??
              record.noon_temp ??
              record.morning_temp;

            return (
              <RecordItem key={record.id}>
                <RecordInfo>
                  <RecordDate>{record.date}</RecordDate>
                  <RecordNote>
                    {record.clinical_note || "특이사항 없음"}
                  </RecordNote>
                </RecordInfo>

                <RecordTemperature>
                  {temperature !== null
                    ? `${temperature.toFixed(1)}℃`
                    : "미측정"}
                </RecordTemperature>
              </RecordItem>
            );
          })}
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

const HealthStatusBox = styled.div`
  margin-top: 18px;
  padding: 18px;
  border-radius: 14px;

  background: ${({ $status }) =>
    $status === 0
      ? "#E8F5EC"
      : $status === 1
        ? "#FFF1D6"
        : "#FCE3E7"};
`;

const HealthStatusTitle = styled.h4`
  font-size: 18px;
  font-weight: 800;
`;

const HealthStatusDescription = styled.p`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #555;
`;


const AnalysisHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const AnalyzeButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 12px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};

  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AnalysisError = styled.p`
  margin-top: 12px;
  color: #C94C64;
  font-size: 13px;
  line-height: 1.6;
`;

const DeviationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
`;

const DeviationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 12px;
  color: #6B7280;

  strong {
    font-size: 13px;
    font-weight: 700;
    color: #374151;
  }
`;

const LoadingSpinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingMessage = styled.p`
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.7;
  color: #6B7280;
`;
