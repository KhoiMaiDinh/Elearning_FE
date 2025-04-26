import { CommentList } from "@/components/aspect/comment-list";
import { CommentForm } from "@/components/aspect/comment-form";
import { AspectEmotionCircles } from "@/components/aspect/aspect-emotion-circles";
import { commentsData } from "@/components/aspect/comment-list";

export default function StatisticLecture() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Course Feedback</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <AspectEmotionCircles comments={commentsData} />
          <CommentList />
        </div>
        <div className="order-first md:order-last">
          <CommentForm />
        </div>
      </div>
    </main>
  );
}
