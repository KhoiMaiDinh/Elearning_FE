import axiosInstance from './axios';

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
    Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null)
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
  const response = await axiosInstance.post(`/courses/${course_id}/review`, data);
  if (response.status === 201) {
    return {
      data: response.data,
      status: response.status,
    };
  }
  return null;
};

const APIGetReview = async (course_id: string) => {
  try {
    const response = await axiosInstance.get(`/courses/${course_id}/reviews`);
    if (response.status === 200) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const APIGetCommentsForInstructor = async (params?: {
  aspect?: string;
  emotion?: string;
  is_solved?: boolean;
  limit?: number;
  afterCursor?: string;
}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null)
  );
  const response = await axiosInstance.get(`/instructors/lecture-comments`, {
    params: filteredParams,
  });
  if (response.status === 200) {
    return response.data;
  }
};

export { APIPostComment, APIGetComment, APIPostReview, APIGetReview, APIGetCommentsForInstructor };
