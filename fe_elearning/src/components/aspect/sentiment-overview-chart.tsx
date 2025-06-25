import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LectureData {
  id: number;
  title: string;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    conflict: number;
  };
}

interface SentimentChartProps {
  data: LectureData[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution by Lecture</CardTitle>
        <CardDescription>Visual representation of sentiment across all lectures</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((lecture) => (
            <div key={lecture.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Lecture {lecture.id}</h4>
                <div className="text-xs text-muted-foreground">
                  {lecture.sentiment.positive}% positive
                </div>
              </div>
              <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                <div className="bg-green-500" style={{ width: `${lecture.sentiment.positive}%` }} />
                <div className="bg-red-500" style={{ width: `${lecture.sentiment.negative}%` }} />
                <div className="bg-gray-500" style={{ width: `${lecture.sentiment.neutral}%` }} />
                <div
                  className="bg-yellow-500"
                  style={{ width: `${lecture.sentiment.conflict}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Positive: {lecture.sentiment.positive}%</span>
                <span>Negative: {lecture.sentiment.negative}%</span>
                <span>Neutral: {lecture.sentiment.neutral}%</span>
                <span>Conflict: {lecture.sentiment.conflict}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
