import axiosInstance from './axios';

const APIGetOverview = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/users/overview');
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return {
      data: response,
      status: response.status,
    }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err: any) {
    console.error('Error during get overview:', err.message);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export { APIGetOverview };
