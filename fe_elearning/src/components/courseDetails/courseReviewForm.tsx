// src/components/courseDetails/CourseReviewForm.tsx
import { APIPostReview } from '@/utils/comment';
import React, { useState } from 'react';
import AlertSuccess from '../alert/AlertSuccess';
import AlertError from '../alert/AlertError';
import { useForm } from 'react-hook-form';

interface Review {
  course_id: string;
}

const CourseReviewForm: React.FC<Review> = ({ course_id }) => {
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(0);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [description, setDescription] = useState('');

  const onSubmit = async (data: any) => {
    try {
      const dataSubmit = {
        rating: rating,
        rating_comment: data?.rating_comment,
      };
      const response = await APIPostReview(course_id, dataSubmit);
      if (response?.status === 201) {
        setShowAlertSuccess(true);
        setDescription('Đánh giá đã được gửi thành công');
        reset();

        setTimeout(() => {
          setShowAlertSuccess(false);
          setDescription('');
        }, 3000);
      } else {
        setShowAlertError(true);
        setDescription('Đánh giá không thành công');
        setTimeout(() => {
          setShowAlertError(false);
          setDescription('');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setShowAlertError(true);
      setShowAlertSuccess(false);
      setDescription('Đánh giá không thành công');
      setTimeout(() => {
        setShowAlertError(false);
        setDescription('');
      }, 3000);
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
      {showAlertSuccess && <AlertSuccess description={description} />}
      {showAlertError && <AlertError description={description} />}
    </form>
  );
};

export default CourseReviewForm;
