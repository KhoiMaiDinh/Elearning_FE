import axiosInstance from './axios';

const APIGetInstructorThreads = async (params?: {
  limit?: number;
  afterCursor?: string;
  has_replied?: boolean;
}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null)
  );
  console.log(filteredParams);
  const response = await axiosInstance.get(`/threads/instructors`, {
    params: filteredParams,
  });
  if (response.status === 200) {
    return response.data;
  }
};

export { APIGetInstructorThreads };
