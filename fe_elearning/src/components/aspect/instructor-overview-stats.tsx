import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, TrendingUp, BookOpen, Heart, ArrowUp, ArrowDown } from 'lucide-react';

interface InstructorOverviewData {
  total_comments: number;
  leading_emotion: string;
  leading_emotion_percentage: number;
  active_course_count: number;
}

interface InstructorOverviewStatsProps {
  data: InstructorOverviewData | null;
  previousData?: InstructorOverviewData | null;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  loading?: boolean;
}

export function InstructorOverviewStats({
  data,
  previousData,
  dateRange,
  loading = false,
}: InstructorOverviewStatsProps) {
  console.log('🚀 ~ previousData:', previousData);
  console.log('🚀 ~ data:', data);
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Không có dữ liệu thống kê</div>
        </CardContent>
      </Card>
    );
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'conflict':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getEmotionText = (emotion: string) => {
    switch (emotion?.toLowerCase()) {
      case 'positive':
        return 'Tích cực';
      case 'negative':
        return 'Tiêu cực';
      case 'neutral':
        return 'Trung tính';
      case 'conflict':
        return 'Xung đột';

      default:
        return emotion;
    }
  };

  const formatPercentage = (value: number) => {
    return Math.round(value * 100);
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const formatChangeText = (change: number, unit: string = '') => {
    if (change > 0) {
      return (
        <span className="flex items-center gap-1">
          <ArrowUp className="h-3 w-3" />+{change}% so với kỳ trước {unit}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center gap-1">
          <ArrowDown className="h-3 w-3" />
          {change}% so với kỳ trước {unit}
        </span>
      );
    } else {
      return `Không thay đổi so với kỳ trước ${unit}`;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {dateRange && (
        <div className="text-sm text-muted-foreground">
          Thống kê từ {new Date(dateRange.startDate).toLocaleDateString('vi-VN')} đến{' '}
          {new Date(dateRange.endDate).toLocaleDateString('vi-VN')}
          {previousData && (
            <span className="ml-2 text-xs text-blue-600">(So sánh với cùng kỳ trước)</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
        {/* Total Comments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Phản hồi</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_comments}</div>
            {previousData && (
              <div
                className={`text-xs mt-2 ${getChangeColor(calculateChange(data.total_comments, previousData.total_comments))}`}
              >
                {formatChangeText(
                  calculateChange(data.total_comments, previousData.total_comments)
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leading Emotion */}
        <Card className="relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cảm xúc chủ đạo</CardTitle>
            <div className="  flex items-center gap-2 ">
              <Badge variant="secondary" className={getEmotionColor(data.leading_emotion)}>
                {getEmotionText(data.leading_emotion)}
              </Badge>
            </div>{' '}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(data.leading_emotion_percentage)}%
            </div>

            {previousData && (
              <div className="text-xs mt-2">
                {(() => {
                  return (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>Kỳ trước:</span>
                        <Badge
                          variant="outline"
                          className={`${getEmotionColor(previousData.leading_emotion)} text-[8px] px-1 py-0`}
                        >
                          {getEmotionText(previousData.leading_emotion)}{' '}
                          {previousData.leading_emotion_percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khóa học nhận feedback</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.active_course_count}</div>
            {previousData && (
              <div
                className={`text-xs mt-2 ${getChangeColor(calculateChange(data.active_course_count, previousData.active_course_count))}`}
              >
                {formatChangeText(
                  calculateChange(data.active_course_count, previousData.active_course_count)
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
