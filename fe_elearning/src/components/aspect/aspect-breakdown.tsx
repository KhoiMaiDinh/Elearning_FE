import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LectureData {
  id: number;
  title: string;
  aspects: {
    [key: string]: {
      positive: number;
      negative: number;
      neutral: number;
      conflict: number;
    };
  };
}

interface AspectBreakdownProps {
  lectures: LectureData[];
}

export function AspectBreakdown({ lectures }: AspectBreakdownProps) {
  // Calculate average sentiment for each aspect across all lectures
  const aspectAverages = lectures.reduce(
    (acc, lecture) => {
      Object.entries(lecture.aspects).forEach(([aspect, sentiments]) => {
        if (!acc[aspect]) {
          acc[aspect] = { positive: 0, negative: 0, neutral: 0, conflict: 0, count: 0 };
        }
        acc[aspect].positive += sentiments.positive;
        acc[aspect].negative += sentiments.negative;
        acc[aspect].neutral += sentiments.neutral;
        acc[aspect].conflict += sentiments.conflict;
        acc[aspect].count += 1;
      });
      return acc;
    },
    {} as Record<string, any>
  );

  // Calculate averages
  Object.keys(aspectAverages).forEach((aspect) => {
    const data = aspectAverages[aspect];
    data.positive = Math.round(data.positive / data.count);
    data.negative = Math.round(data.negative / data.count);
    data.neutral = Math.round(data.neutral / data.count);
    data.conflict = Math.round(data.conflict / data.count);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(aspectAverages).map(([aspect, sentiments]) => (
        <Card key={aspect}>
          <CardHeader>
            <CardTitle className="capitalize">{aspect}</CardTitle>
            <CardDescription>Average sentiment across all lectures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Positive</span>
                <span className="text-sm font-medium text-green-600">{sentiments.positive}%</span>
              </div>
              <Progress value={sentiments.positive} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Negative</span>
                <span className="text-sm font-medium text-red-600">{sentiments.negative}%</span>
              </div>
              <Progress value={sentiments.negative} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Neutral</span>
                <span className="text-sm font-medium text-gray-600">{sentiments.neutral}%</span>
              </div>
              <Progress value={sentiments.neutral} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Conflict</span>
                <span className="text-sm font-medium text-yellow-600">{sentiments.conflict}%</span>
              </div>
              <Progress value={sentiments.conflict} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
