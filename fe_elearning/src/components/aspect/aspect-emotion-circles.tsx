"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Meh } from "lucide-react";
import { CommentEachItemCourse } from "@/types/commentType";

interface Emotion {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
}

const emotions: Emotion[] = [
  {
    id: "positive",
    name: "Positive",
    icon: ThumbsUp,
    color: "#10b981",
    bgColor: "bg-green-500",
  },
  {
    id: "neutral",
    name: "Neutral",
    icon: Meh,
    color: "#3b82f6",
    bgColor: "bg-blue-500",
  },
  {
    id: "negative",
    name: "Negative",
    icon: ThumbsDown,
    color: "#ef4444",
    bgColor: "bg-red-500",
  },
];

const aspectTypes = ["instructor_quality", "content_quality", "technology"];

export function AspectEmotionCircles({
  comments,
}: {
  comments: CommentEachItemCourse[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvases
    containerRef.current.innerHTML = "";

    // Create a canvas for each aspect type
    aspectTypes.forEach((aspectType) => {
      // Count comments that include this aspect
      const aspectComments = comments.filter((comment) =>
        comment.aspects.some((a) => a.aspect === aspectType)
      );
      const totalComments = aspectComments.length;

      // Skip if no comments for this aspect
      if (totalComments === 0) {
        createEmptyCircle(aspectType);
        return;
      }

      // Count comments by emotion for this aspect
      const emotionCounts: { [key: string]: number } = {};
      emotions.forEach((emotion) => {
        emotionCounts[emotion.id] = aspectComments.filter((comment) =>
          comment.aspects.some(
            (a) => a.aspect === aspectType && a.emotion === emotion.id
          )
        ).length;
      });

      createCircleCanvas(aspectType, emotionCounts, totalComments);
    });
  }, [comments]);

  const createEmptyCircle = (aspectType: string) => {
    if (!containerRef.current) return;

    const container = document.createElement("div");
    container.className = "flex flex-col items-center";

    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 120;
    canvas.className = "mb-2";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

    // Draw empty circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw white circle in the center
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add label
    const label = document.createElement("div");
    label.className = "text-sm font-medium";
    label.textContent = aspectType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Add count
    const count = document.createElement("div");
    count.className = "text-xs text-muted-foreground";
    count.textContent = "No comments";

    container.appendChild(canvas);
    container.appendChild(label);
    container.appendChild(count);
    containerRef.current.appendChild(container);
  };

  const createCircleCanvas = (
    aspectType: string,
    emotionCounts: { [key: string]: number },
    totalComments: number
  ) => {
    if (!containerRef.current) return;

    const container = document.createElement("div");
    container.className = "flex flex-col items-center";

    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 120;
    canvas.className = "mb-2";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

    // Draw emotion segments
    let startAngle = -Math.PI / 2; // Start from top

    emotions.forEach((emotion) => {
      const count = emotionCounts[emotion.id] || 0;
      if (count === 0) return;

      const sliceAngle = (count / totalComments) * (2 * Math.PI);
      const endAngle = startAngle + sliceAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = emotion.color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Draw white circle in the center
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add label
    const label = document.createElement("div");
    label.className = "text-sm font-medium";
    label.textContent = aspectType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Add count
    const count = document.createElement("div");
    count.className = "text-xs text-muted-foreground";
    count.textContent = `${totalComments} comment${
      totalComments !== 1 ? "s" : ""
    }`;

    container.appendChild(canvas);
    container.appendChild(label);
    container.appendChild(count);
    containerRef.current.appendChild(container);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment Distribution by Aspect & Emotion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-center gap-4">
          {emotions.map((emotion) => {
            const EmotionIcon = emotion.icon;
            return (
              <div key={emotion.id} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${emotion.bgColor}`}
                ></div>
                <EmotionIcon className="h-4 w-4" />
                <span className="text-sm">{emotion.name}</span>
              </div>
            );
          })}
        </div>
        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center"
        ></div>
      </CardContent>
    </Card>
  );
}
