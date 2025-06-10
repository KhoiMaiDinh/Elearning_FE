import AddButton from '@/components/button/addButton';
import VideoPlayer from '@/components/player/videoPlayer';
import FilesPicker from '@/components/inputComponent/filesPicker';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';
import VideoPicker from '@/components/inputComponent/videoPicker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLecture } from '@/hooks/lecture/useLectureForm';
import { CourseItem, Section, SeriesType } from '@/types/courseType';
import { Edit, FileCheck, Trash2Icon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Controller } from 'react-hook-form';
import Asterisk from '@/components/asterisk/asterisk';
import { AnimatePresence, motion } from 'framer-motion';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';

interface LectureModalProps {
  open: boolean;
  section: Section;
  lecture: CourseItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: () => void;
  setShowAlertSuccess: (show: boolean) => void;
  setShowAlertError: (show: boolean) => void;
  setDescription: (desc: string) => void;
}

const LectureModal: React.FC<LectureModalProps> = ({
  open,
  section,
  lecture,
  onOpenChange,
  onSubmitSuccess,
  setShowAlertSuccess,
  setShowAlertError,
  setDescription,
}) => {
  const onSave = (successMessage: string) => {
    setShowAlertSuccess(true);
    setDescription(successMessage);
    onSubmitSuccess();
    handleOpenChange(false);
    setTimeout(() => {
      setShowAlertSuccess(false);
    }, 3000);
  };

  const onFail = (errorMessage: string) => {
    setShowAlertError(true);
    setDescription(errorMessage);
    handleOpenChange(false);
    setTimeout(() => {
      setShowAlertError(false);
    }, 3000);
  };

  const {
    isDirty,
    watch,
    handleSubmit,
    handleAddCourseItem,
    handleUpdateCourseItem,
    handleVideoUpload,
    handleVideoRemove,
    handleUploadAndTrack,
    handleRemoveResource,
    handleChangeResourceName,
    control,
    submitting,
    uploadProgress,
    errors,
    MAX_RESOURCES,
    reset,
  } = useLecture(section, lecture, onSave, onFail);
  const currentVideo = watch('video');
  const resources = watch('resources') || [];

  const [reviewActive, setReviewActive] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<SeriesType>();

  const isEditing = lecture !== null;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollTop = scrollRef.current?.scrollTop || 0;
    reset();
    setSelectedVersion(lecture?.series?.[0]);
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollTop;
    }, 0);
  }, [lecture, section]);

  const handleOpenChange = (open: boolean) => {
    if (submitting) return;
    if (!open) reset();
    onOpenChange(open);
  };

  const handleSelectVersion = (versionId: string) => {
    const version = lecture?.series?.find((v) => v.version === Number(versionId));
    setSelectedVersion(version);
  };

  console.log(
    selectedVersion?.video?.status === 'uploaded'
      ? process.env.NEXT_PUBLIC_BASE_URL_TEMP_VIDEO + (selectedVersion?.video?.key ?? '')
      : process.env.NEXT_PUBLIC_BASE_URL_VIDEO + (selectedVersion?.video?.key ?? '')
  );

  const getVideoStatus = (status: 'uploaded' | 'validated' | 'pending' | 'rejected') => {
    switch (status) {
      case 'uploaded':
        return 'Đã tải lên, đang trong quá trình xử lí';
      case 'validated':
        return 'Đã xử lí xong';
      case 'pending':
        return 'Đang chờ';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl px-4">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Chỉnh sửa bài học ${lecture.title}` : 'Thêm bài học mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Chỉnh sửa bài học trong Chương ${section?.title}`
              : `Thêm bài học cho Chương ${section?.title}`}
          </DialogDescription>
        </DialogHeader>
        <div ref={scrollRef} className="max-h-[70vh] overflow-y-auto p-2">
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tiêu đề"
                  isRequired={true}
                  error={errors.title?.message}
                  maxLength={60}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextAreaRegisterLecture
                  {...field}
                  labelText="Mô tả bài học"
                  className="text-black font-normal mb-2"
                  error={errors.description?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-row gap-4 mb-2 items-start justify-start">
            <div className="flex flex-1 flex-col gap-1 self-start">
              {isEditing ? (
                <>
                  <div className="flex flex-1 w-full aspect-video">
                    <AnimatePresence mode="wait">
                      {reviewActive ? (
                        <motion.div
                          key="video-player"
                          initial={{ x: 100, opacity: 0, position: 'relative', width: '100%' }}
                          animate={{ x: 0, opacity: 1, position: 'relative' }}
                          exit={{ x: -100, opacity: 0, position: 'relative' }}
                          transition={{ duration: 0.4, ease: 'easeInOut' }}
                          className="w-full"
                        >
                          <div className="text-sm w-full flex flex-row text-black dark:text-lightSilver relative mb-1">
                            Video bài giảng <Asterisk className="ml-1" />
                          </div>
                          <VideoPlayer
                            title={lecture?.title ?? ''}
                            src={
                              selectedVersion?.video?.status === 'uploaded'
                                ? process.env.NEXT_PUBLIC_BASE_URL_TEMP_VIDEO +
                                  (selectedVersion?.video?.key ?? '')
                                : process.env.NEXT_PUBLIC_BASE_URL_VIDEO +
                                  (selectedVersion?.video?.key ?? '')
                            }
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="video-picker"
                          initial={{ x: -100, opacity: 0, position: 'relative', width: '100%' }}
                          animate={{ x: 0, opacity: 1, position: 'relative' }}
                          exit={{ x: 100, opacity: 0, position: 'relative' }}
                          transition={{ duration: 0.4, ease: 'easeInOut' }}
                          className="w-full"
                        >
                          <VideoPicker
                            ratio={16 / 9}
                            onVideoPicked={(file, duration) => {
                              handleVideoUpload(file, duration);
                            }}
                            onVideoRemoved={() => handleVideoRemove()}
                            error={errors.video?.message}
                            isRequired={true}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {(currentVideo?.id ?? '') == (lecture?.video?.id ?? '') && (
                    <div
                      className={`flex items-center  w-full overflow-hidden ${reviewActive && 'gap-2'}`}
                    >
                      <div
                        className={`transition-all duration-300 ${
                          reviewActive ? 'w-2/3 opacity-100' : 'w-[0.1px] opacity-0'
                        } overflow-hidden`}
                      >
                        <Select
                          onValueChange={(val) => handleSelectVersion(val)}
                          defaultValue={selectedVersion?.version.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {lecture?.series?.map((version) => (
                              <SelectItem key={version.version} value={version.version.toString()}>
                                V
                                {version.version +
                                  ' - ' +
                                  getVideoStatus(
                                    version.video.status as
                                      | 'uploaded'
                                      | 'validated'
                                      | 'pending'
                                      | 'rejected'
                                  )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div
                        className={`transition-all duration-300 ${reviewActive ? 'w-1/3' : 'w-full'}`}
                      >
                        <Button className="w-full" onClick={() => setReviewActive(!reviewActive)}>
                          Xem lại
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <VideoPicker
                  ratio={16 / 9}
                  onVideoPicked={(file, duration) => {
                    handleVideoUpload(file, duration);
                  }}
                  onVideoRemoved={() => handleVideoRemove()}
                  error={errors.video?.message}
                  isRequired={true}
                  maxSize={4 * 1024 * 1024 * 1024}
                />
              )}
            </div>

            <div className="flex flex-1 flex-col self-start">
              <FilesPicker
                onChange={handleUploadAndTrack}
                disabled={resources.length >= MAX_RESOURCES}
                loading={Object.keys(uploadProgress).length > 0}
                label="Tài liệu"
              />

              <div className="grid gap-0 p-0 max-h-20 overflow-y-auto relative">
                <div className="text-[10px] text-muted-foreground text-end">
                  Số lượng tài liệu: {resources.length}/{MAX_RESOURCES} file
                </div>
                <div className="gap-3 grid">
                  {resources.map((resource, index) => (
                    <div
                      className="overflow-hidden rounded-md p-0 shadow-sm w-full flex flex-row items-center border pt-1 gap-2 border-black/40 dark:border-white"
                      key={resource.resource_file.id}
                    >
                      <div className="flex items-start justify-between w-full rounded-md gap-2">
                        <div className="px-3 py-2">
                          <FileCheck className="w-4 h-4 text-black dark:text-white" />
                        </div>

                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex flex-row gap-2 truncate  w-full">
                            <InputRegisterLecture
                              className="border-black"
                              value={resource.name}
                              placeholder="Tên tài liệu"
                              onChange={(e) => handleChangeResourceName(index, e.target.value)}
                              maxLength={60}
                              error={errors.resources?.[index]?.name?.message}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          className="hover:text-destructive"
                          onClick={() => handleRemoveResource(index)}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="is_preview"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <p className="text-sm text-black dark:text-lightSilver">
                    Cho phép xem trước miễn phí
                  </p>
                  <input
                    type="checkbox"
                    id="is_preview"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="accent-majorelleBlue w-4 h-4"
                  />
                </label>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Hủy
          </Button>
          {isEditing ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild disabled={isDirty}>
                  <div>
                    <AddButton
                      label="Sửa bài học"
                      disabled={submitting || !isDirty}
                      loading={submitting}
                      onClick={handleSubmit(handleUpdateCourseItem)}
                      icon={Edit}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className={`bg-black70 text-AntiFlashWhite px-2 py-1 rounded-full text-sm ${isDirty ? 'hidden' : ''}`}
                >
                  <p>Chưa có chỉnh sửa</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <AddButton
              label="Thêm bài học"
              disabled={submitting}
              loading={submitting}
              onClick={handleSubmit(handleAddCourseItem)}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LectureModal;
