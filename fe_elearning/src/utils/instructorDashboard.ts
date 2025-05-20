import axiosInstance from './axios';

const APIInstructorOverview = async (queryParams: { month: number; year: number }) => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/overview', {
      params: queryParams,
    });

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APIStudentGrowth = async (queryParams: { year: number }) => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/growth', {
      params: queryParams,
    });

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APICourseCompletionRate = async () => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/completion-rate');

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APIInstructorRevenue = async (queryParams: { year: number }) => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/revenue', {
      params: queryParams,
    });

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APIRevenueByCourse = async () => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/revenue-by-course');

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APIPayoutSummary = async () => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/payout-summary');

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APINextPayout = async () => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/next-payout');

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APIAverageStudentEngagement = async () => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/student-engagement');

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

const APIAverageCourseRating = async () => {
  try {
    const response = await axiosInstance.get('dashboard/instructors/courses-rating');

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
  } catch (err) {
    console.error('Error during create order:', err);
    throw err;
  }
};

export {
  APIInstructorOverview,
  APIStudentGrowth,
  APICourseCompletionRate,
  APIInstructorRevenue,
  APIRevenueByCourse,
  APIPayoutSummary,
  APINextPayout,
  APIAverageStudentEngagement,
  APIAverageCourseRating,
};
