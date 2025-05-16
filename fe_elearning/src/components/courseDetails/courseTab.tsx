import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Star, Users, Send, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Giả sử bạn có component Input
import { CourseItem, Section } from '@/types/courseType';
import { Lecture } from '@/types/registerLectureFormType';
import { APIPostComment, APIGetComment } from '@/utils/comment';
import InputWithSendButton from '../inputComponent/inputComment';
import AlertSuccess from '../alert/AlertSuccess';
import AlertError from '../alert/AlertError';
import { LectureComment } from '@/types/commentType';
import CommentListUser from './commentListUser';
import Popup from './popup'; // Import your Popup component

import SelectFilter from '../selectComponent/selectFilter';
import { formatPrice } from '../formatPrice';
import {
  APIGetThread,
  APIPostThread,
  APIPostThreadReply,
  APIGetThreadReply,
} from '@/utils/communityThread';
import { CommunityThread, CommunityThreadReply } from '@/types/communityThreadType';
import InputRegisterLecture from '../inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '../inputComponent/textAreaRegisterLecture';
import ReplyList from './replyList';
import ReportButton from './report';
interface CourseTabsProps {
  description: string;
  sections?: Section[];
  lecture?: Lecture;
  rating?: number;
  enrolledStudents?: number;
  price: number;
  priceFinal?: number;
  currentCourseItem?: CourseItem;
  isOwner?: boolean;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  description,
  // sections,
  lecture,
  rating,
  enrolledStudents,
  price,
  priceFinal,
  currentCourseItem,
  isOwner,
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  const [communityPosts, setCommunityPosts] = useState<CommunityThread[]>([]);
  const [replies, setReplies] = useState<CommunityThreadReply[]>([]); // Quản lý trả lời
  const [newReply, setNewReply] = useState(''); // Nội dung trả lời mới
  const [comments, setComments] = useState<LectureComment[]>([]);

