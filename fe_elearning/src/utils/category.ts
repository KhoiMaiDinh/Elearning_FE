import axiosInstance from './axios';
const APIGetCategory = async ({
  language,
  with_children,
}: {
  language: string;
  with_children?: boolean;
}) => {
  try {
    if (!language) {
      language = 'vi';
    }
    const response = await axiosInstance.get('/categories', {
      params: {
        language,
        with_children: with_children || false,
      },
    });
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return { data: null, status: response.status }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during get category:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

export { APIGetCategory };
