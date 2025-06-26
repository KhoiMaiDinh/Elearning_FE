import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Send,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  FileText,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseForm, CourseItem, SectionType } from '@/types/courseType';
import { APIPostComment, APIGetComment, APIGetCommentById } from '@/utils/comment';
import InputWithSendButton from '../inputComponent/inputComment';
import { LectureComment } from '@/types/commentType';
import CommentListUser from './commentListUser';
import Popup from './popup';
import ToastNotify from '../ToastNotify/toastNotify';
import { toast } from 'react-toastify';
import { styleSuccess } from '../ToastNotify/toastNotifyStyle';
import { styleError } from '../ToastNotify/toastNotifyStyle';
import SelectFilter from '../selectComponent/selectFilter';
import {
  APIGetThread,
  APIPostThread,
  APIPostThreadReply,
  APIGetThreadReply,
} from '@/utils/communityThread';
import { CommunityThread, CommunityThreadReply } from '@/types/communityThreadType';
import InputRegisterLecture from '../inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '../inputComponent/textAreaRegisterLecture';
import ReportButton from './report';
import ShowMoreText from './showMoreText';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { AxiosError } from 'axios';
import { stripHtml } from '@/helpers';
import ReplyItem from './replyItem';
import { UserType } from '@/types/userType';

interface CourseTabsProps {
  courseData: CourseForm;
  currentCourseItem?: CourseItem;
  isOwner?: boolean;
  currentCommentItem?: string;
  currentSection?: SectionType;
  owner?: UserType;
  currentThreadId?: string | null;
  defaultTab?: string | null;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  currentCourseItem,
  isOwner,
  currentCommentItem,
  currentSection,
  owner,
  currentThreadId,
  defaultTab,
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  const [communityPosts, setCommunityPosts] = useState<CommunityThread[]>([]);
  const [replies, setReplies] = useState<CommunityThreadReply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [comments, setComments] = useState<LectureComment[]>([]);

  const [filterOption, setFilterOption] = useState<'all' | 'latestVersion'>('latestVersion');

  const [showPopup, setShowPopup] = useState(false);
  const [showCommentId, setShowCommentId] = useState<boolean>(false);
  const [comment, setComment] = useState<LectureComment | null>(null);
  const [showAnswerForm, setShowAnswerForm] = useState<string | null>(null);
  const [showThreadPopup, setShowThreadPopup] = useState<boolean>(false);
  const [selectedThread, setSelectedThread] = useState<CommunityThread | null>(null);
  const [replySuccess, setReplySuccess] = useState<boolean>(false);
  const [showCommentPopup, setShowCommentPopup] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<LectureComment | null>(null);

