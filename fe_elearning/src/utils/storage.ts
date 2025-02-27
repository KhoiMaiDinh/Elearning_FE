import axiosInstance from "./axios";

const APIGetPresignedUrl = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/medias`, data);
    if (response.status === 201) {
      return { data: response.data.result, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get presigned url:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export { APIGetPresignedUrl };
