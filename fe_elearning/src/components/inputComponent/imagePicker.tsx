'use client';
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from '@/components/ui/dropzone';
import { CloudUploadIcon, Crop, Eye, EyeClosed } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ImageCropperModal } from '../modal/imageCropper';
import { Button } from '../ui/button';
import Image from 'next/image';
import { MediaType } from '@/types/mediaType';
import { uploadToMinIO } from '@/utils/storage';
import { Progress } from '../ui/progress';

type ImagePickerProps = {
  className?: string;
  limit?: number;
  ratio?: number;
  onChange: (media: MediaType) => void;
  previousMedia?: MediaType;
};

const ImagePicker: React.FC<ImagePickerProps> = ({
  className,
  limit,
  onChange,
  ratio: aspect = 16 / 9,
  previousMedia,
}) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setOriginalImageUrl(URL.createObjectURL(file));
      openCropperModal();
      return {
        status: 'success',
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg'],
      },
      maxSize: MAX_FILE_SIZE,
      maxFiles: limit,
    },
    shiftOnMaxFiles: true,
  });

  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isPrevShow, setIsPrevShow] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const handleSaveCroppedImage = async (croppedImage: File) => {
    setCroppedImage(croppedImage);
    setIsCropperOpen(false);
    const uploadedMedia = await uploadToMinIO(croppedImage, 'course', 'thumbnail', (progress) =>
      setUploadProgress(progress)
    );
    setTimeout(() => {
      setUploadProgress(-1);
    }, 1000);
    onChange(uploadedMedia);
  };

  const openCropperModal = () => {
    setIsCropperOpen(true);
  };

  const togglePrevShow = () => {
    setIsPrevShow(!isPrevShow);
  };

  const closeCropperModal = () => {
    if (croppedImage == null) {
      return;
    }
    setIsCropperOpen(false);
  };
  const aspectRatioClass = `aspect-[${aspect}]`;

  const cropImageUrl = useMemo(
    () => (croppedImage ? URL.createObjectURL(croppedImage) : null),
    [croppedImage]
  );

  return (
    <div className={`not-prose flex flex-col gap-4 h-full ${className}`}>
      {originalImageUrl && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={closeCropperModal}
          imageUrl={originalImageUrl}
          handleSave={handleSaveCroppedImage}
          aspect={aspect}
        />
      )}
      <Dropzone {...dropzone}>
        <div className="h-full flex flex-col">
          <div className="flex ">
            <DropzoneDescription className="flex flex-row  justify-between w-full items-center">
              Chọn ảnh kích thước tối đa {MAX_FILE_SIZE / (1024 * 1024)} MB
            </DropzoneDescription>
            {/* <DropzoneMessage /> */}
            <div className="flex gap-2 flex-row">
              {croppedImage && (
                <Button
                  onClick={openCropperModal}
                  disabled={isPrevShow}
                  className="bg-majorelleBlue hover:bg-majorelleBlue hover:brightness-110 dark:text-white"
                >
                  Crop
                  <Crop />
                </Button>
              )}
              {previousMedia && (
                <Button
                  className="bg-majorelleBlue hover:bg-majorelleBlue hover:brightness-110 dark:text-white"
                  onClick={togglePrevShow}
                >
                  Xem ảnh cũ
                  {isPrevShow ? <Eye /> : <EyeClosed />}
                </Button>
              )}
            </div>
          </div>
          <DropZoneArea className="border-none flex flex-1 relative dark:bg-black">
            <DropzoneTrigger
              disabled={isPrevShow}
              className={`flex flex-col items-center gap-4 bg-transparent text-center text-sm border-dashed border border-black dark:border-white ${aspectRatioClass} aspect-video h-full justify-center overflow-hidden relative`}
            >
              {isPrevShow ? (
                <Image
                  src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (previousMedia?.key ?? '')}
                  alt="previous-image"
                  className="object-contain overflow-hidden"
                  fill
                />
              ) : croppedImage &&
                dropzone.fileStatuses.length > 0 &&
                dropzone?.fileStatuses?.[0].status === 'success' ? (
                <>
                  <Image
                    src={cropImageUrl!}
                    alt={`uploaded-${dropzone.fileStatuses?.[0].fileName}`}
                    className="object-contain overflow-hidden"
                    fill
                  />
                  {uploadProgress != -1 && (
                    <Progress
                      value={uploadProgress}
                      className={`absolute z-50 bottom-0 rounded-t-none rounded-b-sm px-[1px] h-1 bg-advance-gradient transition-all duration-1000 ease-in-out ${
                        uploadProgress == -1 ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  )}
                </>
              ) : (
                <>
                  <CloudUploadIcon className="size-8" />
                  <div>
                    <p className="font-semibold">Tải lên danh sách hình ảnh</p>
                    <p className="text-sm text-muted-foreground">
                      Nhấp vào đây hoặc kéo thả để tải lên
                    </p>
                  </div>
                </>
              )}
            </DropzoneTrigger>
          </DropZoneArea>
        </div>

        {/* <DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
          {dropzone.fileStatuses.map((file) => (
            <DropzoneFileListItem
              className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
              key={file.id}
              file={file}
            >
              {file.status === 'pending' && (
                <div className={`${aspectRatioClass} animate-pulse bg-black/20`} />
              )}
              {file.status === 'success' && (
                <img
                  src={file.result}
                  alt={`uploaded-${file.fileName}`}
                  className={`${aspectRatioClass} object-cover`}
                />
              )}
              <div className="flex items-center justify-between p-2 pl-4">
                <div className="min-w-0">
                  <p className="truncate text-sm">{file.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Trash2Icon className="size-4" />
                <DropzoneRemoveFile variant="ghost" className="shrink-0 hover:outline">
                </DropzoneRemoveFile>
              </div>
            </DropzoneFileListItem>
          ))}
        </DropzoneFileList> */}
      </Dropzone>
    </div>
  );
};

export default ImagePicker;
