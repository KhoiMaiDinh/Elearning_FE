import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

import { CommunityThreadReply } from "@/types/communityThreadType";
import {
  APILikeThreadReply,
  APIUnLikeThreadReply,
} from "@/utils/communityThread";
import { Heart } from "lucide-react";
import ReportButton from "./report";
interface ReplyListProps {
  replies: CommunityThreadReply;
}

const ReplyList = ({ replies }: ReplyListProps) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("vi-VN");
  };

  const [isLiked, setIsLiked] = useState(replies?.has_upvoted);
  const [voteCount, setVoteCount] = useState(replies?.vote_count);

  const handleLike = async (reply_id: string) => {
    const response = await APILikeThreadReply(reply_id);
    if (response?.status === 204) {
      setIsLiked(true);
      setVoteCount(voteCount + 1);
    }
  };

  const handleUnLike = async (reply_id: string) => {
    const response = await APIUnLikeThreadReply(reply_id);
    if (response?.status === 204) {
      setIsLiked(false);
      setVoteCount(voteCount - 1);
    }
  };
  useEffect(() => {
    setIsLiked(replies?.has_upvoted);
    setVoteCount(replies?.vote_count);
  }, [replies]);

  return (
    <Card className="font-sans">
      <CardHeader className="pb-2 justify-between items-center flex flex-row">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={
                  process.env.NEXT_PUBLIC_BASE_URL_IMAGE +
                  (replies.author?.profile_image?.key || "default-key.jpg")
                }
                alt={
                  replies.author?.first_name + " " + replies.author?.last_name
                }
              />
              <AvatarFallback>
                {replies.author?.first_name?.charAt(0) || "?"}
                {replies.author?.last_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium font-sans text-sm">
                {replies.author?.first_name + " " + replies.author?.last_name}
              </div>
              <div className="text-xs text-muted-foreground font-sans">
                {formatDate(replies.createdAt || "")}
              </div>
            </div>
          </div>
        </div>

        <ReportButton course_id={replies.id} type="REPLY" />
      </CardHeader>

      <CardContent className="font-sans text-sm">
        <p>{replies.content}</p>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() =>
              isLiked ? handleUnLike(replies.id) : handleLike(replies.id)
            }
            className={`text-xs px-2 py-1 rounded hover:cursor-pointer transition-all ${
              isLiked ? " cursor-not-allowed" : " text-white "
            }`}
          >
            {isLiked ? (
              <Heart className="w-4 h-4 text-redPigment" fill="#ff2929" />
            ) : (
              <Heart className="w-4 h-4 text-redPigment" />
            )}
          </button>
          <span
            className={`text-xs ${isLiked ? "text-redPigment" : "text-gray"}`}
          >
            {voteCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReplyList;
