import axiosInstance from "./axios";
const APIRegisterLecture = async (data: any) => {
  try {
    const response = await axiosInstance.post("/instructors", data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during register lecture:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export { APIRegisterLecture };
