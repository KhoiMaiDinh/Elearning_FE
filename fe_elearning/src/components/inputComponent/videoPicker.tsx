'use client';
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  DropzoneTrigger,
  useDropzone,
} from '@/components/ui/dropzone';
import { CloudUploadIcon, Crop, Eye, EyeClosed, Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ImageCropperModal } from '../modal/imageCropper';
import { Button } from '../ui/button';
import Image from 'next/image';
import { MediaType } from '@/types/mediaType';
import { uploadToMinIO } from '@/utils/storage';
import { Progress } from '../ui/progress';
import HeroVideoDialog from '../ui/hero-video-dialog';
import VideoPlayer from '../player/videoPlayer';
import Loader from '../loading/dotLoader';
import { Input } from '../ui/input';
import Asterisk from '../asterisk/asterisk';

type VideoPickerProps = {
  label?: string;
  className?: string;
  limit?: number;
  ratio?: number;
  onVideoPicked: (media: MediaType, duration: number) => void;
  onVideoRemoved: () => void;
  previousMedia?: MediaType;
  error?: string;
  maxSize?: number;
  isRequired?: boolean;
};

const ONE_GB = 1024 * 1024 * 1024;
const MAX_FILE_SIZE = 20 * ONE_GB;

const VideoPicker: React.FC<VideoPickerProps> = ({
  label = 'Tải lên video',
  className,
  onVideoPicked,
  onVideoRemoved,
  isRequired = false,
  ratio: aspect = 16 / 9,
  error,
  maxSize = MAX_FILE_SIZE,
}) => {
  const ACCEPTED_EXTENSIONS = ['.mp4', '.webm', '.ogg'];
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      handleSaveVideo(file);
      setDuration(await getVideoDuration(file));
      setSize(file.size);

      return {
        status: 'success',
        result: URL.createObjectURL(file),
      };
    },
    onRemoveFile: () => {
      setOriginalVideoUrl(null);
      onVideoRemoved();
    },
    validation: {
      accept: {
        'video/*': ACCEPTED_EXTENSIONS,
      },
      maxSize: MAX_FILE_SIZE,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [size, setSize] = useState(0);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => reject('Không thể đọc thời lượng video');
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSaveVideo = async (video: File) => {
    const uploadedMedia = await uploadToMinIO(video, 'lecture-series', 'video', (progress) =>
      setUploadProgress(progress)
    );
    const duration = await getVideoDuration(video);
    onVideoPicked(uploadedMedia, duration);
    setOriginalVideoUrl(process.env.NEXT_PUBLIC_BASE_URL_TEMP_VIDEO + (uploadedMedia?.key ?? ''));
    setTimeout(() => {
      setUploadProgress(-1);
    }, 1000);
  };

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatSize = (size: number): string => {
    console.log(size);
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (size >= 1024) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  };

  return (
    <div className={`not-prose flex flex-1 flex-col gap-4 h-full ${className}`}>
      <Dropzone {...dropzone}>
        <div className="h-full flex flex-col">
          <div className="flex ">
            <DropzoneDescription className="w-full flex flex-row  text-black dark:text-lightSilver relative h-full mb-0">
              Video bài giảng {isRequired && <Asterisk className="ml-1" />}
            </DropzoneDescription>
          </div>
          <DropZoneArea className="border-none flex flex-1 relative dark:bg-black py-0 px-0 flex-col">
            {originalVideoUrl ? (
              <div>
                <VideoPlayer src={originalVideoUrl} title="test" />
                <div className="flex gap-1 text-">
                  <Input value={formatDuration(duration)} disabled />
                  <Input value={formatSize(size)} disabled />
                  <DropzoneFileList>
                    {dropzone.fileStatuses.map((file) => (
                      <DropzoneFileListItem key={file.id} file={file} className="p-0">
                        <DropzoneRemoveFile
                          variant="ghost"
                          className="shrink-0 hover:outline bg-redPigment/90 text-white hover:text-white hover:bg-redPigment hover:brightness-110"
                        >
                          <Trash2Icon className="size-4" />
                        </DropzoneRemoveFile>
                      </DropzoneFileListItem>
                    ))}
                  </DropzoneFileList>
                </div>
              </div>
            ) : uploadProgress != -1 ? (
              <div
                className={`flex flex-col items-center gap-4 bg-transparent text-center text-sm border-dashed border border-black dark:border-white aspect-video w-full justify-center overflow-hidden relative rounded-sm `}
              >
                <Loader />
                <Progress
                  value={uploadProgress}
                  className={`absolute z-50 bottom-0 rounded-t-none rounded-b-sm px-[1px] h-1 transition-all duration-1000 ease-in-out ${
                    uploadProgress == -1 ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>
            ) : (
              <DropzoneTrigger
                className={`flex flex-col items-center gap-4 bg-transparent text-center text-sm border-dashed border border-black dark:border-white aspect-video h-full justify-center overflow-hidden relative w-full`}
              >
                <CloudUploadIcon className="size-8" />
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    Nhấp vào đây hoặc kéo thả để tải lên
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Chọn video có kích thước tối đa {MAX_FILE_SIZE / ONE_GB} GB, định dạng{' '}
                    {ACCEPTED_EXTENSIONS.join(', ')}
                  </p>
                </div>
              </DropzoneTrigger>
            )}
            <DropzoneMessage>{error}</DropzoneMessage>
          </DropZoneArea>
        </div>
      </Dropzone>
    </div>
  );
};

export default VideoPicker;
