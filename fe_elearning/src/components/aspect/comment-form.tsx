'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown, Meh, ChevronsRightLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aspects } from './comment-list';

export function CommentForm() {
  const [comment, setComment] = useState('');
  const [selectedAspects, setSelectedAspects] = useState<number[]>([]);
  const [emotion, setEmotion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAspectChange = (aspectId: number) => {
    setSelectedAspects((prev: number[]) => {
      if (prev.includes(aspectId)) {
        return prev.filter((id) => id !== aspectId);
      } else {
        return [...prev, aspectId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call để gửi comment
      console.log('Comment data:', {
        comment,
        selectedAspects,
        emotion,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setComment('');
      setSelectedAspects([]);
      setEmotion('');

      toast({
        title: 'Thành công',
        description: 'Bình luận đã được gửi thành công!',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm bình luận</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="comment">Bình luận</Label>
            <Textarea
              id="comment"
              placeholder="Chia sẻ suy nghĩ của bạn về khóa học..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <Label>Chọn các khía cạnh (Chọn tất cả các khía cạnh)</Label>
            <div className="grid grid-cols-2 gap-3">
              {aspects &&
                aspects.length > 0 &&
                aspects.map((aspect) => {
                  const AspectIcon = aspect.icon;
                  return (
                    <div key={aspect.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`aspect-${aspect.id}`}
                        checked={selectedAspects.includes(aspect.id)}
                        onCheckedChange={() => handleAspectChange(aspect.id)}
                        disabled={isSubmitting}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`aspect-${aspect.id}`}
                          className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <AspectIcon className="h-4 w-4" />
                          {aspect.name === 'teaching_pace'
                            ? 'Tốc độ dạy'
                            : aspect.name === 'instructor_quality'
                              ? 'Chất lượng giảng viên'
                              : aspect.name === 'content_quality'
                                ? 'Chất lượng nội dung'
                                : aspect.name === 'technology'
                                  ? 'Công nghệ'
                                  : aspect.name}
                        </Label>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Bạn cảm thấy thế nào?</Label>
            <RadioGroup
              value={emotion}
              onValueChange={setEmotion}
              className="grid grid-cols-3 gap-2"
              disabled={isSubmitting}
            >
              <EmotionOption
                value="1"
                icon={ThumbsUp}
                label="Tích cực"
                className="bg-green-50 border-green-200 data-[state=checked]:border-green-500"
                disabled={isSubmitting}
              />
              <EmotionOption
                value="2"
                icon={Meh}
                label="Trung lập"
                className="bg-blue-50 border-blue-200 data-[state=checked]:border-blue-500"
                disabled={isSubmitting}
              />
              <EmotionOption
                value="3"
                icon={ThumbsDown}
                label="Tiêu cực"
                className="bg-red-50 border-red-200 data-[state=checked]:border-red-500"
                disabled={isSubmitting}
              />
              <EmotionOption
                value="4"
                icon={ChevronsRightLeft}
                label="Xung đột"
                className="bg-red-50 border-red-200 data-[state=checked]:border-red-500"
                disabled={isSubmitting}
              />
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!comment || selectedAspects.length === 0 || !emotion || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi bình luận'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function EmotionOption({
  value,
  icon: Icon,
  label,
  className,
  disabled,
}: {
  value: string;
  icon: any;
  label: string;
  className: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={value}
        id={`emotion-${value}`}
        className="peer sr-only"
        disabled={disabled}
      />
      <Label
        htmlFor={`emotion-${value}`}
        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Icon className="mb-2 h-6 w-6" />
        <span className="text-sm">{label}</span>
      </Label>
    </div>
  );
}
