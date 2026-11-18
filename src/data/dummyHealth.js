export const child = {
  id: 1,
  name: "윤보연",
  className: "엔피아반",
  age: 5,
  gender: "여아",
  allergies: ["아토피"],
};

export const temperatureData = [
  { date: "10/31", temperature: 36.5 },
  { date: "11/01", temperature: 36.7 },
  { date: "11/02", temperature: 36.6 },
  { date: "11/03", temperature: 36.8 },
  { date: "11/04", temperature: 36.7 },
  { date: "11/05", temperature: 37.1 },
  { date: "11/06", temperature: 37.5 },
];

export const healthRecords = [
  {
    id: 1,
    date: "2026-11-06",
    temperature: 37.5,
    note: "기침이 잦고 평소보다 활동량이 줄어들었어요.",
  },
  {
    id: 2,
    date: "2026-11-05",
    temperature: 37.1,
    note: "평소보다 식사량이 조금 적었어요.",
  },
  {
    id: 3,
    date: "2026-11-04",
    temperature: 36.7,
    note: "특이사항 없이 즐겁게 놀이했어요.",
  },
];

export const aiAnalysis = {
  status: "관찰 필요",
  symptoms: ["기침", "활동량 감소"],
  summary:
    "최근 체온이 상승하는 경향을 보이며 기침과 활동량 감소가 함께 관찰되었습니다.",
  recommendation: "체온을 다시 측정하고 증상 변화를 지속적으로 관찰해 주세요.",
};