  const [filterOption, setFilterOption] = useState('all'); // New state for filter option

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [descriptionAlert, setDescriptionAlert] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const handlePostThread = async () => {
    const newPostData = {
      title: newTitle,
      content: newContent,
      lecture_id: currentCourseItem?.id, // hoặc lecture đang xem
    };
    try {
      const response = await APIPostThread(newPostData);
      if (response?.status === 201) {
        setNewTitle('');
        setNewContent('');
        handleGetThread();
        setShowAlertSuccess(true);
        setDescriptionAlert('Bài viết đã được đăng thành công');
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 3000);
      } else {
        setShowAlertError(true);
        setDescriptionAlert('Lỗi khi đăng bài');
        setTimeout(() => {
          setShowAlertError(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setShowAlertError(true);
      setDescriptionAlert('Lỗi khi đăng bài');
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
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

  const handleReplySubmit = async (threadId: string) => {
    const newReplyData = {
      content: newReply,
    };
    try {
      const response = await APIPostThreadReply(threadId, newReplyData);

      if (response?.status === 200) {
        setNewReply('');
        handleGetThread();
        setShowAlertSuccess(true);
        setDescriptionAlert('Trả lời đã được đăng thành công');
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 3000);
      } else {
        setShowAlertError(true);
        setDescriptionAlert('Lỗi khi trả lời');
        setTimeout(() => {
          setShowAlertError(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setShowAlertError(true);
      setDescriptionAlert('Lỗi khi trả lời');
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
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
          setShowAlertSuccess(true);
          setDescriptionAlert('Bài đăng đã được đăng thành công');
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setShowAlertError(true);
      setDescriptionAlert('Lỗi khi đăng bài');
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  const handleGetComment = async () => {
    if (currentCourseItem?.id) {
      const response = await APIGetComment(currentCourseItem.id, {
        is_solved: filterOption === 'mostRelevant' ? false : undefined,
      });
      if (response?.status === 200) {
        setComments(response?.data);
      }
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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full font-sans">
      <TabsList className="grid w-full grid-cols-4 bg-majorelleBlue20 dark:bg-majorelleBlue/10">
        <TabsTrigger
          value="description"
          className="text-majorelleBlue data-[state=active]:bg-gradient-144 data-[state=active]:text-white"
        >
          Mô tả
        </TabsTrigger>
        <TabsTrigger
          value="resources"
          className="text-majorelleBlue data-[state=active]:bg-gradient-144 data-[state=active]:text-white"
        >
          Tài liệu
        </TabsTrigger>
        <TabsTrigger
          value="community"
          className="text-majorelleBlue data-[state=active]:bg-gradient-144 data-[state=active]:text-white"
        >
          Cộng đồng
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          // className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
          className="text-majorelleBlue items-center justify-center data-[state=active]:bg-gradient-144 data-[state=active]:text-white"
        >
          Cảm nhận
          <img src={'/icons/open-gift.gif'} alt="gift" className="w-4 h-4 ml-2 mb-1 " />{' '}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="description"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Mô tả khóa học
        </h3>
        <p
          className="text-darkSilver dark:text-lightSilver ql-content"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <p className="mt-2 text-darkSilver dark:text-lightSilver">
          Giảng viên:{' '}
          <span className="text-majorelleBlue">
            {lecture?.user.first_name + ' ' + lecture?.user.last_name}
          </span>
        </p>
        <div className="flex gap-4 mt-2 items-center">
          {rating && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-Sunglow fill-Sunglow" />
              <span className="text-darkSilver dark:text-lightSilver">
                {rating ? (Math.round(rating * 10) / 10).toFixed(1) : 'N/A'}
              </span>
            </div>
          )}
          {enrolledStudents && (
            <div className="flex items-center gap-1">
              <Users size={16} className="text-majorelleBlue" />
              <span className="text-darkSilver dark:text-lightSilver">
                {enrolledStudents > 1000
                  ? `${(enrolledStudents / 1000).toFixed(1)}k+`
                  : `${enrolledStudents}+`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {priceFinal && priceFinal !== price ? (
              <>
                <span className="text-darkSilver dark:text-lightSilver line-through">
                  {formatPrice(price)}
                </span>
                <span className="text-beautyGreen font-semibold">{formatPrice(priceFinal)}</span>
              </>
            ) : (
              <span className="text-beautyGreen font-semibold">{formatPrice(price)}</span>
            )}
          </div>
        </div>

        {currentCourseItem && (
          <div>
            <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
              {currentCourseItem.title}
            </h3>
            <p
              className="text-darkSilver dark:text-lightSilver ql-content"
              dangerouslySetInnerHTML={{
                __html: currentCourseItem.description,
              }}
            />
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="resources"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Tài liệu
        </h3>
        <ul className="space-y-2">
          {currentCourseItem &&
            currentCourseItem.resources &&
            currentCourseItem.resources.length > 0 &&
            currentCourseItem.resources.map((item, index) => (
              <li key={index}>
                <span>{item.name}</span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-majorelleBlue hover:text-majorelleBlue70"
                  onClick={() =>
                    handleDownload(
                      `${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${item.resource_file.key}`,
                      item.name
                    )
                  }
                >
                  <Download size={16} />
                </Button>
              </li>
            ))}

          {currentCourseItem?.resources && currentCourseItem?.resources.length === 0 && (
            <p className="text-darkSilver dark:text-lightSilver">Không có tài liệu</p>
          )}
        </ul>
      </TabsContent>

      <TabsContent
        value="community"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        {/* Form đăng bài mới */}
        {!isOwner && (
          <div className="bg-antiFlashWhite dark:bg-eerieBlack p-4 rounded-lg shadow mb-6">
            <h4 className="text-lg font-semibold mb-2 text-richBlack dark:text-lightSilver">
              Đăng bài mới
            </h4>
            <div className="space-y-3">
              <InputRegisterLecture
                value={newTitle}
                onChange={(value) => setNewTitle(value.target.value)}
                placeholder="Tiêu đề bài viết (bắt buộc)"
              />
              <TextAreaRegisterLecture
                value={newContent}
                onChange={(value) => setNewContent(value)}
                placeholder="Nội dung chi tiết..."
                className="min-h-[100px]"
                disabled={!newTitle.trim()}
              />
              <div className="text-right">
                <Button
                  onClick={handlePostThread}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  type="button"
                  size="sm"
                  className="flex items-center text-white justify-center gap-1 px-3 py-2 bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125"
                >
                  <Send size={16} />
                  Gửi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách bài đăng */}
        <div className="space-y-6">
          {communityPosts.map((post) => {
            const isExpanded = expandedThreadId === post.id;

            return (
              <div
                key={post.id}
                className="border border-gray-200 dark:border-darkSilver/30 rounded-lg p-4 shadow-sm bg-white dark:bg-eerieBlack"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-semibold text-majorelleBlue dark:text-white">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      className="text-sm text-cosmicCobalt dark:text-lightSilver underline"
                      onClick={() => setExpandedThreadId(isExpanded ? null : post.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6" />
                      ) : (
                        <ChevronRight className="w-6 h-6" />
                      )}
                    </Button>

                    <ReportButton course_id={post.id} type="THREAD" />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2">
                    {/* Nội dung bài viết */}
                    <p
                      className="text-richBlack dark:text-lightSilver mb-2 ql-content"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    {/* <p className="text-sm text-darkSilver/70 dark:text-lightSilver/50 italic">
              Đăng ngày {new Date(post.date).toLocaleDateString("vi-VN")}
            </p> */}

                    {/* Phần trả lời */}
                    <div className="mt-4 border-t pt-3">
                      <h5 className="text-sm font-semibold text-cosmicCobalt dark:text-lightSilver mb-2">
                        Trả lời
                      </h5>

                      {replies.map((reply, index) => (
                        <ReplyList key={index} replies={reply} />
                      ))}

                      {!isOwner && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Thêm câu trả lời..."
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleReplySubmit(post.id)}
                            disabled={!newReply.trim()}
                            type="button"
                            size="sm"
                            className="flex items-center text-white justify-center gap-1 px-3 py-2 bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125"
                          >
                            <Send size={16} />
                            Gửi
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent
        value="reviews"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md flex flex-col gap-4"
      >
        {!isOwner && (
          <div className="flex gap-2 mb-4 items-center">
            <InputWithSendButton
              labelText=""
              placeholder="Viết cảm nhận của bạn..."
              onChange={(e) => setNewReview(e.target.value)}
              value={newReview}
              onSubmit={handlePostComment}
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
            Cảm nhận
          </h3>
          {comments.length > 5 && (
            <text
              onClick={() => setShowPopup(true)}
              className="mt-2 text-darkSilver dark:text-lightSilver cursor-pointer text-xs"
            >
              Xem tất cả
            </text>
          )}
        </div>

        <SelectFilter
          placeholder={filterOption === 'all' ? 'Tất cả' : 'Mới nhất'}
          // label="Bộ lọc"
          data={[
            { id: 'all', value: 'Tất cả' },
            { id: 'mostRelevant', value: 'Mới nhất' },
          ]}
          onChange={(value) => setFilterOption(value)}
        />
        <div className="flex flex-col gap-4">
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
          <h3 className="text-lg font-semibold">Tất cả cảm nhận</h3>
          <div className="flex flex-col gap-4">
            {comments.map((comment, index) => (
              <CommentListUser key={index} comments={comment} />
            ))}
          </div>
        </Popup>
      )}

      {showAlertSuccess && <AlertSuccess description={descriptionAlert} />}
      {showAlertError && <AlertError description={descriptionAlert} />}
    </Tabs>
  );
};

export default CourseTabs;
