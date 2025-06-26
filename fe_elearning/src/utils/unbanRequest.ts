import { UnbanRequestType } from '@/types/unbanRequestType';
import axiosInstance from './axios';

export const APIRequestCourseUnban = async (
  course_id: string,
  data: Pick<UnbanRequestType, 'reason'>
) => {
  try {
    const response = await axiosInstance.post(`/courses/${course_id}/unban-requests`, data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status };
  } catch (err) {
    console.log('Error during course unban request:', err);
    throw err;
  }
};

export const APIGetCourseUnbanRequests = async (course_id: string) => {
  try {
    const response = await axiosInstance.get(`/courses/${course_id}/unban-requests`);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status };
  } catch (err) {
    console.log('Error fetching unban requests:', err);
    throw err;
  }
};
