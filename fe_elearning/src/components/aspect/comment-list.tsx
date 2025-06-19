'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  Code,
  Clock,
  Layers,
  PresentationIcon,
  UserRoundCheckIcon,
  BookCheck,
} from 'lucide-react';
import { LectureComment } from '@/types/commentType';

// Define interfaces for type safety
interface Aspect {
  id: number;
  name: string;
  icon: any; // Using any for Lucide icons
}

// Define the aspects and emotions
export const aspects: Aspect[] = [
  { id: 1, name: 'Chất lượng nội dung', icon: PresentationIcon },
  { id: 2, name: 'Công nghệ', icon: Code },
  { id: 3, name: 'Chất lượng giảng viên', icon: UserRoundCheckIcon },
  { id: 4, name: 'Tốc độ dạy', icon: Clock },
  { id: 5, name: 'Tài liệu học tập', icon: BookOpen },
  { id: 6, name: 'Bài tập và thực hành', icon: BookCheck },
  { id: 7, name: 'Khác', icon: Layers },
];

interface CommentCardProps {
  comment: LectureComment;
}

function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={
                  comment.user.profile_image?.key
                    ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${comment.user.profile_image.key}`
                    : '/placeholder.svg'
                }
                alt={`${comment.user.first_name} ${comment.user.last_name}`}
              />
              <AvatarFallback>{`${comment.user.first_name[0]}${comment.user.last_name[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{`${comment.user.first_name} ${comment.user.last_name}`}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {comment.aspects &&
              comment.aspects.length > 0 &&
              comment.aspects.map((aspect) => {
                const emotionColor =
                  aspect.emotion === 'positive'
                    ? 'bg-greenCrayola/10 text-greenCrayola'
                    : aspect.emotion === 'neutral'
                      ? 'bg-blueberry/10 text-blueberry'
                      : aspect.emotion === 'conflict'
                        ? 'bg-[#f59e0b]/10 text-[#f59e0b]'
                        : 'bg-carminePink/10 text-carminePink';
                return (
                  <Badge
                    key={aspect.comment_aspect_id}
                    variant="outline"
                    className={`flex items-center gap-1 ${emotionColor}`}
                  >
                    <span>
                      {aspect.aspect === 'instructor_quality'
                        ? 'Chất lượng giảng viên'
                        : aspect.aspect === 'content_quality'
                          ? 'Chất lượng nội dung'
                          : aspect.aspect === 'technology'
                            ? 'Công nghệ'
                            : aspect.aspect === 'teaching_pace'
                              ? 'Tốc độ dạy'
                              : aspect.aspect === 'study_materials'
                                ? 'Tài liệu học tập'
                                : aspect.aspect === 'assignments_practice'
                                  ? 'Bài tập và thực hành'
                                  : aspect.aspect === 'other'
                                    ? 'Khác'
                                    : aspect.aspect}
                    </span>
                  </Badge>
                );
              })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{comment.content}</p>
      </CardContent>
    </Card>
  );
}

export function CommentList({ comments }: { comments: LectureComment[] }) {
  const [filter, setFilter] = useState({
    aspect: 'all',
    emotion: 'all',
  });

  if (!comments) {
    return <div>Không có bình luận</div>;
  }

  const filteredComments = comments.filter((comment: LectureComment) => {
    const aspectMatch =
      filter.aspect === 'all' || comment.aspects.some((a) => a.aspect === filter.aspect);
    const emotionMatch =
      filter.emotion === 'all' || comment.aspects.some((a) => a.emotion === filter.emotion);
    return aspectMatch && emotionMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-2xl font-semibold">Bình luận ({comments.length})</h2>
        <div className="flex gap-2">
          <Select
            value={filter.aspect}
            onValueChange={(value) => setFilter({ ...filter, aspect: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo khía cạnh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khía cạnh</SelectItem>
              <SelectItem value="instructor_quality">Chất lượng giảng viên</SelectItem>
              <SelectItem value="content_quality">Chất lượng nội dung</SelectItem>
              <SelectItem value="technology">Công nghệ</SelectItem>
              <SelectItem value="teaching_pace">Tốc độ dạy</SelectItem>
              <SelectItem value="study_materials">Tài liệu học tập</SelectItem>
              <SelectItem value="assignments_practice">Bài tập và thực hành</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filter.emotion}
            onValueChange={(value) => setFilter({ ...filter, emotion: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả cảm xúc</SelectItem>
              <SelectItem value="positive">Tích cực</SelectItem>
              <SelectItem value="neutral">Trung lập</SelectItem>
              <SelectItem value="negative">Tiêu cực</SelectItem>
              <SelectItem value="conflict">Xung đột</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="positive">Tích cực</TabsTrigger>
          <TabsTrigger value="neutral">Trung lập</TabsTrigger>
          <TabsTrigger value="negative">Tiêu cực</TabsTrigger>
          <TabsTrigger value="conflict">Xung đột</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-5">
          {filteredComments &&
            filteredComments.length > 0 &&
            filteredComments.map((comment: LectureComment) => (
              <CommentCard key={comment?.lecture_comment_id} comment={comment} />
            ))}
        </TabsContent>

        <TabsContent value="positive" className="space-y-5">
          {filteredComments &&
            filteredComments.length > 0 &&
            filteredComments
              .filter((c: LectureComment) => c.aspects.some((a) => a.emotion === 'positive'))
              .map((comment: LectureComment) => (
                <CommentCard key={comment?.lecture_comment_id} comment={comment} />
              ))}
        </TabsContent>

        <TabsContent value="neutral" className="space-y-5">
          {filteredComments &&
            filteredComments.length > 0 &&
            filteredComments
              .filter((c: LectureComment) => c.aspects.some((a) => a.emotion === 'neutral'))
              .map((comment: LectureComment) => (
                <CommentCard key={comment?.lecture_comment_id} comment={comment} />
              ))}
        </TabsContent>

        <TabsContent value="negative" className="space-y-5">
          {filteredComments &&
            filteredComments.length > 0 &&
            filteredComments
              .filter((c: LectureComment) => c.aspects.some((a) => a.emotion === 'negative'))
              .map((comment: LectureComment) => (
                <CommentCard key={comment?.lecture_comment_id} comment={comment} />
              ))}
        </TabsContent>

        <TabsContent value="conflict" className="space-y-5">
          {filteredComments &&
            filteredComments.length > 0 &&
            filteredComments
              .filter((c: LectureComment) => c.aspects.some((a) => a.emotion === 'conflict'))
              .map((comment: LectureComment) => (
                <CommentCard key={comment?.lecture_comment_id} comment={comment} />
              ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
