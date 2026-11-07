import api from "./client";

// 건강 기록 목록 조회
export const getHealthRecords = async (childId) => {
  const response = await api.get(`/children/${childId}/records`);
  return response.data;
};

// 특정 날짜의 건강 기록 조회
export const getHealthRecord = async (childId, recordId) => {
  const response = await api.get(
    `/children/${childId}/records/${recordId}`
  );
  return response.data;
};

// 건강 기록 등록
export const createHealthRecord = async (childId, data) => {
  const response = await api.post(
    `/children/${childId}/records`,
    data
  );
  return response.data;
};

// 건강 기록 수정
export const updateHealthRecord = async (
  childId,
  recordId,
  data
) => {
  const response = await api.patch(
    `/children/${childId}/records/${recordId}`,
    data
  );
  return response.data;
};