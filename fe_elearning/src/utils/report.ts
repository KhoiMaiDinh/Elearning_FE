import axiosInstance from "./axios";
const APICreateReport = async (data: any) => {
  try {
    const response = await axiosInstance.post("/reports", data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during create report:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export { APICreateReport };
