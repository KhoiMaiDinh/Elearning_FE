import axiosInstance from "./axios";
const APICreateOrder = async (data: any) => {
  try {
    const response = await axiosInstance.post("/orders", data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during create order:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetOrderById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/orders/${id}`);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get order by id:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetListOrderByMe = async () => {
  try {
    const response = await axiosInstance.get("/orders/me");
    if (response.status === 200) {
      return {
        data: response.data.data,
        status: response.status,
        total: response.data.pagination.totalRecords,
      };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get list order:", err);
    throw err;
  }
};
export { APICreateOrder, APIGetOrderById, APIGetListOrderByMe };
