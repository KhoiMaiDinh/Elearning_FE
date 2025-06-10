import axiosInstance from './axios';

const APIGetPreference = async () => {
  try {
    const response = await axiosInstance.get(`/preferences/me`);
    if (response.status === 200) {
      return { status: response.status, data: response.data };
    }
    return { status: response.status, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: null };
  }
};

const APISavePreference = async (data: any) => {
  try {
    const response = await axiosInstance.put(`/preferences/me`, data);
    if (response.status === 200) {
      return { status: response.status, data: response.data };
    }
    return { status: response.status, data: null };
  } catch (error) {
    console.error(error);
    return { status: 500, data: null };
  }
};

export { APISavePreference, APIGetPreference };
