'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  handleSave: (croppedImage: File) => void;
  aspect: number;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  imageUrl,
  handleSave,
  aspect = 16 / 9,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', reject);
      image.setAttribute('crossOrigin', 'anonymous'); // Important for CORS
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    crop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas not supported');

    const scaleX = flip.horizontal ? -1 : 1;
    const scaleY = flip.vertical ? -1 : 1;
    const centerX = image.width / 2;
    const centerY = image.height / 2;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.save();
    ctx.translate(-crop.x, -crop.y);
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0);
    ctx.restore();

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error('Crop failed'));
        else resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedImg(imageUrl, croppedAreaPixels, rotation, {
      horizontal: flipX,
      vertical: flipY,
    });

    const previewUrl = URL.createObjectURL(blob);
    console.log(previewUrl);
    handleSave(
      new File([blob], 'cropped-image.jpg', { type: 'image/jpeg', lastModified: Date.now() })
    );

    onClose();
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  const handleRotateClockwise = () => {
    setRotation((rotation + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((rotation - 90 + 360) % 360);
  };

  const handleFlipX = () => {
    setFlipX(!flipX);
  };

  const handleFlipY = () => {
    setFlipY(!flipY);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ảnh bìa</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative border rounded-md overflow-hidden bg-gray-100 w-full h-[300px] flex items-center justify-center">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showGrid={false}
              transform={[
                `translate(${crop.x}px, ${crop.y}px)`,
                `rotateZ(${rotation}deg)`,
                `rotateY(${flipX ? 180 : 0}deg)`,
                `rotateX(${flipY ? 180 : 0}deg)`,
                `scale(${zoom})`,
              ].join(' ')}
              objectFit="contain"
            />
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phóng to/thu nhỏ:</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  className="w-[200px]"
                  onValueChange={(value) => setZoom(value[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Xoay:</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRotateCounterClockwise}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <div className="w-[60px] text-center">{rotation}°</div>
                <Button type="button" variant="outline" size="icon" onClick={handleRotateClockwise}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lật:</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={flipX ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleFlipX}
                  className="gap-2"
                >
                  <FlipHorizontal className="h-4 w-4" />
                  <span>Ngang</span>
                </Button>
                <Button
                  type="button"
                  variant={flipY ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleFlipY}
                  className="gap-2"
                >
                  <FlipVertical className="h-4 w-4" />
                  <span>Dọc</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" onClick={handleApply}>
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
