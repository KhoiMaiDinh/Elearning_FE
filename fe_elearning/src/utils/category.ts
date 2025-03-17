import axiosInstance from "./axios";
const APIGetCategory = async ({ language }: { language: string }) => {
  try {
    if (!language) {
      language = "vi";
    }
    const response = await axiosInstance.get("/categories", {
      params: {
        language,
      },
    });
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get category:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export { APIGetCategory };
