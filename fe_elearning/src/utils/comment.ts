import axiosInstance from "./axios";

const APIPostComment = async (id: string, data: any) => {
  const response = await axiosInstance.post(`/lectures/${id}/comments`, data);
  if (response.status === 201) {
    return {
      data: response.data,
      status: response.status,
    };
  }
  return null;
};

const APIGetComment = async (
  id: string,
  params?: {
    aspect?: string;
    emotion?: string;
    is_solved?: boolean;
  }
) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  );
  const response = await axiosInstance.get(`/lectures/${id}/comments`, {
    params: filteredParams,
  });
  if (response.status === 200) {
    return {
      data: response.data.comments,
      aspect: response.data.aspect,
      status: response.status,
    };
  }
  return null;
};

const APIPostReview = async (course_id: string, data: any) => {
  const response = await axiosInstance.post(
    `/courses/${course_id}/review`,
    data
  );
  if (response.status === 200) {
    return {
      data: response.data,
      status: response.status,
    };
  }
  return null;
};

export { APIPostComment, APIGetComment, APIPostReview };
