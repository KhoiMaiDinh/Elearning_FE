"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Code,
  Video,
  Clock,
  Users,
  MessageSquare,
} from "lucide-react";

// Define the aspects with their colors for the chart
const aspects = [
  { id: 1, name: "instructor_quality", icon: BookOpen, color: "#4f46e5" },
  { id: 2, name: "content_quality", icon: Code, color: "#0ea5e9" },
  { id: 3, name: "technology", icon: Video, color: "#10b981" },
  // { id: 4, name: "Pacing", icon: Clock, color: "#f59e0b" },
  // { id: 5, name: "Instructor", icon: Users, color: "#ef4444" },
  // { id: 6, name: "Exercises", icon: MessageSquare, color: "#8b5cf6" },
];

export function AspectDistributionChart({ comments }: { comments: any }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Define the type for aspectCounts
    const aspectCounts: { [key: number]: number } = {};
    aspects.forEach((aspect) => {
      aspectCounts[aspect.id] = 0;
    });

    // Ensure comments are typed correctly
    comments.forEach((comment: { aspect: number }) => {
      if (aspectCounts[comment.aspect] !== undefined) {
        aspectCounts[comment.aspect]++;
      }
    });

    // Calculate total with correct types
    const total = Object.values(aspectCounts).reduce(
      (sum: number, count: number) => sum + count,
      0
    );

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Draw the donut chart
    drawDonutChart(ctx, aspectCounts, total);

    // Add legends
    drawLegends(ctx, aspectCounts);
  }, [comments]);

  const drawDonutChart = (
    ctx: CanvasRenderingContext2D,
    aspectCounts: { [key: number]: number },
    total: number
  ) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40; // Leave space for legends
    const innerRadius = radius * 0.6; // Inner circle radius for donut

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw center text with total
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      Object.values(aspectCounts)
        .reduce((sum: number, count: number) => sum + count, 0)
        .toString(),
      centerX,
      centerY - 10
    );

    ctx.font = "14px Arial";
    ctx.fillText("Comments", centerX, centerY + 15);

    if (total === 0) return;

    let startAngle = -Math.PI / 2; // Start from top

    // Draw each segment
    Object.entries(aspectCounts).forEach(([aspectId, count]) => {
      const aspect = aspects.find((a) => a.id === Number(aspectId));
      if (!aspect || count === 0) return;

      const sliceAngle = (count / total) * (2 * Math.PI);
      const endAngle = startAngle + sliceAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = aspect.color;
      ctx.fill();

      // Draw inner circle for donut effect
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();

      startAngle = endAngle;
    });
  };

  const drawLegends = (
    ctx: CanvasRenderingContext2D,
    aspectCounts: { [key: number]: number }
  ) => {
    const canvas = ctx.canvas;
    const width = canvas.width;

    // Draw legends
    const legendX = width - 150;
    let legendY = 30;

    aspects.forEach((aspect) => {
      const count = aspectCounts[aspect.id] || 0;

      // Draw color box
      ctx.fillStyle = aspect.color;
      ctx.fillRect(legendX, legendY, 15, 15);

      // Draw text
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`${aspect.name} (${count})`, legendX + 25, legendY + 7);

      legendY += 25;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment Distribution by Aspect</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full max-w-md mx-auto">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-full"
          ></canvas>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {aspects.map((aspect) => {
            const AspectIcon = aspect.icon;
            return (
              <div key={aspect.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: aspect.color }}
                ></div>
                <AspectIcon className="h-4 w-4" />
                <span className="text-sm">{aspect.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
