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

export default APIPostComment;
