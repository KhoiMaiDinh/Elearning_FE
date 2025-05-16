import axiosInstance from './axios';

const APIGetRatingsForInstructor = async (params?: { limit?: number; afterCursor?: string }) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null)
  );
  const response = await axiosInstance.get(`/instructors/ratings`, {
    params: filteredParams,
  });
  if (response.status === 200) {
    return response.data;
  }
};

export { APIGetRatingsForInstructor as APIGetInstructorRatings };
