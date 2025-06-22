import { useState } from 'react';
import { Star } from 'lucide-react';
import CourseReviewForm from './courseReviewForm';

interface ButtonReviewProps {
  course_id: string;
  onReviewSuccess?: () => void; // Callback khi đánh giá thành công
}

export default function ButtonReview({ course_id, onReviewSuccess }: ButtonReviewProps) {
  const [showReview, setShowReview] = useState(false);

  const handleReviewSuccess = () => {
    // Gọi callback từ parent nếu có
    if (onReviewSuccess) {
      onReviewSuccess();
    }
  };

  return (
    <div className="fixed bottom-24 right-2 z-50 flex flex-col items-end gap-3">
      {/* Review Form */}
      {showReview && (
        <CourseReviewForm
          course_id={course_id}
          setShowReview={setShowReview}
          onReviewSuccess={handleReviewSuccess}
        />
      )}

      {/* Button to toggle review form */}
      <button
        onClick={() => setShowReview((prev) => !prev)}
        className="text-white flex h-10 w-10 items-center justify-center rounded-full bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue shadow-md transition hover:scale-110"
        aria-label="Toggle review form"
      >
        <Star className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
