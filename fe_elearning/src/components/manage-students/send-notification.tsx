'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { APICreateNotification } from '@/utils/course';
import { toast } from 'react-toastify';
import ToastNotify from '../ToastNotify/toastNotify';
import { styleError, styleSuccess } from '../ToastNotify/toastNotifyStyle';

interface SendNotificationProps {
  courseId: string;
}

export default function SendNotification({ courseId }: SendNotificationProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error(
        <ToastNotify status={-1} message="Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo" />,
        { style: styleError }
      );
      return;
    }

    setIsSending(true);

    try {
      const response = await APICreateNotification(courseId, {
        title,
        content,
      });

      if (response?.status === 201 || response?.status === 200) {
        toast.success(<ToastNotify status={200} message="Đã gửi thông báo đến tất cả học viên" />, {
          style: styleSuccess,
        });
      }

      setTitle('');
      setContent('');
    } catch (error) {
      toast.error(<ToastNotify status={-1} message="Có lỗi xảy ra khi gửi thông báo" />, {
        style: styleError,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tiêu đề thông báo</label>
        <Input
          placeholder="Nhập tiêu đề thông báo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nội dung thông báo</label>
        <Textarea
          placeholder="Nhập nội dung thông báo..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />
      </div>

      <Button
        onClick={handleSendNotification}
        disabled={isSending || !title.trim() || !content.trim()}
        className="w-full"
      >
        {isSending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Gửi thông báo
          </>
        )}
      </Button>
    </div>
  );
}
