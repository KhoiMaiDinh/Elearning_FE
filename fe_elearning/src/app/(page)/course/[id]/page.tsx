'use client';
import AnimateWrapper from '@/components/animations/animateWrapper';
import InfoBlockCourse from '@/components/course/infoBlockCourse';
import InfoCourse from '@/components/course/infoCourse';
import { RootState } from '@/constants/store';
import { CourseForm } from '@/types/courseType';
import { APIGetCourseById, APIGetEnrolledCourse, APIGetFullCourse } from '@/utils/course';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FacebookMessengerShareButton } from 'react-share';
import { Copy, Edit, Eye, Facebook, Loader2, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { APIGetRecommendationByCourseId } from '@/utils/recommendation';

const Page = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // Ensure `id` is a string
  const [dataCourse, setDataCourse] = useState<CourseForm>();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (userInfo.id) {
      if (userInfo.id === dataCourse?.instructor?.user?.id) {
        setIsOwner(true);
      }
    }
  }, [userInfo, dataCourse]);

  const handleGetDetailCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetCourseById(id || '', {
      with_sections: true,
      with_thumbnail: true,
    });
    if (response && response.data) {
      setDataCourse(response.data);
    }
    setLoading(false);
  }, [id]);

  const handleGetEnrolledCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetEnrolledCourse();
    if (response && response.data) {
      setIsRegistered(response.data.some((item: any) => item.id === id));
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    // handleGetCourseById();
    handleGetDetailCourse();
    handleGetEnrolledCourse();
  }, [handleGetDetailCourse, handleGetEnrolledCourse]);

  const handleGetFullCourse = useCallback(async () => {
    setLoading(true);
    const response = await APIGetFullCourse(id || '');
    if (response && response.data) {
      setDataCourse(response.data);
    }
    // setLoading(false); // Don’t forget to stop loading
  }, [id]);

  useEffect(() => {
    if (isRegistered) {
      handleGetFullCourse();
    }
  }, [isRegistered, handleGetFullCourse]);

  const courseUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(courseUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const tweetText = `Khám phá khóa học "${dataCourse?.title || ''}" tại Nova Learn!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(courseUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const whatsappText = `Nova Learn - ${dataCourse?.title || ''} - Khám phá khóa học tại ${courseUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (dataCourse && userInfo) {
      const totalDuration =
        dataCourse.sections?.reduce(
          (total, section) =>
            total + section.items.reduce((sum, item) => sum + (item.duration_in_seconds || 0), 0),
          0
        ) || 0;
      const totalLessons =
        dataCourse.sections?.reduce((total, section) => total + section.items.length, 0) || 0;
      setTotalDuration(totalDuration);
      setTotalLessons(totalLessons);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [dataCourse, userInfo]);
  return !loading ? (
    <div className="container mx-auto py-8 bg-AntiFlashWhite dark:bg-eerieBlack min-h-screen text-richBlack dark:text-AntiFlashWhite">
      <AnimateWrapper delay={0.2} direction="up" amount={0.01}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {dataCourse && (
              <InfoCourse
                course={dataCourse}
                lecture={
                  dataCourse.instructor?.user?.first_name +
                  ' ' +
                  dataCourse.instructor?.user?.last_name
                }
                totalDuration={totalDuration}
                totalLessons={totalLessons}
              />
            )}
          </div>
          {isOwner && (
            <div className="lg:w-1/4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4 mb-0 pb-2">
                  <Button
                    className="w-full bg-custom-gradient-button-violet flex justify-between"
                    onClick={() => {
                      router.push(`/profile/lecture/course/${id}`);
                    }}
                  >
                    Chỉnh sửa khóa học
                    <Edit className="w-4 h-4 mr-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between"
                    onClick={() => {
                      router.push(`/course-details/${id}`);
                    }}
                  >
                    Xem khóa học
                    <Eye className="w-4 h-4 mr-2" />
                  </Button>
                  <Separator />
                  <div className="flex space-x-2">
                    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-1">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Chia sẻ khóa học</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Course Preview */}
                          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            <div className="h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <img
                                src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ''}${dataCourse?.thumbnail?.key || ''}`}
                                alt="Course thumbnail"
                                className="h-full aspect-video object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-800 truncate">
                                {dataCourse?.title}
                              </h4>
                              <p className="text-sm text-slate-600 truncate">
                                {dataCourse?.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Copy Link */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Link khóa học
                            </label>
                            <div className="flex items-center space-x-2">
                              <Input
                                value={courseUrl}
                                readOnly
                                className="flex-1 bg-slate-50 text-sm"
                              />
                              <Button
                                onClick={handleCopyLink}
                                variant={linkCopied ? 'default' : 'outline'}
                                className={`w-24 ${linkCopied ? 'bg-green-600 hover:bg-green-700' : ''}`}
                              >
                                {linkCopied ? (
                                  <>
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Đã copy
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Social Media Sharing */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700">
                              Chia sẻ qua
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                onClick={handleFacebookShare}
                                variant="outline"
                                className="flex items-center justify-center space-x-2 h-12 bg-blue-50 border-blue-200 hover:bg-blue-100"
                              >
                                <Facebook className="w-5 h-5 text-blue-600" />
                                <span className="text-blue-600 font-medium">Facebook</span>
                              </Button>
                              <FacebookMessengerShareButton
                                appId="982045076452169"
                                url={courseUrl}
                                className="w-full"
                              >
                                <Button
                                  // onClick={handleMessengerShare}
                                  variant="outline"
                                  className="flex items-center justify-center space-x-2 h-12 bg-[#0084ff]/10 border-[#0084ff]/20 hover:bg-[#0084ff]/20 transition-colors duration-200 w-full"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0084ff">
                                    <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.726 7.21V22l3.405-1.869c.909.252 1.871.388 2.869.388 5.523 0 10-4.145 10-9.259C22 6.146 17.523 2 12 2zm1.008 12.461l-2.545-2.719-4.97 2.719 5.467-5.804 2.609 2.719 4.906-2.719-5.467 5.804z" />
                                  </svg>
                                  <span className="text-[#0084ff] font-medium">Messenger</span>
                                </Button>
                              </FacebookMessengerShareButton>

                              <Button
                                onClick={handleWhatsAppShare}
                                variant="outline"
                                className="flex items-center justify-center space-x-2 h-12 bg-green-50 border-green-200 hover:bg-green-100"
                              >
                                <svg
                                  className="w-6 h-6"
                                  viewBox="0 0 24 24"
                                  fill="#25D366"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0C5.463 0 0.102 5.361 0.102 11.945C0.102 14.047 0.666 16.096 1.743 17.906L0 24L6.252 22.294C7.98 23.273 9.942 23.785 11.952 23.785H11.955C18.537 23.785 23.898 18.424 23.898 11.84C23.898 8.644 22.653 5.644 20.449 3.449H20.52ZM12.045 21.785C10.254 21.785 8.511 21.298 6.963 20.391L6.609 20.178L2.865 21.18L3.888 17.538L3.651 17.169C2.649 15.558 2.112 13.677 2.112 11.744C2.112 6.466 6.567 2.011 12.048 2.011C14.712 2.011 17.204 3.042 19.071 4.909C20.938 6.776 21.969 9.268 21.969 11.932C21.969 17.21 17.514 21.665 12.033 21.665L12.045 21.785ZM17.478 14.382C17.181 14.233 15.72 13.515 15.448 13.415C15.176 13.315 14.978 13.266 14.779 13.564C14.58 13.862 14.01 14.531 13.837 14.729C13.664 14.927 13.49 14.952 13.193 14.803C12.896 14.654 11.938 14.341 10.803 13.329C9.92 12.541 9.323 11.568 9.15 11.27C8.977 10.972 9.132 10.811 9.28 10.663C9.41 10.533 9.574 10.319 9.722 10.146C9.87 9.973 9.919 9.85 10.019 9.651C10.119 9.452 10.07 9.279 9.995 9.13C9.92 8.981 9.326 7.519 9.078 6.924C8.836 6.345 8.589 6.425 8.407 6.415C8.234 6.405 8.036 6.405 7.837 6.405C7.638 6.405 7.316 6.48 7.044 6.778C6.772 7.076 6.004 7.794 6.004 9.256C6.004 10.718 7.069 12.131 7.217 12.33C7.365 12.529 9.312 15.531 12.293 16.818C13.002 17.124 13.555 17.307 13.987 17.443C14.699 17.67 15.347 17.638 15.858 17.563C16.429 17.478 17.616 16.844 17.864 16.15C18.112 15.456 18.112 14.861 18.037 14.737C17.962 14.613 17.764 14.539 17.466 14.389L17.478 14.382Z"
                                    fill="#25D366"
                                  />
                                </svg>
                                <span className="text-green-600 font-medium">WhatsApp</span>
                              </Button>

                              <Button
                                onClick={handleTwitterShare}
                                variant="outline"
                                className="flex items-center justify-center space-x-2 h-12 bg-slate-50 border-slate-200 hover:bg-slate-100"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-5 h-5 text-slate-900"
                                  fill="currentColor"
                                >
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="text-slate-900 font-medium">X (Twitter)</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar */}
          {!isOwner && (
            <div className="lg:w-1/4">
              <InfoBlockCourse
                thumbnail={dataCourse?.thumbnail?.key}
                totalDuration={totalDuration}
                id={id || ''}
                isRegistered={isRegistered}
                price={dataCourse?.price}
                level={dataCourse?.level || ''}
                totalLessons={totalLessons}
                courseProgress={dataCourse?.course_progress?.progress}
                // courseProgress={0.00001}
              />
            </div>
          )}
        </div>
      </AnimateWrapper>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default Page;
