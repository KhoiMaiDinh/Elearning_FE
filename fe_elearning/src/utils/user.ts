import axiosInstance from "./axios";
const APIGetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get current user:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export { APIGetCurrentUser };
