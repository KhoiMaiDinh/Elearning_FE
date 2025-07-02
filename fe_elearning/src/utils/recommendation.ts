import axiosInstance from './axios';

const APIGetRecommendation = async (params?: { amount?: number }) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null)
    );
    const response = await axiosInstance.get(`/recommendations/courses`, {
      params: filteredParams,
    });
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data,
      };
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const APIGetRecommendationByCourseId = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/recommendations/courses/${courseId}/similar`);
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { APIGetRecommendation, APIGetRecommendationByCourseId };
