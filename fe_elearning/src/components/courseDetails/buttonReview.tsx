import { useState } from "react";
import { Star } from "lucide-react";
import CourseReviewForm from "./courseReviewForm";

export default function ButtonReview({ course_id }: { course_id: string }) {
  const [showReview, setShowReview] = useState(true);

  return (
    <div className="fixed bottom-24 right-2 z-50 flex flex-col items-end gap-3">
      {/* Review Form */}
      {showReview && <CourseReviewForm course_id={course_id} />}

      {/* Button to toggle review form (optional, if you want to keep it) */}
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
