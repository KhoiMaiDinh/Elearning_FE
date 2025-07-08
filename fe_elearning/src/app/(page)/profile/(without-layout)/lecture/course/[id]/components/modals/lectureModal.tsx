import AddButton from '@/components/button/addButton';
import VideoPlayer from '@/components/player/videoPlayer';
import FilesPicker from '@/components/inputComponent/filesPicker';
import InputRegisterLecture from '@/components/inputComponent/inputRegisterLecture';
import TextAreaRegisterLecture from '@/components/inputComponent/textAreaRegisterLecture';
import VideoPicker from '@/components/inputComponent/videoPicker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { CourseItem, SectionType, SeriesType } from '@/types/courseType';
import { Edit, FileCheck, Trash2Icon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Controller } from 'react-hook-form';
import Asterisk from '@/components/asterisk/asterisk';
import { AnimatePresence, motion } from 'framer-motion';

import ToastNotify from '@/components/ToastNotify/toastNotify';
import { toast } from 'react-toastify';
import { styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { styleError } from '@/components/ToastNotify/toastNotifyStyle';

interface LectureModalProps {
  open: boolean;
  section: SectionType;
  lecture: CourseItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: () => void;
  mode: 'edit' | 'view' | 'create';
  setMode: (mode: 'edit' | 'view' | 'create') => void;
}

const LectureModal: React.FC<LectureModalProps> = ({
  open,
  section,
  lecture,
  onOpenChange,
  onSubmitSuccess,
  mode,
  setMode,
}) => {
  const onSave = (successMessage: string) => {
    toast.success(<ToastNotify status={1} message={successMessage} />, { style: styleSuccess });
    onSubmitSuccess();
    onSubmitSuccess();
    handleOpenChange(false);
  };

  const onFail = (errorMessage: string) => {
    toast.error(<ToastNotify status={-1} message={errorMessage} />, {
      style: styleError,
    });
    handleOpenChange(false);
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
    if (!open) {
      reset();
      setReviewActive(false);
    }
    onOpenChange(open);
  };
  const handleSelectVersion = (versionId: string) => {
    const version = lecture?.series?.find((v) => v.version === Number(versionId));
    setSelectedVersion(version);
  };

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
            {mode === 'edit' && isEditing
              ? `Chỉnh sửa bài học ${lecture?.title}`
              : mode === 'view'
                ? `Xem bài học ${lecture?.title ?? ''}`
                : mode === 'create'
                  ? `Thêm bài học mới `
                  : ''}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' && isEditing
              ? `Chỉnh sửa bài học trong Chương ${section?.title}`
              : mode === 'view'
                ? `Xem bài học trong Chương ${section?.title}`
                : mode === 'create'
                  ? `Thêm bài học cho Chương ${section?.title}`
                  : ''}
          </DialogDescription>
        </DialogHeader>
        <div ref={scrollRef} className="max-h-[70vh] overflow-y-auto p-2 relative z-0">
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <>
                  {mode === 'view' ? (
                    <div className="w-full flex flex-col text-black dark:text-lightSilver relative h-full mb-0 gap-1">
                      <Label className="flex gap-1">
                        Tiêu đề
                        <Asterisk />
                      </Label>
                      <p className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border text-sm select-text">
                        {field.value || 'Chưa có tiêu đề'}
                      </p>
                    </div>
                  ) : (
                    <InputRegisterLecture
                      {...field}
                      labelText="Tiêu đề"
                      isRequired={true}
                      error={errors.title?.message}
                      maxLength={60}
                    />
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <>
                  {mode === 'view' ? (
                    <div className="w-full flex flex-col text-black dark:text-lightSilver relative h-full mb-2 gap-1">
                      <Label className="text-black font-normal dark:text-white">
                        Mô tả bài học
                      </Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border text-sm select-text min-h-20">
                        {field.value ? (
                          <div dangerouslySetInnerHTML={{ __html: field.value }} />
                        ) : (
                          <span className="text-gray-500">Chưa có mô tả</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <TextAreaRegisterLecture
                      {...field}
                      label="Mô tả bài học"
                      labelClassName="text-black font-normal dark:text-white"
                      className="text-black font-normal mb-2"
                      error={errors.description?.message}
                    />
                  )}
                </>
              )}
            />
          </div>

          <div
            className={`flex  gap-4 mb-2 items-start justify-start ${
              mode === 'view' ? 'flex-col' : 'flex-row'
            }`}
          >
            <div className="flex w-full flex-1 flex-col gap-1 self-start">
              {isEditing ? (
                <>
                  <div className="flex flex-1 w-full aspect-video">
                    <AnimatePresence mode="wait">
                      {mode === 'view' || reviewActive ? (
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
                          mode === 'view'
                            ? 'w-full opacity-100'
                            : reviewActive
                              ? 'w-2/3 opacity-100'
                              : 'w-[0.1px] opacity-0'
                        } overflow-hidden`}
                      >
                        <Select
                          onValueChange={(val) => handleSelectVersion(val)}
                          defaultValue={selectedVersion?.version?.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(lecture?.series) &&
                              lecture?.series.length > 0 &&
                              lecture?.series?.map((version) => (
                                <SelectItem
                                  key={version.version}
                                  value={version.version.toString()}
                                >
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
                      {mode !== 'view' && (
                        <div
                          className={`transition-all duration-300 ${reviewActive ? 'w-1/3' : 'w-full'}`}
                        >
                          <Button className="w-full" onClick={() => setReviewActive(!reviewActive)}>
                            Xem lại
                          </Button>
                        </div>
                      )}
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

            <div className="flex flex-1 flex-col self-start w-full ">
              {mode !== 'view' ? (
                <FilesPicker
                  onChange={handleUploadAndTrack}
                  disabled={resources.length >= MAX_RESOURCES}
                  loading={Object.keys(uploadProgress).length > 0}
                  label="Tài liệu"
                />
              ) : (
                <div className="text-sm w-full flex flex-row text-black dark:text-lightSilver relative mb-1">
                  Tài liệu
                </div>
              )}

              <div
                className={`grid gap-0 p-0  max-h-20 overflow-y-auto relative ${
                  mode === 'view' ? 'w-full pb-2' : ''
                }`}
              >
                <div className="text-[10px] text-muted-foreground text-end">
                  Số lượng tài liệu: {resources.length}/{MAX_RESOURCES} file
                </div>
                <div className="gap-3 grid">
                  {resources &&
                    resources.length > 0 &&
                    resources.map((resource, index) => (
                      <div
                        className="overflow-hidden rounded-md p-0 hover:cursor-pointer shadow-sm w-full flex flex-row items-center border pt-1 gap-2 border-black/40 dark:border-white"
                        key={resource.resource_file.id}
                        onClick={() => {
                          if (mode === 'view') {
                            window.open(
                              process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT +
                                (resource?.resource_file?.key ?? ''),
                              '_blank'
                            );
                          }
                        }}
                      >
                        <div
                          className={`flex  justify-between w-full rounded-md gap-2 ${
                            mode === 'view' ? 'items-center' : 'items-start'
                          }`}
                        >
                          <div className="px-3 py-2">
                            <FileCheck className="w-4 h-4 text-black dark:text-white" />
                          </div>

                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex flex-row gap-2 truncate  w-full">
                              {mode === 'view' ? (
                                <p className="text-sm text-black dark:text-lightSilver">
                                  {resource.name}
                                </p>
                              ) : (
                                <InputRegisterLecture
                                  className="border-black"
                                  value={resource.name}
                                  placeholder="Tên tài liệu"
                                  onChange={(e) => handleChangeResourceName(index, e.target.value)}
                                  maxLength={60}
                                  error={errors.resources?.[index]?.name?.message}
                                />
                              )}
                            </div>
                          </div>

                          {mode !== 'view' && (
                            <Button
                              variant="ghost"
                              className="hover:text-destructive"
                              onClick={() => handleRemoveResource(index)}
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </Button>
                          )}
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
                  <p
                    className={`text-sm ${
                      mode === 'view'
                        ? field.value === false
                          ? 'text-darkSilver dark:text-lightSilver'
                          : 'text-vividMalachite'
                        : 'text-black dark:text-lightSilver'
                    }`}
                  >
                    {field.value === true
                      ? 'Cho phép xem trước miễn phí'
                      : mode === 'view'
                        ? 'Không cho phép xem trước miễn phí'
                        : 'Cho phép xem trước miễn phí'}
                  </p>
                  {mode !== 'view' && (
                    <input
                      type="checkbox"
                      id="is_preview"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="accent-majorelleBlue w-4 h-4"
                    />
                  )}
                </label>
              )}
            />
          </div>
        </div>
        <DialogFooter className="relative z-10 pointer-events-auto">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            {mode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {mode === 'edit' && isEditing ? (
            <AddButton
              label="Sửa bài học"
              disabled={submitting}
              loading={submitting}
              onClick={handleSubmit(handleUpdateCourseItem)}
              icon={Edit}
            />
          ) : mode === 'view' ? (
            <Button
              className={`bg-majorelleBlue text-white hover:bg-majorelleBlue hover:brightness-110 hover:text-white shadow-md shadow-majorelleBlue/40 relative z-10 cursor-pointer`}
              onClick={() => {
                console.log('Chuyển sang edit mode');
                setMode('edit');
              }}
              type="button"
            >
              Chỉnh sửa bài học
            </Button>
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
