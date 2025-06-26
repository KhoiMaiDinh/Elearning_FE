// src/components/courseDetails/CourseReviewForm.tsx
import { APIPostReview } from '@/utils/comment';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';

interface Review {
  course_id: string;
  setShowReview: (showReview: boolean) => void;
  onReviewSuccess?: () => void; // Callback khi đánh giá thành công
}

const CourseReviewForm: React.FC<Review> = ({ course_id, setShowReview, onReviewSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
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
        setShowReview(false);
        // Gọi callback để refresh data thay vì reload trang
        if (onReviewSuccess) {
          onReviewSuccess();
        }
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 bg-white dark:bg-eerieBlack p-8 rounded-lg shadow-lg border border-gray-300 w-full max-w-lg"
    >
      <div>
        <label className="block text-sm font-medium mb-2">Đánh giá:</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl text-Sunglow hover:scale-110 transition-transform"
              disabled={isSubmitting}
            >
              {star <= rating ? '★' : '☆'}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {rating === 1 && 'Rất không hài lòng'}
          {rating === 2 && 'Không hài lòng'}
          {rating === 3 && 'Bình thường'}
          {rating === 4 && 'Hài lòng'}
          {rating === 5 && 'Rất hài lòng'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium">Nhận xét:</label>
        <textarea
          {...register('rating_comment')}
          placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
          className="h-32 p-3 rounded-md border border-gray-300 dark:bg-eerieBlack dark:text-white dark:border-gray-600 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue text-white px-4 py-2 rounded-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
};

export default CourseReviewForm;
