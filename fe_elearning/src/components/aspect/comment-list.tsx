"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Code,
  Video,
  Clock,
  Users,
  MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/constants/store";

// Define interfaces for type safety
interface Aspect {
  id: number;
  name: string;
  icon: any; // Using any for Lucide icons
}

interface CommentAspect {
  comment_aspect_id: string;
  aspect: string;
  emotion: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: null;
}

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: {
    key: string;
    rejection_reason: null;
    status: string;
    bucket: string;
  };
}

interface Comment {
  lecture_comment_id: string;
  lecture_id: string;
  user_id: string;
  content: string;
  is_solved: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: null;
  aspects: CommentAspect[];
  user: User;
}

interface StatisticData {
  comments: Comment[];
  statistics: {
    instructor_quality: {
      positive: number;
      neutral: number;
      negative: number;
      none: number;
    };
    content_quality: {
      positive: number;
      neutral: number;
      negative: number;
      none: number;
    };
    technology: {
      positive: number;
      neutral: number;
      negative: number;
      none: number;
    };
  };
}

// Define the aspects and emotions
export const aspects: Aspect[] = [
  { id: 1, name: "Content", icon: BookOpen },
  { id: 2, name: "Code Examples", icon: Code },
  { id: 3, name: "Video Quality", icon: Video },
  { id: 4, name: "Pacing", icon: Clock },
  { id: 5, name: "Instructor", icon: Users },
  { id: 6, name: "Exercises", icon: MessageSquare },
];

interface CommentCardProps {
  comment: Comment;
}

function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={comment.user.profile_image?.key || "/placeholder.svg"}
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
            {comment.aspects.map((aspect) => {
              const emotionColor =
                aspect.emotion === "positive"
                  ? "bg-green-100 text-green-800"
                  : aspect.emotion === "neutral"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800";
              return (
                <Badge
                  key={aspect.comment_aspect_id}
                  variant="outline"
                  className={`flex items-center gap-1 ${emotionColor}`}
                >
                  <span>
                    {aspect.aspect
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
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

export function CommentList() {
  const statisticData = useSelector<RootState, StatisticData | null>(
    (state: RootState) =>
      state.statisticItemCourse.statisticItemCourse as unknown as StatisticData
  );

  const [filter, setFilter] = useState({
    aspect: "all",
    emotion: "all",
  });

  if (!statisticData) {
    return <div>Loading...</div>;
  }

  const filteredComments = statisticData.comments.filter((comment: Comment) => {
    const aspectMatch =
      filter.aspect === "all" ||
      comment.aspects.some((a) => a.aspect === filter.aspect);
    const emotionMatch =
      filter.emotion === "all" ||
      comment.aspects.some((a) => a.emotion === filter.emotion);
    return aspectMatch && emotionMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-2xl font-semibold">
          Comments ({filteredComments.length})
        </h2>
        <div className="flex gap-2">
          <Select
            value={filter.aspect}
            onValueChange={(value) => setFilter({ ...filter, aspect: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by aspect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Aspects</SelectItem>
              <SelectItem value="instructor_quality">
                Instructor Quality
              </SelectItem>
              <SelectItem value="content_quality">Content Quality</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
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
              <SelectItem value="all">All Emotions</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredComments.map((comment: Comment) => (
            <CommentCard key={comment.lecture_comment_id} comment={comment} />
          ))}
        </TabsContent>

        <TabsContent value="positive" className="space-y-4">
          {filteredComments
            .filter((c: Comment) =>
              c.aspects.some((a) => a.emotion === "positive")
            )
            .map((comment: Comment) => (
              <CommentCard key={comment.lecture_comment_id} comment={comment} />
            ))}
        </TabsContent>

        <TabsContent value="neutral" className="space-y-4">
          {filteredComments
            .filter((c: Comment) =>
              c.aspects.some((a) => a.emotion === "neutral")
            )
            .map((comment: Comment) => (
              <CommentCard key={comment.lecture_comment_id} comment={comment} />
            ))}
        </TabsContent>

        <TabsContent value="negative" className="space-y-4">
          {filteredComments
            .filter((c: Comment) =>
              c.aspects.some((a) => a.emotion === "negative")
            )
            .map((comment: Comment) => (
              <CommentCard key={comment.lecture_comment_id} comment={comment} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
