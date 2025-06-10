// src/components/courseDetails/CourseReviewForm.tsx
import { APIPostReview } from '@/utils/comment';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast, ToastContainer } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import { useTheme } from 'next-themes';
interface Review {
  course_id: string;
}

const CourseReviewForm: React.FC<Review> = ({ course_id }) => {
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(0);
  const theme = useTheme();
  const onSubmit = async (data: any) => {
    try {
      const dataSubmit = {
        rating: rating,
        rating_comment: data?.rating_comment,
      };
      const response = await APIPostReview(course_id, dataSubmit);
      if (response?.status === 201) {
        reset();
        toast.success(<ToastNotify status={1} message="Đánh giá đã được gửi thành công" />, {
          style: styleSuccess,
        });
      } else {
        toast.error(<ToastNotify status={-1} message="Đánh giá không thành công" />, {
          style: styleError,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(<ToastNotify status={-1} message="Đánh giá không thành công" />, {
        style: styleError,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 bg-white dark:bg-eerieBlack p-8 rounded-lg shadow-lg border border-gray-300 w-full max-w-lg"
    >
      <div>
        <label>Rating:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => setRating(star)} className="text-Sunglow">
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <label>Nhận xét:</label>
        <textarea
          {...register('rating_comment')}
          className="h-32 p-2 rounded-md border border-gray-300 dark:bg-eerieBlack dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue text-white px-4 py-2 rounded-md"
      >
        Gửi đánh giá
      </button>
    </form>
  );
};

export default CourseReviewForm;
