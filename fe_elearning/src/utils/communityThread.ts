import axiosInstance from './axios';

const APIPostThread = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/threads`, data);
    if (response.status === 200) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return { data: null, status: response.status };
  } catch (error) {
    console.error('Error during post thread:', error);
    throw error;
  }
};

const APIPostThreadReply = async (thread_id: string, data: any) => {
  try {
    const response = await axiosInstance.post(`/threads/${thread_id}/replies`, data);
    if (response.status === 200) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return { data: null, status: response.status };
  } catch (error) {
    console.error('Error during post thread reply:', error);
    throw error;
  }
};

const APIGetThreadReply = async (thread_id: string) => {
  try {
    const response = await axiosInstance.get(`/threads/${thread_id}/replies`);
    if (response.status === 200) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return { data: null, status: response.status };
  } catch (error) {
    console.error('Error during get thread reply:', error);
    throw error;
  }
};

const APIGetThread = async (lecture_id: string) => {
  try {
    const response = await axiosInstance.get(`/lectures/${lecture_id}/threads`);
    if (response.status === 200) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return { data: null, status: response.status };
  } catch (error) {
    console.error('Error during get thread:', error);
    throw error;
  }
};

const APILikeThreadReply = async (reply_id: string) => {
  try {
    const response = await axiosInstance.post(`/replies/${reply_id}/upvote`);
    if (response.status === 204) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return { data: null, status: response.status };
  } catch (error) {
    console.error('Error during like thread reply:', error);
    throw error;
  }
};

const APIUnLikeThreadReply = async (reply_id: string) => {
  try {
    const response = await axiosInstance.delete(`/replies/${reply_id}/upvote`);
    if (response.status === 204) {
      return {
        data: response.data,
        status: response.status,
      };
    }
    return { data: null, status: response.status };
  } catch (error) {
    console.error('Error during un like thread reply:', error);
    throw error;
  }
};

export {
  APIPostThread,
  APIPostThreadReply,
  APIGetThreadReply,
  APIGetThread,
  APILikeThreadReply,
  APIUnLikeThreadReply,
};
