import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, MessageSquare, Star, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Giả sử bạn có component Input
import { Section } from "@/types/courseType";
import { Lecture } from "@/types/registerLectureFormType";

interface CourseTabsProps {
  description: string;
  sections?: Section[];
  lecture?: Lecture;
  rating?: number;
  enrolledStudents?: number;
  price: number;
  priceFinal?: number;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  description,
  sections,
  lecture,
  rating,
  enrolledStudents,
  price,
  priceFinal,
}) => {
  const [activeTab, setActiveTab] = useState("description");
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

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
      </TabsContent>

      <TabsContent
        value="resources"
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Tài liệu
        </h3>
        <ul className="space-y-2">
          {sections &&
            sections.flatMap(
              (section) =>
                section.items &&
                section.items.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-darkSilver  dark:text-lightSilver">
                      {item.title}
                    </span>
                    {item.resources && item.resources.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-majorelleBlue hover:text-majorelleBlue70"
                        onClick={() =>
                          handleDownload(
                            `${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${item.resources[0].resource_file.key}`,
                            item.resources[0].name
                          )
                        }
                      >
                        <Download size={16} />
                      </Button>
                    )}
                  </li>
                ))
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
        className="p-4 bg-white dark:bg-richBlack rounded-b-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-2">
          Đánh giá
        </h3>
        <ul className="space-y-4">
          {[
            {
              user: "Lê Thị C",
              rating: 4.8,
              comment: "Khóa học rất chi tiết!",
              date: "2025-02-28",
            },
          ].map((review, index) => (
            <li key={index} className="flex items-start gap-2">
              <Star size={20} className="text-Sunglow fill-Sunglow" />
              <div>
                <p className="font-medium text-richBlack dark:text-AntiFlashWhite">
                  {review.user} - {review.rating}/5
                </p>
                <p className="text-darkSilver dark:text-lightSilver">
                  {review.comment}
                </p>
                <p className="text-sm text-darkSilver/70 dark:text-lightSilver/70">
                  {new Date(review.date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabs;
