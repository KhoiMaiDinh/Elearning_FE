import axiosInstance from './axios';

const APIDeleteDraftLecture = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/lectures/${id}`);
    if (response.status === 204) {
      return { status: response.status };
    }
    return null;
  } catch (err) {
    console.log('Error during deleting draft lecture:', err);
  }
};

const APIHideLecture = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/lectures/${id}/hide`);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null;
  } catch (err) {
    console.log('Error during hiding lecture:', err);
  }
};

const APIUnhideLecture = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/lectures/${id}/unhide`);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null;
  } catch (err) {
    console.log('Error during unhiding lecture:', err);
  }
};

export { APIDeleteDraftLecture, APIHideLecture, APIUnhideLecture };
