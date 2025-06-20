'use client';
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  DropzoneTrigger,
  useDropzone,
} from '@/components/ui/dropzone';
import {
  CloudUploadIcon,
  Crop,
  Eye,
  EyeClosed,
  File,
  FileCheck,
  FileText,
  Trash2Icon,
} from 'lucide-react';
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
import InputRegisterLecture from './inputRegisterLecture';
import { Spinner } from '../ui/spinner';

const ONE_MB = 1024 * 1024;
const MAX_FILE_SIZE = 50 * ONE_MB;
const ACCEPTED_EXTENSIONS = ['.pdf'];

type FilesPickerProps = {
  label?: string;
  boxLabel?: string;
  className?: string;
  dropzoneClassName?: string;
  disabled?: boolean;
  onChange: (file: File) => void;
  loading?: boolean;
  error?: string;
  maxSize?: number;
  acceptedExtensions?: string[];
};

const FilesPicker: React.FC<FilesPickerProps> = ({
  label,
  boxLabel = 'Tải lên các file',
  className,
  dropzoneClassName,
  onChange,
  disabled,
  loading = false,
  error,
  maxSize = MAX_FILE_SIZE,
  acceptedExtensions = ACCEPTED_EXTENSIONS,
}) => {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      onChange(file);
      return {
        status: 'success',
        result: URL.createObjectURL(file),
      };
    },

    validation: {
      accept: {
        'application/pdf': acceptedExtensions,
      },
      maxSize: maxSize,
    },
    // shiftOnMaxFiles: true,
  });

  const formatSize = (size: number): string => {
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
        <div className="h-full flex flex-col ">
          {label && (
            <div className="flex">
              <DropzoneDescription className="w-full flex flex-col  text-black dark:text-lightSilver relative h-full mb-0">
                {label}
              </DropzoneDescription>
            </div>
          )}

          <DropZoneArea
            className={`border-none flex flex-1 relative dark:bg-black py-0 px-0 flex-col ${dropzoneClassName}`}
          >
            <DropzoneTrigger
              disabled={disabled}
              className={`flex flex-col items-center gap-4 ml-1 bg-transparent text-center text-sm border-dashed border border-black dark:border-white aspect-video h-full justify-center overflow-hidden relative w-full ${disabled ? 'cursor-not-allowed bg-muted' : ''}`}
            >
              {loading && (
                <Spinner
                  size="small"
                  className="text-sm text-majorelleBlue absolute top-2 right-2"
                />
              )}
              <CloudUploadIcon className="size-8" />
              <div>
                <p className="font-semibold">{boxLabel}</p>
                <p className="text-sm text-muted-foreground">
                  Nhấp vào đây hoặc kéo thả để tải lên
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Chọn file có kích thước tối đa {formatSize(maxSize)}, định dạng{' '}
                  {ACCEPTED_EXTENSIONS.join(', ')}
                </p>
              </div>
            </DropzoneTrigger>
            <DropzoneMessage>{error}</DropzoneMessage>
          </DropZoneArea>
        </div>
      </Dropzone>
    </div>
  );
};

export default FilesPicker;
