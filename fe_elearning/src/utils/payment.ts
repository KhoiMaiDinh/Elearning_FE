import axiosInstance from './axios';
const APIInitPaymentAccount = async (data: any) => {
  try {
    const response = await axiosInstance.post('/payments/accounts', data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during init payment account:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetPaymentAccount = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/payments/users/${id}/accounts`);
    if (response.status === 200) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return { data: null, status: response.status };
  } catch (err) {
    console.log('Error during get payment account:', err);
    throw err;
  }
};

const APIUpdatePaymentAccount = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/payments/users/${id}/accounts`, data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during update payment account:', err);
    throw err;
  }
};
const APIGetAllPaymentBank = async () => {
  try {
    const response = await axiosInstance.get('/payments/banks');
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during get all payment bank:', err);
    throw err;
  }
};
export {
  APIInitPaymentAccount,
  APIGetPaymentAccount,
  APIGetAllPaymentBank,
  APIUpdatePaymentAccount,
};
