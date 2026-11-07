import api from "./client";

// 아동 정보 조회
export const getChild = async (childId) => {
  const response = await api.get(`/children/${childId}`);
  return response.data;
};

// 아동 건강 대시보드 조회
export const getDashboard = async (childId) => {
  const response = await api.get(`/children/${childId}/dashboard`);
  return response.data;
};