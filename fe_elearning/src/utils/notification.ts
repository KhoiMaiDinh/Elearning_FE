import axiosInstance from './axios';
const APIGetNotification = async (params?: {
  afterCursor?: string;
  beforeCursor?: string;
  limit?: number;
  q?: string;
  order?: string;
  lang?: string;
}) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null)
    );
    const response = await axiosInstance.get('/notifications', { params: filteredParams });
    if (response.status === 200) {
      return {
        data: response?.data?.data,
        status: response.status,
        total: response?.data?.pagination?.totalRecords,
        unseen_count: response?.data?.unseen_count,
        afterCursor: response?.data?.pagination?.afterCursor || undefined,
        beforeCursor: response?.data?.pagination?.beforeCursor || undefined,
      };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during init payment account:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIReadNotification = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/notifications/${id}/seen`);
    if (response.status === 200) {
      return { data: response?.data?.data, status: response.status };
    }
    return { data: null, status: response.status };
  } catch (err) {
    console.error('Error during read notification:', err);
    throw err;
  }
};

const APIReadAllNotification = async () => {
  try {
    const response = await axiosInstance.patch(`/notifications/seen-all`);
    if (response.status === 200) {
      return { data: response?.data?.data, status: response.status };
    }
    return { data: null, status: response.status };
  } catch (err) {
    console.error('Error during read all notification:', err);
    throw err;
  }
};

export { APIGetNotification, APIReadNotification, APIReadAllNotification };
