import axiosInstance from './axios';

const APIGetPreference = async () => {
  try {
    const response = await axiosInstance.get(`/preferences/me`);
    if (response.status === 200) {
      return { status: response.status, data: response.data };
    }
  } catch (error) {
    console.error(error);
  }
};

const APISavePreference = async (data: any) => {
  try {
    const response = await axiosInstance.put(`/preferences/me`, data);
    if (response.status === 200) {
      return { status: response.status, data: response.data };
    }
  } catch (error) {
    console.error(error);
  }
};

export { APISavePreference, APIGetPreference };
