import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, MessageSquare, Star, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Giả sử bạn có component Input
import { CourseItem, Section } from "@/types/courseType";
import { Lecture } from "@/types/registerLectureFormType";
import { APIPostComment, APIGetComment } from "@/utils/comment";
import InputWithSendButton from "../inputComponent/inputComment";
import AlertSuccess from "../alert/AlertSuccess";
import AlertError from "../alert/AlertError";
import { CommentEachItemCourse } from "@/types/commentType";
import CommentListUser from "./commentListUser";
import Popup from "./popup"; // Import your Popup component
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import SelectFilter from "../selectComponent/selectFilter";
import { formatPrice } from "../formatPrice";

interface CourseTabsProps {
  description: string;
  sections?: Section[];
  lecture?: Lecture;
  rating?: number;
  enrolledStudents?: number;
  price: number;
  priceFinal?: number;
  currentCourseItem?: CourseItem;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  description,
  sections,
  lecture,
  rating,
  enrolledStudents,
  price,
  priceFinal,
  currentCourseItem,
}) => {
  const [activeTab, setActiveTab] = useState("description");
  const [newReview, setNewReview] = useState("");
  const [newPost, setNewPost] = useState(""); // Nội dung bài đăng mới
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: "1", // Thêm id để dễ quản lý khi dùng API sau này
      user: "Nguyễn Văn A",
      content: "Bài học rất dễ hiểu!",
      date: "2025-03-01",
    },
  ]);
  const [replies, setReplies] = useState<{ [postId: string]: string[] }>({}); // Quản lý trả lời
  const [newReply, setNewReply] = useState(""); // Nội dung trả lời mới
  const [comments, setComments] = useState<CommentEachItemCourse[]>([]);

  const [filterOption, setFilterOption] = useState("all"); // New state for filter option

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [descriptionAlert, setDescriptionAlert] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  // Lấy danh sách bài đăng khi component mount (dùng API - hiện tại comment lại)
  /*
  useEffect(() => {
    fetch("https://your-api-endpoint/community-posts")
      .then((response) => response.json())
      .then((data) => setCommunityPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);
  */

  // Xử lý đăng bài mới
  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const newCommunityPost = {
        id: Date.now().toString(), // Tạo id tạm thời khi dùng state
        user: "Người dùng hiện tại", // Thay bằng thông tin thực tế khi có hệ thống xác thực
        content: newPost,
        date: new Date().toISOString().split("T")[0],
      };
      setCommunityPosts([newCommunityPost, ...communityPosts]);
      setNewPost("");

      // Phần gọi API (comment lại)
      /*
      fetch("https://your-api-endpoint/community-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommunityPost),
      })
        .then((response) => response.json())
        .then((savedPost) => {
          setCommunityPosts([savedPost, ...communityPosts]);
          setNewPost("");
        })
        .catch((error) => console.error("Error posting:", error));
      */
    }
  };

  // Xử lý trả lời bài đăng
  const handleReplySubmit = (postId: string) => {
    if (newReply.trim()) {
      setReplies((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newReply],
      }));
      setNewReply("");

      // Phần gọi API (comment lại)
      /*
      fetch(`https://your-api-endpoint/community-posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newReply }),
      })
        .then((response) => response.json())
        .then((newReplyData) => {
          setReplies((prev) => ({
            ...prev,
            [postId]: [...(prev[postId] || []), newReplyData.content],
          }));
          setNewReply("");
        })
        .catch((error) => console.error("Error replying:", error));
      */
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handlePostComment = async () => {
    try {
      if (currentCourseItem?.id) {
        const response = await APIPostComment(currentCourseItem.id, {
          content: newReview,
        });
        if (response?.status === 201) {
          setNewReview("");
          handleGetComment();
          setShowAlertSuccess(true);
          setDescriptionAlert("Bài đăng đã được đăng thành công");
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setShowAlertError(true);
      setDescriptionAlert("Lỗi khi đăng bài");
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  const handleGetComment = async () => {
    if (currentCourseItem?.id) {
      const response = await APIGetComment(currentCourseItem.id, {
        is_solved: filterOption === "mostRelevant" ? false : undefined,
      });
      if (response?.status === 200) {
        setComments(response?.data);
      }
    }
  };

  useEffect(() => {
    handleGetComment();
  }, [currentCourseItem?.id]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full font-sans"
    >
      <TabsList className="grid w-full grid-cols-4 bg-majorelleBlue20 dark:bg-majorelleBlue/10">
        <TabsTrigger
          value="description"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Mô tả
        </TabsTrigger>
        <TabsTrigger
          value="resources"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Tài liệu
        </TabsTrigger>
        <TabsTrigger
          value="community"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Cộng đồng
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
        >
          Đánh giá
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
          Giảng viên:{" "}
          <span className="text-majorelleBlue">
            {lecture?.user.first_name + " " + lecture?.user.last_name}
          </span>
        </p>
        <div className="flex gap-4 mt-2 items-center">
          {rating && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-Sunglow fill-Sunglow" />
              <span className="text-darkSilver dark:text-lightSilver">
                {rating}
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
                <span className="text-beautyGreen font-semibold">
                  {formatPrice(priceFinal)}
                </span>
              </>
            ) : (
              <span className="text-beautyGreen font-semibold">
                {formatPrice(price)}
              </span>
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

          {currentCourseItem?.resources &&
            currentCourseItem?.resources.length === 0 && (
              <p className="text-darkSilver dark:text-lightSilver">
                Không có tài liệu
              </p>
            )}
        </ul>
      </TabsContent>

      <TabsContent
        value="community"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Cộng đồng
        </h3>
        {/* Form đăng bài mới */}
        <div className="mb-4 flex gap-2">
          <Input
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Viết bài đăng của bạn..."
            className="flex-1"
          />
          <Button
            onClick={handlePostSubmit}
            className="flex items-center gap-1"
          >
            <Send size={16} /> Đăng
          </Button>
        </div>
        {/* Danh sách bài đăng */}
        <ul className="space-y-4">
          {communityPosts.map((post) => (
            <li key={post.id} className="flex items-start gap-2">
              <MessageSquare size={20} className="text-majorelleBlue" />
              <div className="flex-1">
                <p className="font-medium text-richBlack dark:text-AntiFlashWhite">
                  {post.user}
                </p>
                <p className="text-darkSilver dark:text-lightSilver">
                  {post.content}
                </p>
                <p className="text-sm text-darkSilver/70 dark:text-lightSilver/70">
                  {new Date(post.date).toLocaleDateString("vi-VN")}
                </p>
                {/* Form trả lời */}
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Viết câu trả lời..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleReplySubmit(post.id)}
                    className="flex items-center gap-1"
                  >
                    <Send size={16} /> Gửi
                  </Button>
                </div>
                {/* Hiển thị danh sách trả lời */}
                {replies[post.id]?.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {replies[post.id].map((reply, index) => (
                      <li
                        key={index}
                        className="text-darkSilver dark:text-lightSilver ml-6"
                      >
                        - {reply}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent
        value="reviews"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md flex flex-col gap-4"
      >
        <div className="flex gap-2 mb-4 items-center">
          <InputWithSendButton
            labelText=""
            placeholder="Viết đánh giá của bạn..."
            onChange={(e) => setNewReview(e.target.value)}
            value={newReview}
            onSubmit={handlePostComment}
          />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
            Đánh giá
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
          placeholder={filterOption === "all" ? "Tất cả" : "Phù hợp nhất"}
          // label="Bộ lọc"
          data={[
            { id: "all", value: "Tất cả" },
            { id: "mostRelevant", value: "Phù hợp nhất" },
          ]}
          onChange={(value) => setFilterOption(value)}
        />
        <div className="flex flex-col gap-4">
          {comments.slice(0, 5).map((comment, index) => (
            <CommentListUser key={index} comments={comment} />
          ))}
        </div>
      </TabsContent>

      {/* Popup for displaying all comments */}
      {showPopup && (
        <Popup onClose={() => setShowPopup(false)}>
          <h3 className="text-lg font-semibold">Tất cả đánh giá</h3>
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
