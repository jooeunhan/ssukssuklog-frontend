import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  ArrowLeft,
  Baby,
  Thermometer,
  ClipboardPenLine,
  BrainCircuit,
  Sparkles,
  Check,
} from "lucide-react";

import { child } from "../data/dummyHealth";

const symptomOptions = [
  "기침",
  "콧물",
  "발진",
  "구토",
  "설사",
  "무기력",
  "식욕 저하",
  "인후통",
];

function HealthInput() {
  const navigate = useNavigate();

  const [temperatures, setTemperatures] = useState({
    morning: "",
    noon: "",
    afternoon: "",
  });

  const [clinicalNote, setClinicalNote] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [error, setError] = useState("");

  const handleTemperatureChange = (field, value) => {
    setTemperatures((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const values = Object.values(temperatures);

    if (values.some((value) => value.trim() === "")) {
      setError("오전, 점심, 오후 체온을 모두 입력해 주세요.");
      return;
    }

    if (
      values.some((value) => {
        const number = Number(value);
        return !Number.isFinite(number) || number < 34 || number > 42;
      })
    ) {
      setError("체온은 34℃ 이상 42℃ 이하로 입력해 주세요.");
      return;
    }

    if (!clinicalNote.trim()) {
      setError("건강 관찰 기록을 입력해 주세요.");
      return;
    }

    const payload = {
      child_id: child.id,
      date: new Date().toLocaleDateString("sv-SE"),
      morning_temp: Number(temperatures.morning),
      noon_temp: Number(temperatures.noon),
      afternoon_temp: Number(temperatures.afternoon),
      clinical_note: clinicalNote.trim(),
      selected_symptoms: selectedSymptoms,
    };

    // TODO: FastAPI 연결 후 실제 저장 및 AI 분석 요청
    console.log("건강 기록 입력 데이터:", payload);

    navigate("/");
  };

  return (
    <Container>
      <BackButton type="button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        건강 분석으로 돌아가기
      </BackButton>

      <PageHeader>
        <PageTitle>오늘의 건강 기록</PageTitle>
        <PageDescription>
          아이의 체온과 건강 상태를 기록해 주세요.
        </PageDescription>
      </PageHeader>

      <ChildCard>
        <ChildIcon>
          <Baby size={25} />
        </ChildIcon>

        <div>
          <ChildName>{child.name}</ChildName>
          <ChildDetail>
            {child.className} · 만 {child.age}세 · {child.gender}
          </ChildDetail>
        </div>
      </ChildCard>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>
            <Thermometer size={20} />
            체온 기록
          </SectionTitle>
          <SectionDescription>
            하루 동안 측정한 체온을 입력해 주세요.
          </SectionDescription>

          <TemperatureGrid>
            {[
              { key: "morning", label: "오전" },
              { key: "noon", label: "점심" },
              { key: "afternoon", label: "오후" },
            ].map(({ key, label }) => (
              <TemperatureField key={key}>
                <FieldLabel htmlFor={`temp-${key}`}>{label}</FieldLabel>
                <InputWrapper>
                  <TemperatureInput
                    id={`temp-${key}`}
                    type="number"
                    min="34"
                    max="42"
                    step="0.1"
                    placeholder="36.5"
                    value={temperatures[key]}
                    onChange={(e) =>
                      handleTemperatureChange(key, e.target.value)
                    }
                  />
                  <Unit>℃</Unit>
                </InputWrapper>
              </TemperatureField>
            ))}
          </TemperatureGrid>
        </Section>

        <Section>
          <SectionTitle>
            <ClipboardPenLine size={20} />
            건강 관찰 기록
          </SectionTitle>
          <SectionDescription>
            아이의 증상, 행동 변화, 식사량 등을 자유롭게 작성해 주세요.
          </SectionDescription>

          <NoteTextarea
            value={clinicalNote}
            onChange={(e) => setClinicalNote(e.target.value)}
            placeholder="예: 오늘 오전부터 기침을 자주 하고 평소보다 활동량이 줄어들었어요. 점심 식사도 평소보다 적게 먹었어요."
            rows={6}
          />

          <HelperText>자연어 관찰 기록은 AI 증상 분석에 활용됩니다.</HelperText>
        </Section>

        <Section>
          <SectionTitle>
            <Check size={20} />
            관찰 증상
            <OptionalLabel>선택</OptionalLabel>
          </SectionTitle>
          <SectionDescription>
            관찰된 증상을 선택해 주세요. 여러 개 선택할 수 있어요.
          </SectionDescription>

          <SymptomList>
            {symptomOptions.map((symptom) => (
              <SymptomButton
                key={symptom}
                type="button"
                $selected={selectedSymptoms.includes(symptom)}
                aria-pressed={selectedSymptoms.includes(symptom)}
                onClick={() => toggleSymptom(symptom)}
              >
                {selectedSymptoms.includes(symptom)}
                {symptom}
              </SymptomButton>
            ))}
          </SymptomList>
        </Section>

        <AnalysisInfo>
          <BrainCircuit size={23} />
          <div>
            <AnalysisTitle>AI 건강 분석 안내</AnalysisTitle>
            <AnalysisDescription>
              입력한 체온과 자연어 관찰 기록을 기반으로 증상을 추출하고, 아동의
              개인 건강 정보를 반영한 분석을 진행합니다.
            </AnalysisDescription>
          </div>
        </AnalysisInfo>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        <SubmitButton type="submit">
          <Sparkles size={19} />
          기록 확인 및 AI 분석하기
        </SubmitButton>
      </Form>
    </Container>
  );
}

export default HealthInput;

const Container = styled.div`
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const PageHeader = styled.div`
  margin-top: 5px;
`;

const PageTitle = styled.h2`
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.7px;
`;

const PageDescription = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChildCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: 18px;
`;

const ChildIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChildName = styled.h3`
  font-size: 18px;
  font-weight: 800;
`;

const ChildDetail = styled.p`
  margin-top: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.section`
  padding: 26px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;

  @media (max-width: 600px) {
    padding: 20px;
  }
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

const SectionDescription = styled.p`
  margin-top: 9px;
  margin-bottom: 22px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TemperatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TemperatureField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 0 13px;
  background: ${({ theme }) => theme.colors.background};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const TemperatureInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 14px 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-weight: 700;
`;

const Unit = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NoteTextarea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 13px;
  background: ${({ theme }) => theme.colors.background};
  resize: vertical;
  outline: none;
  line-height: 1.8;
  font-size: 14px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const HelperText = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const OptionalLabel = styled.span`
  padding: 4px 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.secondaryLight};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SymptomList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SymptomButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primaryDark : theme.colors.border};
  border-radius: 20px;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const AnalysisInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px;
  border-radius: 17px;
  background: ${({ theme }) => theme.colors.secondaryLight};

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

const AnalysisTitle = styled.h4`
  font-size: 14px;
  font-weight: 800;
`;

const AnalysisDescription = styled.p`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.p`
  padding: 12px 15px;
  border-radius: 10px;
  background: #fff0f0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  padding: 17px;
  border: none;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 800;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }
`;
