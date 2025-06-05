import axios from 'axios';
import axiosInstance from './axios';

const APIGetPresignedUrl = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/medias`, data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during get presigned url:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};
const uploadToMinIO = async (
  file: File,
  entity: string,
  entity_property: string,
  onProgress?: (progress: number) => void
): Promise<{ key: string; id: string }> => {
  try {
    const presignedData = await APIGetPresignedUrl({
      filename: file.name,
      entity: entity,
      entity_property: entity_property,
    });
    const { postURL, formData } = presignedData?.data?.result ?? {};
    const id = presignedData?.data?.id;

    const uploadFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => uploadFormData.append(key, value as string));
    uploadFormData.append('file', file);
    uploadFormData.append('id', id);

    const response = await axios.post(postURL, uploadFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    if (response.status === 204 || response.status === 200) {
      const key = uploadFormData.get('key');
      if (!key) throw new Error('Missing key in form data');
      return { key: key.toString(), id };
    } else {
      throw new Error('Upload thất bại');
    }
  } catch (error) {
    console.log('Error uploading to MinIO:', error);
    throw error;
  }
};

const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(file);
  });
};

export { APIGetPresignedUrl, uploadToMinIO, getVideoDuration };