  const handlePostThread = async () => {
    const newPostData = {
      title: newTitle,
      content: newContent,
      lecture_id: currentCourseItem?.id, // hoặc lecture đang xem
    };
    try {
      const response = await APIPostThread(newPostData);
      if (response?.status === 200) {
        setNewTitle('');
        setNewContent('');
        handleGetThread();
        toast.success(<ToastNotify status={1} message="Bài viết đã được đăng thành công" />, {
          style: styleSuccess,
        });
      } else {
        toast.error(<ToastNotify status={-1} message="Lỗi khi đăng bài" />, {
          style: styleError,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(<ToastNotify status={-1} message="Lỗi khi đăng bài" />, {
        style: styleError,
      });
    }
  };

  const handleGetThread = async () => {
    if (currentCourseItem?.id) {
      try {
        const response = await APIGetThread(currentCourseItem.id);
        if (response?.status === 200) {
          setCommunityPosts(response?.data);
        }
      } catch (error) {
        console.error('Error getting thread:', error);
      }
    }
  };

  console.log({ communityPosts });

  const handleReplySubmit = async (threadId: string) => {
    const newReplyData = {
      content: newReply,
    };
    try {
      const response = await APIPostThreadReply(threadId, newReplyData);

      // Check if response exists and has data
      if (response && response.data) {
        setNewReply('');
        // Refresh thread and reply data
        await handleGetThread();
        if (expandedThreadId) {
          await handleGetReply(expandedThreadId);
        }
        toast.success(<ToastNotify status={1} message="Trả lời đã được đăng thành công" />, {
          style: styleSuccess,
        });
        setShowAnswerForm(null);
        setReplySuccess(true);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setReplySuccess(false);
        }, 3000);

        // Don't close popup, just refresh data to show new reply
      } else {
        toast.error(<ToastNotify status={-1} message="Lỗi khi trả lời" />, {
          style: styleError,
        });
      }
    } catch (error) {
      console.log(error);
      if (
        error instanceof AxiosError &&
        error.response?.data?.message === 'enrolled_course.error.not_found'
      ) {
        toast.error(<ToastNotify status={-1} message="Bạn không đăng ký khóa học" />, {
          style: styleError,
        });
      } else {
        toast.error(<ToastNotify status={-1} message="Lỗi khi trả lời" />, {
          style: styleError,
        });
      }
    }
  };

  const handleGetReply = async (threadId: string) => {
    const response = await APIGetThreadReply(threadId);
    if (response?.status === 200) {
      setReplies(response?.data);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handlePostComment = async () => {
    try {
      if (currentCourseItem?.id) {
        const response = await APIPostComment(currentCourseItem.id, {
          content: newReview,
        });
        if (response?.status === 201) {
          setNewReview('');
          handleGetComment();
          toast.success(<ToastNotify status={1} message="Feedback đã được gửi thành công" />, {
            style: styleSuccess,
          });
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(<ToastNotify status={-1} message="Lỗi khi đăng bài" />, {
        style: styleError,
      });
    }
  };
  console.log(currentCourseItem);

  const handleGetComment = async () => {
    if (currentCourseItem?.id) {
      const response = await APIGetComment(currentCourseItem.id, {
        is_solved: filterOption === 'latestVersion' ? false : undefined,
        order: 'DESC',
      });
      if (response?.status === 200) {
        setComments(response?.data);
      }
    }
  };

  const handleGetCommentById = async (id: string) => {
    const response = await APIGetCommentById(id);
    if (response) {
      setComment(response);
      setShowCommentId(true);
    }
  };

  const handleGetCommentForPopup = async (commentId: string) => {
    try {
      // Tìm trong danh sách comments hiện tại trước
      const existingComment = comments.find((comment) => comment.lecture_comment_id === commentId);
      if (existingComment) {
        setSelectedComment(existingComment);
        setShowCommentPopup(true);
        return;
      }

      // Nếu không tìm thấy, gọi API để lấy detail
      const response = await APIGetCommentById(commentId);
      if (response) {
        setSelectedComment(response);
        setShowCommentPopup(true);
      }
    } catch (error) {
      console.error('Error fetching comment:', error);
    }
  };

  const handleGetThreadById = async (threadId: string) => {
    try {
      // Lấy thread details từ danh sách hiện tại trước
      const existingThread = communityPosts.find((post) => post.id === threadId);
      if (existingThread) {
        setSelectedThread(existingThread);
        setExpandedThreadId(threadId);
        await handleGetReply(threadId);
        setShowThreadPopup(true);
        return;
      }

      // Nếu không tìm thấy, có thể cần API để lấy thread detail
      // Tạm thời sử dụng cách này
      if (currentCourseItem?.id) {
        await handleGetThread();
      }
    } catch (error) {
      console.error('Error fetching thread:', error);
    }
  };

  useEffect(() => {
    handleGetComment();
    handleGetThread();
  }, [currentCourseItem?.id]);

  useEffect(() => {
    if (expandedThreadId) {
      handleGetReply(expandedThreadId);
    }
  }, [expandedThreadId]);

  useEffect(() => {
    if (currentCommentItem && currentCommentItem.length > 0) {
      setActiveTab('reviews');
      // Don't show the old comment popup, use the new one instead
      // handleGetCommentById(currentCommentItem);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    } else {
      setActiveTab('description');
    }
  }, [currentCommentItem, defaultTab]);

  useEffect(() => {
    if (currentThreadId && communityPosts.length > 0) {
      handleGetThreadById(currentThreadId);
    }
  }, [currentThreadId, communityPosts]);

  useEffect(() => {
    if (currentCommentItem && comments.length > 0) {
      handleGetCommentForPopup(currentCommentItem);
    }
  }, [currentCommentItem, comments]);

  const tabContentClassName =
    'className=" bg-AntiFlashWhite rounded-b-lg shadow-md dark:bg-slate-800/30 rounded-lg p-6 border border-blue-200 dark:border-slate-700"';

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full font-sans">
        <TabsList className="grid w-full grid-cols-4 bg-majorelleBlue20 rounded-[2px] dark:bg-slate-800/50 border dark:border-slate-700">
          <TabsTrigger
            value="description"
            className="text-majorelleBlue data-[state=active]:bg-gradient-144 data-[state=active]:text-white rounded-[2px]"
          >
            Mô tả
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="text-majorelleBlue data-[state=active]:bg-gradient-144 data-[state=active]:text-white rounded-[2px]"
            disabled={!currentCourseItem?.resources || currentCourseItem.resources.length === 0}
          >
            Tài liệu
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="text-majorelleBlue data-[state=active]:bg-gradient-144 data-[state=active]:text-white rounded-[2px]"
          >
            Q & A
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="text-majorelleBlue items-center justify-center data-[state=active]:bg-gradient-144 data-[state=active]:text-white rounded-[2px] group relative"
          >
            Feedback
            <img src={'/icons/open-gift.gif'} alt="gift" className="w-4 h-4 ml-2 mb-1" />
            <div className="absolute invisible group-hover:visible bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 p-2 rounded shadow-lg -top-10 left-[60%] transform -translate-x-1/2 whitespace-nowrap border border-slate-200 dark:border-slate-700 z-30">
              Gửi feedback để nhận quà từ chúng tôi
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className={tabContentClassName}>
          <Badge className="bg-gradient-144 text-white border-none mb-6">Mô tả Bài giảng</Badge>
          <h3 className="text-black dark:text-white text-xl font-bold mb-4">
            Giới thiệu bài {currentCourseItem?.title ?? 'học'}
          </h3>
          <ShowMoreText text={currentCourseItem?.description ?? ''} />
          {currentSection?.description && (
            <>
              <Separator className={'my-3'} />
              <h3 className="text-white text-xl font-bold mb-4">
                Mô tả chương {currentSection.title ?? ''}
              </h3>
              <ShowMoreText text={currentSection.description} />
            </>
          )}
        </TabsContent>

        <TabsContent value="resources" className={tabContentClassName}>
          <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-6">
            Tài liệu
          </h3>
          <ul className="space-y-2">
            {currentCourseItem &&
              currentCourseItem.resources &&
              currentCourseItem.resources.length > 0 &&
              currentCourseItem.resources.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 dark:bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-majorelleBlue20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-cosmicCobalt" />
                    </div>
                    <div>
                      <p className="text-black dark:text-white font-medium">{item.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-300 hover:text-white"
                      onClick={() =>
                        window.open(
                          `${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${item.resource_file.key}`,
                          '_blank'
                        )
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-300 hover:text-white"
                      onClick={() =>
                        handleDownload(
                          `${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${item.resource_file.key}`,
                          item.name
                        )
                      }
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </ul>
        </TabsContent>

        <TabsContent value="community" className={tabContentClassName}>
          <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-3">
            Thắc mắc và giải đáp
          </h3>
          {/* Form đăng bài mới */}
          {!isOwner && (
            <div className="bg-antiFlashWhite dark:bg-eerieBlack p-4 rounded-lg shadow mb-6">
              <h4 className="text-lg font-semibold text-richBlack dark:text-lightSilver mb-6">
                Đặt câu hỏi
              </h4>
              <div className="space-y-2 flex flex-col">
                <InputRegisterLecture
                  value={newTitle}
                  onChange={(value) => setNewTitle(value.target.value)}
                  placeholder="Tiêu đề câu hỏi (bắt buộc)"
                  inputClassName="w-full px-3 py-2 dark:bg-slate-700/50 bg-white/80 border dark:border-slate-600 border-blue-200 rounded-lg dark:text-white text-slate-800 dark:placeholder:text-slate-400 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                />
                <TextAreaRegisterLecture
                  value={newContent}
                  onChange={(value) => setNewContent(value)}
                  placeholder="Nội dung chi tiết..."
                  className="min-h-[100px] dark:text-white"
                  disabled={!newTitle.trim()}
                />
                <div className="text-right self-end">
                  <Button
                    onClick={handlePostThread}
                    disabled={!newTitle.trim() || !stripHtml(newContent.trim())}
                    type="button"
                    size="lg"
                    className="flex items-center text-white justify-center gap-1 px-3 py-2 bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Đăng câu hỏi
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách bài đăng */}
          <div className="space-y-4">
            {!Array.isArray(communityPosts) || communityPosts.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600 mb-3" />
                <p className="text-slate-600 dark:text-slate-400">Chưa có câu hỏi nào được đăng.</p>
                {!isOwner && (
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Hãy là người đầu tiên đặt câu hỏi!
                  </p>
                )}
              </div>
            ) : (
              communityPosts.map((post) => {
                const isExpanded = expandedThreadId === post.id;

                return (
                  <Card
                    key={post.id}
                    className=" dark:bg-slate-800/30 bg-white/90 dark:border-slate-700 border-blue-200 shadow-lg backdrop-blur-sm"
                  >
                    <CardContent
                      className="p-6"
                      onClick={() => setExpandedThreadId(isExpanded ? null : post.id)}
                    >
                      <div className="flex space-x-4">
                        {/* Question Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex ">
                            <div className="flex w-full justify-between">
                              <h3 className="text-xl font-semibold dark:text-white text-slate-800 mb-2">
                                {post.title}
                              </h3>
                              <div className="text-sm text-cosmicCobalt dark:text-lightSilver underline">
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-300 transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Question Meta */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={
                                    `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${post.author?.profile_image.key}` ||
                                    '/placeholder.svg'
                                  }
                                />
                                <AvatarFallback className="bg-purple-600 text-white text-sm">
                                  {post.author.first_name[0] + post.author.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="dark:text-slate-300 text-slate-600 text-sm">
                                  {post.author.first_name + ' ' + post.author.last_name}
                                </p>
                                <p className="dark:text-slate-500 text-slate-500 text-xs">
                                  {new Date(post.createdAt).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 dark:text-slate-400 text-slate-500">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">
                                  {post.replies?.length ?? 0} câu trả lời
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="dark:border-slate-600 border-blue-200 dark:text-slate-300 text-slate-600 dark:hover:bg-slate-700 hover:bg-blue-50 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAnswerForm(showAnswerForm === post.id ? null : post.id);
                                }}
                              >
                                Trả lời
                              </Button>
                              <div onClick={(e) => e.stopPropagation()}>
                                <ReportButton course_id={post.id} type="THREAD" />
                              </div>
                            </div>
                          </div>

                          {/* Answer Form */}
                          {showAnswerForm === post.id && (
                            <div
                              className="mt-4 p-4 dark:bg-slate-700/20 bg-blue-50/50 rounded-lg border dark:border-slate-600 border-blue-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="space-y-3">
                                <TextAreaRegisterLecture
                                  value={newReply}
                                  onChange={(value) => setNewReply(value)}
                                  placeholder="Nội dung câu trả lời..."
                                  className="min-h-[100px]"
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className=" dark:border-slate-600 border-blue-200 dark:text-slate-300 text-slate-600 hover:bg-blue-50 hover:text-indigo-600 hover:border-indigo-300"
                                    onClick={() => setShowAnswerForm(null)}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                                    onClick={() => handleReplySubmit(post.id)}
                                    disabled={!stripHtml(newReply.trim())}
                                  >
                                    Gửi câu trả lời
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Answers */}
                          {isExpanded && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <p
                                className=" dark:text-slate-300 text-slate-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                              />
                              {replies.length > 0 &&
                                replies.map((reply) => (
                                  <ReplyItem reply={reply} courseOwner={owner!} />
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className={`${tabContentClassName}`}>
          {!isOwner && (
            <div className="flex gap-2  items-center mb-3">
              <InputWithSendButton
                labelText=""
                placeholder="Viết feedback của bạn..."
                onChange={(e) => setNewReview(e.target.value)}
                value={newReview}
                onSubmit={handlePostComment}
              />
            </div>
          )}

          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite ">
              Feedback gần đây
            </h3>
            {comments.length > 5 && (
              <text
                onClick={() => setShowPopup(true)}
                className=" text-darkSilver dark:text-lightSilver cursor-pointer text-xs"
              >
                Xem tất cả ({comments.length})
              </text>
            )}
          </div>

          {isOwner && (
            <SelectFilter
              placeholder={filterOption === 'all' ? 'Tất cả' : 'Chỉ phiên bản mới'}
              // label="Bộ lọc"
              data={[
                { id: 'all', value: 'Tất cả' },
                { id: 'latestVersion', value: 'Chỉ phiên bản mới' },
              ]}
              onChange={(value: string) => setFilterOption(value as 'all' | 'latestVersion')}
              className="w-56"
            />
          )}
          <div className="flex flex-col gap-2 mt-3">
            {comments.length > 0 ? (
              comments
                .slice(0, 5)
                .map((comment, index) => <CommentListUser key={index} comments={comment} />)
            ) : (
              <p className="text-darkSilver dark:text-lightSilver ">Chưa có dữ liệu</p>
            )}
          </div>
        </TabsContent>

        {/* Popup for displaying all comments */}
        {showPopup && (
          <Popup onClose={() => setShowPopup(false)}>
            <h3 className="text-lg font-semibold">Tất cả feedback</h3>
            <div className="flex flex-col gap-4">
              {Array.isArray(comments) &&
                comments.length > 0 &&
                comments.map((comment, index) => (
                  <CommentListUser key={index} comments={comment} />
                ))}
            </div>
          </Popup>
        )}

        {/* Comment Detail Popup */}
        {showCommentPopup && selectedComment && (
          <Popup
            onClose={() => {
              setShowCommentPopup(false);
              setSelectedComment(null);
            }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-row justify-between h-full items-start">
                <h3 className="text-xl font-semibold mb-4">Chi tiết Feedback</h3>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="rounded-full w-8 h-8 items-center justify-center flex"
                      onClick={() => {
                        setShowCommentPopup(false);
                        setSelectedComment(null);
                      }}
                    >
                      <X className="w-4 h-4 text-gray-950 dark:text-AntiFlashWhite/80" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <Card className="mb-6 dark:bg-slate-800/30 bg-white/90 dark:border-slate-700 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${selectedComment.user?.profile_image?.key}` ||
                          '/placeholder.svg'
                        }
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {selectedComment.user?.first_name?.[0] || ''}
                        {selectedComment.user?.last_name?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg dark:text-white text-slate-800">
                            Feedback từ {selectedComment.user?.first_name}{' '}
                            {selectedComment.user?.last_name}
                          </h4>
                          <p className="text-sm dark:text-slate-400 text-slate-600">
                            Bài học: {selectedComment.lecture?.title} •{' '}
                            {new Date(selectedComment.createdAt).toLocaleString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="dark:text-slate-300 text-slate-700 leading-relaxed mb-4">
                        <p>"{selectedComment.content}"</p>
                      </div>

                      {/* Aspects */}
                      {selectedComment.aspects && selectedComment.aspects.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium dark:text-white text-slate-800">
                            Đánh giá theo khía cạnh:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedComment.aspects.map((aspect) => {
                              const emotionColor =
                                aspect.emotion === 'positive'
                                  ? 'bg-greenCrayola/10 text-greenCrayola border-greenCrayola/20'
                                  : aspect.emotion === 'neutral'
                                    ? 'bg-blueberry/10 text-blueberry border-blueberry/20'
                                    : aspect.emotion === 'negative'
                                      ? 'bg-carminePink/10 text-carminePink border-carminePink/20'
                                      : 'bg-amberColor/10 text-amberColor border-amberColor/20';
                              return (
                                <Badge
                                  key={aspect.comment_aspect_id}
                                  variant="outline"
                                  className={`${emotionColor}`}
                                >
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
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
            </div>
          </Popup>
        )}

        {/* Thread Detail Popup */}
        {showThreadPopup && selectedThread && (
          <Popup
            onClose={() => {
              setShowThreadPopup(false);
              setSelectedThread(null);
              setExpandedThreadId(null);
              setNewReply('');
              setReplySuccess(false);
            }}
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Chi tiết thảo luận</h3>

              {/* Thread Question */}
              <Card className="mb-6 dark:bg-slate-800/30 bg-white/90 dark:border-slate-700 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${selectedThread.author?.profile_image.key}` ||
                          '/placeholder.svg'
                        }
                      />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {selectedThread.author.first_name[0] + selectedThread.author.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg dark:text-white text-slate-800">
                            {selectedThread.title}
                          </h4>
                          <p className="text-sm dark:text-slate-400 text-slate-600">
                            {selectedThread.author.first_name +
                              ' ' +
                              selectedThread.author.last_name}{' '}
                            •{' '}
                            {new Date(selectedThread.createdAt).toLocaleString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div
                        className="dark:text-slate-300 text-slate-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: selectedThread.content }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Replies Section */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-lg dark:text-white text-slate-800">
                  Câu trả lời ({replies.length})
                </h4>

                {replies.length > 0 &&
                  replies.map((reply) => (
                    <ReplyItem key={reply.id} reply={reply} courseOwner={owner!} />
                  ))}
              </div>

              {/* Reply Form */}
              <Card className="dark:bg-slate-800/30 bg-white/90 dark:border-slate-700 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold dark:text-white text-slate-800">
                      Viết câu trả lời
                    </h4>
                    {replySuccess && (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm">Đã gửi thành công!</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <InputRegisterLecture
                      value={newReply}
                      onChange={(value) => setNewReply(value.target.value)}
                      placeholder="Nội dung câu trả lời..."
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-500">
                        {replySuccess ? (
                          <span className="text-green-600 dark:text-green-400">
                            Scroll lên để xem câu trả lời mới ↑
                          </span>
                        ) : (
                          'Bạn có thể tiếp tục thảo luận sau khi gửi câu trả lời'
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowThreadPopup(false);
                            setSelectedThread(null);
                            setExpandedThreadId(null);
                            setNewReply('');
                          }}
                        >
                          Đóng
                        </Button>
                        <Button
                          className="bg-custom-gradient-button-violet text-white hover:brightness-110"
                          onClick={() => handleReplySubmit(selectedThread.id)}
                          disabled={!stripHtml(newReply.trim())}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Gửi câu trả lời
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Popup>
        )}
      </Tabs>
    </>
  );
};

export default CourseTabs;
