"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
  ThumbsUp,
  ThumbsDown,
  Meh,
  BookOpen,
  Code,
  Video,
  Clock,
  Users,
  MessageSquare,
} from "lucide-react";

// Define the aspects and emotions
export const aspects = [
  { id: 1, name: "Content", icon: BookOpen },
  { id: 2, name: "Code Examples", icon: Code },
  { id: 3, name: "Video Quality", icon: Video },
  { id: 4, name: "Pacing", icon: Clock },
  { id: 5, name: "Instructor", icon: Users },
  { id: 6, name: "Exercises", icon: MessageSquare },
];

export const emotions = [
  {
    id: 1,
    name: "Positive",
    icon: ThumbsUp,
    color: "bg-green-100 text-green-800",
  },
  { id: 2, name: "Neutral", icon: Meh, color: "bg-blue-100 text-blue-800" },
  {
    id: 3,
    name: "Negative",
    icon: ThumbsDown,
    color: "bg-red-100 text-red-800",
  },
];

// Sample comments data - now with multiple aspects per comment
export const commentsData = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    content:
      "The content is very well structured and easy to follow. I especially liked the way complex concepts were broken down.",
    aspects: [1, 5], // Content and Instructor
    emotion: 1,
    timestamp: "2 days ago",
    likes: 12,
  },
  {
    id: 2,
    user: {
      name: "Sam Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    content:
      "Code examples were helpful but some of them didn't work as expected. Would be great to have more detailed explanations.",
    aspects: [2, 6], // Code Examples and Exercises
    emotion: 2,
    timestamp: "1 week ago",
    likes: 5,
  },
  {
    id: 3,
    user: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TK",
    },
    content:
      "The video quality was poor in some lectures, making it difficult to see the code on the screen.",
    aspects: [3], // Video Quality
    emotion: 3,
    timestamp: "3 days ago",
    likes: 8,
  },
  {
    id: 4,
    user: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JL",
    },
    content:
      "The pacing was perfect for me. Not too fast, not too slow. The instructor was very engaging.",
    aspects: [4, 5], // Pacing and Instructor
    emotion: 1,
    timestamp: "5 days ago",
    likes: 15,
  },
  {
    id: 5,
    user: {
      name: "Casey Morgan",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CM",
    },
    content:
      "The instructor's explanations were clear, but sometimes they moved too quickly through important topics.",
    aspects: [5, 4], // Instructor and Pacing
    emotion: 2,
    timestamp: "1 day ago",
    likes: 7,
  },
  {
    id: 6,
    user: {
      name: "Riley Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RS",
    },
    content:
      "Exercises were too difficult compared to the lecture material. More scaffolded practice would be helpful. The content itself was good though.",
    aspects: [6, 1], // Exercises and Content
    emotion: 3,
    timestamp: "4 days ago",
    likes: 9,
  },
];

export function CommentList() {
  const [filter, setFilter] = useState({
    aspect: "all",
    emotion: "all",
  });

  const filteredComments = commentsData.filter((comment) => {
    const aspectMatch =
      filter.aspect === "all" ||
      comment.aspects.includes(Number.parseInt(filter.aspect));
    const emotionMatch =
      filter.emotion === "all" ||
      comment.emotion === Number.parseInt(filter.emotion);
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
              {aspects.map((aspect) => (
                <SelectItem key={aspect.id} value={aspect.id.toString()}>
                  {aspect.name}
                </SelectItem>
              ))}
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
              {emotions.map((emotion) => (
                <SelectItem key={emotion.id} value={emotion.id.toString()}>
                  {emotion.name}
                </SelectItem>
              ))}
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
          {filteredComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </TabsContent>

        <TabsContent value="positive" className="space-y-4">
          {filteredComments
            .filter((c) => c.emotion === 1)
            .map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
        </TabsContent>

        <TabsContent value="neutral" className="space-y-4">
          {filteredComments
            .filter((c) => c.emotion === 2)
            .map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
        </TabsContent>

        <TabsContent value="negative" className="space-y-4">
          {filteredComments
            .filter((c) => c.emotion === 3)
            .map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CommentCard({ comment }: { comment: any }) {
  const commentAspects = comment.aspects
    .map((aspectId: number) => aspects.find((a) => a.id === aspectId))
    .filter(Boolean);

  const emotion = emotions.find((e) => e.id === comment.emotion);
  const EmotionIcon = emotion?.icon;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={comment.user.avatar || "/placeholder.svg"}
                alt={comment.user.name}
              />
              <AvatarFallback>{comment.user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{comment.user.name}</div>
              <div className="text-xs text-muted-foreground">
                {comment.timestamp}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {commentAspects.map((aspect: any) => {
              const AspectIcon = aspect?.icon;
              return (
                <Badge
                  key={aspect.id}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {AspectIcon && <AspectIcon className="h-3 w-3" />}
                  <span>{aspect?.name}</span>
                </Badge>
              );
            })}
            <Badge className={`flex items-center gap-1 ${emotion?.color}`}>
              {EmotionIcon && <EmotionIcon className="h-3 w-3" />}
              <span>{emotion?.name}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{comment.content}</p>
      </CardContent>
      <CardFooter className="pt-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{comment.likes}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
