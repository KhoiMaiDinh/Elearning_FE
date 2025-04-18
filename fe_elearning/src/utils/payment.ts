import axiosInstance from "./axios";
const APIInitPaymentAccount = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.post("/payments/connect/stripe", data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during init payment account:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetPaymentAccount = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/payments/users/${id}/accounts`);
    if (response.status === 200) {
      return {
        data: response.data.data,
        status: response.status,
      };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get payment account:", err);
    throw err;
  }
};
export { APIInitPaymentAccount, APIGetPaymentAccount };
