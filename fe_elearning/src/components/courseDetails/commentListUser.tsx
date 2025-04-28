import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

import { CommentEachItemCourse } from "@/types/commentType";

interface CommentListProps {
  comments: CommentEachItemCourse;
}

const CommentListUser = ({ comments }: CommentListProps) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("vi-VN");
  };
  return (
    <Card className="font-sans">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={
                  process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                    (comments.user?.profile_image?.key || "default-key.jpg") ||
                  "/placeholder.svg"
                }
                alt={comments.user?.first_name + " " + comments.user?.last_name}
              />
              <AvatarFallback>
                {comments.user?.first_name?.charAt(0) || "?"}
                {comments.user?.last_name?.charAt(0) || "?"}
              </AvatarFallback>{" "}
            </Avatar>
            <div>
              <div className="font-medium font-sans text-sm">
                {comments.user?.first_name + " " + comments.user?.last_name}
              </div>
              <div className="text-xs text-muted-foreground font-sans ">
                {formatDate(comments.createdAt || "")}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="font-sans text-sm">
        <p>{comments.content}</p>
      </CardContent>
    </Card>
  );
};

export default CommentListUser;
