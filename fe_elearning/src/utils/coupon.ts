import axiosInstance from './axios';

const APIGetCouponsFromInstructor = async (queryParams: { limit: number }) => {
  try {
    const response = await axiosInstance.get('coupons/me', {
      params: queryParams,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.log('Error during create order:', err);
    throw err;
  }
};

const APICreateCoupon = async (data: any) => {
  try {
    const response = await axiosInstance.post('/coupons', data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during create coupon:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIUpdateCoupon = async (data: any, code: string) => {
  try {
    const response = await axiosInstance.put(`/coupons/${code}`, data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during update coupon:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIDeleteCoupon = async (code: string) => {
  try {
    const response = await axiosInstance.delete(`/coupons/${code}`);
    if (response.status === 204) {
      return { status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during delete coupon:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIUpdateStatusCoupon = async (code: string) => {
  try {
    const response = await axiosInstance.put(`/coupons/${code}/toggle`);
    if (response.status === 204) {
      return { status: response.status };
    }
    return { data: null, status: response.status };
  } catch (err) {
    console.log('Error during update status coupon:', err);
    throw err;
  }
};

const APIGetCouponByCourse = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/coupons/courses/${courseId}`);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.log('Error during get coupon by course:', err);
    throw err;
  }
};
export {
  APIGetCouponsFromInstructor,
  APICreateCoupon,
  APIUpdateCoupon,
  APIDeleteCoupon,
  APIUpdateStatusCoupon as APIUpdateCouponStatus,
  APIGetCouponByCourse,
};
