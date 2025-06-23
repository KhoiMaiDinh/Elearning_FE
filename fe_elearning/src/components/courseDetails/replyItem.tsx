import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

import { CommunityThreadReply } from '@/types/communityThreadType';
import { APILikeThreadReply, APIUnLikeThreadReply } from '@/utils/communityThread';
import { Award, Heart } from 'lucide-react';
import ReportButton from './report';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserType } from '@/types/userType';
interface ReplyItemProps {
  reply: CommunityThreadReply;
  courseOwner: UserType;
}

const ReplyItem = ({ reply, courseOwner }: ReplyItemProps) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
  };

  const [isLiked, setIsLiked] = useState(reply?.has_upvoted);
  const [voteCount, setVoteCount] = useState(reply?.vote_count);

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
    setIsLiked(reply?.has_upvoted);
    setVoteCount(reply?.vote_count);
  }, [reply]);

  return (
    <div
      className="mt-6 space-y-4 border-t dark:border-slate-700 border-slate-200 pt-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h4 className="dark:text-white text-slate-800 font-medium">Câu trả lời:</h4>
      <div className="flex space-x-3 p-4 dark:bg-slate-700/20 bg-blue-50/50 rounded-lg border border-blue-100 dark:border-transparent">
        {/* Answer Voting */}
        <div className="flex flex-col items-center space-y-1 min-w-[40px]">
          <div className="p-2 -m-2">
            {' '}
            <Button
              variant="ghost"
              className={`w-full flex flex-row items-center ${
                isLiked
                  ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500'
                  : 'dark:text-slate-400 text-slate-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isLiked) {
                  handleUnLike(reply.id);
                } else {
                  handleLike(reply.id);
                }
              }}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span
                className="text-sm font-medium transition-[width] duration-200"
                style={{ width: voteCount > 99 ? '2.5rem' : voteCount > 9 ? '2rem' : '1rem' }}
              >
                {voteCount ?? 0}
              </span>
            </Button>
          </div>
        </div>

        {/* Answer Content */}
        <div className="flex-1 space-y-2">
          <p
            className="dark:text-slate-300 text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: reply.content }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${reply.author?.profile_image?.key || 'default-key.jpg'}`}
                />
                <AvatarFallback className="dark:bg-cyan-600 dark:text-white text-xs">
                  {reply.author?.first_name?.charAt(0) || '?'}
                  {reply.author?.last_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <p className="dark:text-slate-400 text-slate-600 text-sm">
                  {reply.author?.first_name + ' ' + reply.author?.last_name}
                </p>
                {reply.author?.id === courseOwner.id && (
                  <Badge
                    className=" text-white text-xs px-2 py-0.5 border-0"
                    style={{
                      background: 'linear-gradient(to bottom right, #ca8a04, #ea580c)',
                    }}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Giảng viên
                  </Badge>
                )}
              </div>
              <p className="dark:text-slate-500 text-slate-500 text-xs">
                {formatDate(reply.createdAt || '')}
              </p>
            </div>
            <ReportButton course_id={reply.id} type="REPLY" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
