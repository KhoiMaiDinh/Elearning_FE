"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  // Dữ liệu mẫu (sẽ thay bằng API sau)
  const [users, setUsers] = useState([
    { id: 1, username: "user1", email: "user1@example.com", role: "student" },
    {
      id: 2,
      username: "lecturer1",
      email: "lecturer1@example.com",
      role: "lecturer",
    },
  ]);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Khóa học React",
      lecturer: "lecturer1",
      status: "pending",
    },
    {
      id: 2,
      title: "Khóa học Node.js",
      lecturer: "lecturer1",
      status: "published",
    },
  ]);
  const [lecturerRequests, setLecturerRequests] = useState([
    { id: 1, username: "user2", email: "user2@example.com", status: "pending" },
  ]);

  // Fetch dữ liệu từ API (comment lại vì chưa có)
  /*
  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await fetch("https://your-api-endpoint/users");
      const coursesRes = await fetch("https://your-api-endpoint/courses");
      const requestsRes = await fetch("https://your-api-endpoint/lecturer-requests");
      setUsers(await usersRes.json());
      setCourses(await coursesRes.json());
      setLecturerRequests(await requestsRes.json());
    };
    fetchData();
  }, []);
  */

  // Xử lý phê duyệt/xuất bản khóa học
  const handleCourseApproval = (courseId: any, newStatus: any) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, status: newStatus } : course
      )
    );
    // Gọi API (comment lại)
    /*
    fetch(`https://your-api-endpoint/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    */
  };

  // Xử lý cấp quyền giảng viên
  const handleLecturerApproval = (requestId: any, approved: any) => {
    const request = lecturerRequests.find((req) => req.id === requestId);
    if (approved) {
      setUsers((prev) =>
        prev.map((user) =>
          user.username === request?.username
            ? { ...user, role: "lecturer" }
            : user
        )
      );
    }
    setLecturerRequests((prev) => prev.filter((req) => req.id !== requestId));
    // Gọi API (comment lại)
    /*
    fetch(`https://your-api-endpoint/lecturer-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: approved ? "approved" : "rejected" }),
    });
    */
  };

  return (
    <div className="min-h-screen bg-AntiFlashWhite dark:bg-eerieBlack p-6">
      <h1 className="text-2xl font-bold text-cosmicCobalt dark:text-AntiFlashWhite mb-6">
        Bảng điều khiển quản trị
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-majorelleBlue20 dark:bg-majorelleBlue/10">
          <TabsTrigger
            value="users"
            className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
          >
            <Users className="mr-2 h-4 w-4" /> Người dùng
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
          >
            <BookOpen className="mr-2 h-4 w-4" /> Khóa học
          </TabsTrigger>
          <TabsTrigger
            value="lecturerRequests"
            className="text-majorelleBlue data-[state=active]:bg-majorelleBlue data-[state=active]:text-white"
          >
            <UserCheck className="mr-2 h-4 w-4" /> Yêu cầu giảng viên
          </TabsTrigger>
        </TabsList>

        {/* Tab Người dùng */}
        <TabsContent value="users" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => alert("Chỉnh sửa user")}
                    >
                      Chỉnh sửa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Tab Khóa học */}
        <TabsContent value="courses" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.lecturer}</TableCell>
                  <TableCell>
                    {course.status === "pending" ? "Chờ duyệt" : "Đã xuất bản"}
                  </TableCell>
                  <TableCell>
                    {course.status === "pending" ? (
                      <>
                        <Button
                          variant="ghost"
                          className="text-green-500"
                          onClick={() =>
                            handleCourseApproval(course.id, "published")
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Duyệt
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-500"
                          onClick={() =>
                            handleCourseApproval(course.id, "rejected")
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Từ chối
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleCourseApproval(course.id, "pending")
                        }
                      >
                        Thu hồi
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Tab Yêu cầu giảng viên */}
        <TabsContent value="lecturerRequests" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lecturerRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.username}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>Chờ duyệt</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="text-green-500"
                      onClick={() => handleLecturerApproval(request.id, true)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Chấp nhận
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => handleLecturerApproval(request.id, false)}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Từ chối
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
