import axiosInstance from './axios';
const APIRegisterInstructor = async (data: any) => {
  try {
    const response = await axiosInstance.post('/instructors', data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during register lecture:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIUpdateInstructor = async (username: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/instructors/${username}`, data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during register lecture:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetInstructorByUserName = async (user_name: string) => {
  try {
    const response = await axiosInstance.get(`/instructors/${user_name}`);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during get lecture by id:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetListInstructor = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  order?: string;
  specialty?: string; // chuyên ngành
  is_approved?: boolean;
}) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );

    const response = await axiosInstance.get('/instructors', {
      params: filteredParams,
    });
    if (response.status === 200) {
      return {
        data: response?.data?.data,
        status: response?.status,
        total: response?.data?.pagination?.totalRecords,
      };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during get list lecture:', err);
    throw err;
  }
};
export {
  APIRegisterInstructor,
  APIGetInstructorByUserName,
  APIGetListInstructor,
  APIUpdateInstructor,
};
