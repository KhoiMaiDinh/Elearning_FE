'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Mail,
  Phone,
  Calendar,
  Edit,
  BookOpen,
  Star,
  ChevronRight,
  Users,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AnimateWrapper from '@/components/animations/animateWrapper';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/constants/store';
import { setUser } from '@/constants/userSlice';
import { UserType } from '@/types/userType';
import { Preference } from '@/types/preferenceType';
import { CourseForm } from '@/types/courseType';

import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import axios from 'axios';
import { APIGetCurrentUser, APIUpdateCurrentUser } from '@/utils/user';
import { APIGetPreference } from '@/utils/preference';
import { APIGetEnrolledCourse } from '@/utils/course';
import { APIGetPresignedUrl } from '@/utils/storage';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

// Yup schema for form validation
const schema = yup.object().shape({
  first_name: yup.string().required('Họ không được bỏ trống').max(60, 'Tối đa 60 ký tự'),
  last_name: yup.string().required('Tên không được bỏ trống').max(60, 'Tối đa 60 ký tự'),
  email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  username: yup.string().required('Biệt danh không được bỏ trống').max(60, 'Tối đa 60 ký tự'),
  profile_image: yup.object().shape({
    key: yup.string().optional(),
    bucket: yup.string().optional(),
    status: yup.string().optional(),
    rejected_reason: yup.string().optional(),
    id: yup.string().optional(),
  }),
});

