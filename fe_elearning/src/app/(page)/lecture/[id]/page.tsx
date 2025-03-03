"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Star, BookOpen } from "lucide-react";

// Định nghĩa interface cho dữ liệu giáo viên

const teacherData = {
  name: "Nguyễn Văn A",
  postCount: 25,
  rating: 4.8,
  email: "nguyenvana@example.com",
  description:
    "Tôi là một giáo viên với 10 năm kinh nghiệm trong lĩnh vực giảng dạy tiếng Anh và kỹ năng mềm. Tôi luôn tận tâm giúp học viên đạt được mục tiêu học tập của mình.",
  expertise: ["Tiếng Anh", "Kỹ năng mềm", "Giao tiếp", "IELTS"],
  avatarUrl: "https://github.com/shadcn.png",
};

const TeacherProfile = () => {
  return (
    <div className="container bg-white dark:bg-chineseBlack mx-auto py-8">
      <Card className="max-w-4xl mx-auto bg-white dark:bg-chineseBlack shadow-md shadow-majorelleBlue">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={teacherData.avatarUrl} alt={teacherData.name} />
          </Avatar>
          <div className="space-y-2 text-center md:text-left">
            <CardTitle className="text-3xl font-bold">
              {teacherData.name}
            </CardTitle>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Mail className="w-4 h-4" />
              <span className="text-muted-foreground">{teacherData.email}</span>
            </div>
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{teacherData.postCount} bài giảng</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{teacherData.rating.toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
            <p className="text-muted-foreground">{teacherData.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Chuyên môn</h3>
            <div className="flex flex-wrap gap-2">
              {/* {expertise.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfile;