const StudentProfile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [studentData, setStudentData] = useState<UserType | null>(null);
  const [favoriteCategories, setFavoriteCategories] = useState<Preference['categories']>([]);
  const [learningProgress, setLearningProgress] = useState<CourseForm[]>([]);
  const [disable, setDisable] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserType>({
    resolver: yupResolver(schema as yup.ObjectSchema<UserType>),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      profile_image: {
        key: '',
        bucket: '',
        status: '',
        rejected_reason: '',
        id: '',
      },
    },
  });

  const profileImage = watch('profile_image');

  // Fetch student data
  const handleGetStudentData = async () => {
    const response = await APIGetCurrentUser();
    if (response?.status === 200) {
      setStudentData(response?.data);
      dispatch(setUser(response?.data));
    }
  };

  // Fetch favorite categories
  const handleGetFavoriteCategories = async () => {
    const response = await APIGetPreference();
    if (response?.status === 200) {
      setFavoriteCategories(response?.data?.categories || []);
    }
  };

  // Fetch learning progress
  const handleGetLearningProgress = async () => {
    const response = await APIGetEnrolledCourse();
    if (response?.status === 200) {
      setLearningProgress(response?.data || []);
    }
  };

  // Upload file to MinIO
  const uploadToMinIO = async (file: File): Promise<{ key: string; id: string }> => {
    try {
      const presignedData = await APIGetPresignedUrl({
        filename: file.name,
        entity: 'user',
        entity_property: 'profile_image',
      });
      const { postURL, formData } = presignedData?.data?.result ?? {};
      const id = presignedData?.data?.id;

      const uploadFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        uploadFormData.append(key, value as string);
      });

      uploadFormData.append('file', file);
      uploadFormData.append('id', id);

      const response = await axios.post(postURL, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 204 || response.status === 200) {
        const key = uploadFormData.get('key');
        if (!key) throw new Error('Missing key in form data');
        return { key: key.toString(), id };
      } else {
        throw new Error('Upload thất bại');
      }
    } catch (error) {
      console.error('Error uploading to MinIO:', error);
      throw error;
    }
  };

  // Update user profile
  const handleUpdateProfileUser = async (data: any) => {
    try {
      const response = await APIUpdateCurrentUser(data);
      if (response?.status === 200) {
        setAlertDescription('Cập nhật thành công');
        setShowAlertSuccess(true);
        setDisable(true);
        setSelectedFile(null);
        handleGetStudentData();
        dispatch(setUser(response?.data));
        setTimeout(() => setShowAlertSuccess(false), 3000);
      } else {
        setAlertDescription('Cập nhật thất bại');
        setShowAlertError(true);
        setTimeout(() => setShowAlertError(false), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setAlertDescription('Cập nhật thất bại');
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  // Form submission
  const onSubmit = async (data: FieldValues) => {
    if (!disable && studentData?.id) {
      let profileImageKey = data.profile_image.key;

      if (profileImageKey.includes('?')) {
        profileImageKey = profileImageKey.split('?')[0];
      }

      const dataSubmit = {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        profile_image: {
          ...data.profile_image,
          key: profileImageKey,
          id: data.profile_image.id,
        },
      };

      await handleUpdateProfileUser(dataSubmit);
    }
  };

  // Sync user data and image preview
  useEffect(() => {
    if (studentData) {
      setValue('first_name', studentData.first_name);
      setValue('last_name', studentData.last_name);
      setValue('email', studentData.email);
      setValue('username', studentData.username);
      setValue('profile_image', {
        key: studentData.profile_image?.key || '',
        bucket: studentData.profile_image?.bucket || '',
        status: studentData.profile_image?.status || '',
        rejected_reason: studentData.profile_image?.rejected_reason || '',
        id: studentData.profile_image?.id || '',
      });

      if (
        studentData.profile_image?.key &&
        (studentData.profile_image.key.startsWith('data:image') ||
          studentData.profile_image.key.startsWith('blob:') ||
          studentData.profile_image.key.includes('?'))
      ) {
        setImagePreview(
          studentData.profile_image.key.startsWith('data:image') ||
            studentData.profile_image.key.startsWith('blob:')
            ? studentData.profile_image.key
            : `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${studentData.profile_image.key}`
        );
      }
    }
  }, [studentData, setValue]);

  // Sync image preview when profile_image changes
  useEffect(() => {
    if (profileImage?.key) {
      if (
        profileImage.key.startsWith('data:image') ||
        profileImage.key.startsWith('blob:') ||
        profileImage.key.includes('?')
      ) {
        setImagePreview(
          profileImage.key.startsWith('data:image') || profileImage.key.startsWith('blob:')
            ? profileImage.key
            : `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${profileImage.key}`
        );
      }
    }
  }, [profileImage.key, setValue]);

  // Fetch data on mount or username change
  useEffect(() => {
    handleGetStudentData();
    handleGetFavoriteCategories();
    handleGetLearningProgress();
  }, [username]);

  // Format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options); // Change 'vi-VN' to your desired locale
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <AnimateWrapper delay={0.2} direction="left">
              <Card className="border-0 shadow-lg sticky top-8">
                <CardContent className="p-6 text-center">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Avatar */}
                    <div className="relative mb-4  items-center justify-center">
                      <Controller
                        name="profile_image"
                        control={control}
                        render={() => (
                          <div className="flex flex-col gap-2 items-center">
                            <Avatar className="w-24 h-24 mx-auto">
                              <AvatarImage
                                src={imagePreview || '/placeholder.svg'}
                                alt={`${studentData?.first_name} ${studentData?.last_name}`}
                                className="object-cover"
                              />
                            </Avatar>
                            {!disable && (
                              <div className="flex flex-col  gap-2 items-center">
                                <InputRegisterLecture
                                  labelText="Ảnh đại diện"
                                  type="file"
                                  accept="image/*"
                                  error={errors.profile_image?.message}
                                  disabled={disable}
                                  onChange={async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                      try {
                                        setSelectedFile(file);
                                        const previewUrl = URL.createObjectURL(file);
                                        setImagePreview(previewUrl);

                                        const { key, id } = await uploadToMinIO(file);
                                        setValue('profile_image', {
                                          key,
                                          id,
                                          bucket: undefined,
                                          status: undefined,
                                          rejected_reason: undefined,
                                        });
                                      } catch (error) {
                                        setAlertDescription('Upload ảnh thất bại');
                                        setShowAlertError(true);
                                        setTimeout(() => setShowAlertError(false), 3000);
                                      }
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* Name and Username */}
                    <div className="mb-6 w-full text-left">
                      {disable ? (
                        <>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {studentData?.first_name} {studentData?.last_name}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            @{studentData?.username}
                          </p>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <Controller
                            name="first_name"
                            control={control}
                            render={({ field }) => (
                              <InputRegisterLecture
                                {...field}
                                labelText="Họ"
                                error={errors.first_name?.message}
                                disabled={disable}
                              />
                            )}
                          />
                          <Controller
                            name="last_name"
                            control={control}
                            render={({ field }) => (
                              <InputRegisterLecture
                                {...field}
                                labelText="Tên"
                                error={errors.last_name?.message}
                                disabled={disable}
                              />
                            )}
                          />
                          <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                              <InputRegisterLecture
                                {...field}
                                labelText="Biệt danh"
                                error={errors.username?.message}
                                disabled={disable}
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-6 text-left">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 mr-3" />
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => <span>{field.value || studentData?.email}</span>}
                        />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-3" />
                        <span>Ngày tham gia</span>
                      </div>
                      <div className="text-sm text-gray-500 ml-7">
                        {studentData?.createdAt ? formatDate(studentData.createdAt) : '15/03/2023'}
                      </div>
                    </div>

                    {/* Edit/Save/Cancel Buttons */}
                    <div className="w-full flex items-center justify-center">
                      {disable ? (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => setDisable(false)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa thông tin
                        </Button>
                      ) : (
                        <div className="flex flex-row w-full gap-3 items-center justify-center">
                          <Button
                            className="w-32 bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => {
                              setDisable(true);
                              setSelectedFile(null);
                              setImagePreview(studentData?.profile_image?.key || '');
                            }}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            className="w-32 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Lưu
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </AnimateWrapper>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Favorite Categories */}
            <AnimateWrapper delay={0.3} direction="right">
              <Card className="border-0 shadow-lg bg-blue-50 dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Danh mục yêu thích
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Chuyên môn và sở thích học tập của bạn
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {favoriteCategories?.map((category, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          {category.translations.find(
                            (translation) => translation.language === 'vi'
                          )?.name || 'Category Name'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimateWrapper>
            {/* Learning Progress */}
            <AnimateWrapper delay={0.4} direction="up">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Tiến độ học tập
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Theo dõi quá trình học tập của bạn
                  </p>

                  <div className="space-y-6">
                    {learningProgress.map((course) => (
                      <div key={course.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {course.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {course.sections?.length} bài học
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {course.course_progress?.progress}%
                            </span>
                          </div>
                        </div>

                        <Progress value={course.course_progress?.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimateWrapper>

            <AnimateWrapper delay={0.6} direction="up">
              {/* Enrolled Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Khóa học đã đăng ký</CardTitle>
                  <CardDescription>Các khóa học bạn đang tham gia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningProgress.map((course) => (
                      <div key={course.id} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={
                              // `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${course.thumbnail?.key} ` ||
                              '/images/logo.png'
                            }
                            alt={`Course ${course.title}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{course.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                              Giảng viên: {course.instructor?.user.first_name}{' '}
                              {course.instructor?.user.last_name}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            course.course_progress?.progress &&
                            course.course_progress.progress === 0
                              ? 'default'
                              : course.course_progress?.progress &&
                                  course.course_progress.progress === 100
                                ? 'secondary'
                                : 'outline'
                          }
                          className={`w-fit ${
                            course.course_progress?.progress &&
                            course.course_progress.progress === 0
                              ? 'bg-darkSilver'
                              : course.course_progress?.progress &&
                                  course.course_progress.progress === 100
                                ? 'bg-blueberry'
                                : 'bg-vividMalachite'
                          }`}
                        >
                          {course.course_progress?.progress && course.course_progress.progress === 0
                            ? 'Chưa bắt đầu'
                            : course.course_progress?.progress &&
                                course.course_progress.progress === 100
                              ? 'Đã hoàn thành'
                              : 'Đang học'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimateWrapper>

            <AnimateWrapper delay={0.6} direction="up">
              {/* Enrolled Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Khóa học đã yêu thích</CardTitle>
                  <CardDescription>Các khóa học bạn đang yêu thích</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningProgress.map((course) => (
                      <div key={course.id} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={
                              // `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${course.thumbnail?.key} ` ||
                              '/images/logo.png'
                            }
                            alt={`Course ${course.title}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{course.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                              Giảng viên: {course.instructor?.user.first_name}{' '}
                              {course.instructor?.user.last_name}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            course.course_progress?.progress &&
                            course.course_progress.progress === 0
                              ? 'default'
                              : course.course_progress?.progress &&
                                  course.course_progress.progress === 100
                                ? 'secondary'
                                : 'outline'
                          }
                          className={`w-fit ${
                            course.course_progress?.progress &&
                            course.course_progress.progress === 0
                              ? 'bg-darkSilver'
                              : course.course_progress?.progress &&
                                  course.course_progress.progress === 100
                                ? 'bg-blueberry'
                                : 'bg-vividMalachite'
                          }`}
                        >
                          {course.course_progress?.progress && course.course_progress.progress === 0
                            ? 'Chưa bắt đầu'
                            : course.course_progress?.progress &&
                                course.course_progress.progress === 100
                              ? 'Đã hoàn thành'
                              : 'Đang học'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimateWrapper>
          </div>
        </div>

        {/* Alerts */}
        {showAlertSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
            {alertDescription}
          </div>
        )}
        {showAlertError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
            {alertDescription}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
