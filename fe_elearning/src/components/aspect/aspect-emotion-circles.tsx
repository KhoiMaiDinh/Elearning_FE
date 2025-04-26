"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aspects, emotions } from "./comment-list";

export function AspectEmotionCircles({ comments }: { comments: any }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvases
    containerRef.current.innerHTML = "";

    // Create a canvas for each aspect
    aspects.forEach((aspect) => {
      // Count comments that include this aspect
      const aspectComments = comments.filter((comment: any) =>
        comment.aspects.includes(aspect.id)
      );
      const totalComments = aspectComments.length;

      // Skip if no comments for this aspect
      if (totalComments === 0) {
        createEmptyCircle(aspect);
        return;
      }

      // Count comments by emotion for this aspect
      const emotionCounts: { [key: number]: number } = {};
      emotions.forEach((emotion) => {
        emotionCounts[emotion.id] = aspectComments.filter(
          (comment: any) => comment.emotion === emotion.id
        ).length;
      });

      createCircleCanvas(aspect, emotionCounts, totalComments);
    });
  }, [comments]);

  const createEmptyCircle = (aspect: any) => {
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

    // Draw aspect icon in the center
    const AspectIcon = aspect.icon;
    const iconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    iconSvg.setAttribute("width", "24");
    iconSvg.setAttribute("height", "24");
    iconSvg.setAttribute("viewBox", "0 0 24 24");
    iconSvg.setAttribute("fill", "none");
    iconSvg.setAttribute("stroke", "currentColor");
    iconSvg.setAttribute("stroke-width", "2");
    iconSvg.setAttribute("stroke-linecap", "round");
    iconSvg.setAttribute("stroke-linejoin", "round");

    // Convert the icon to a data URL
    const serializer = new XMLSerializer();
    const iconString = serializer.serializeToString(iconSvg);
    const iconUrl = `data:image/svg+xml;base64,${btoa(iconString)}`;

    // Draw the icon
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, centerX - 12, centerY - 12, 24, 24);
    };
    img.src = iconUrl;

    // Add label
    const label = document.createElement("div");
    label.className = "text-sm font-medium";
    label.textContent = aspect.name;

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
    aspect: any,
    emotionCounts: { [key: number]: number },
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

      // Set color based on emotion
      let fillColor;
      switch (emotion.id) {
        case 1: // Positive
          fillColor = "#10b981"; // green-500
          break;
        case 2: // Neutral
          fillColor = "#3b82f6"; // blue-500
          break;
        case 3: // Negative
          fillColor = "#ef4444"; // red-500
          break;
        default:
          fillColor = "#d1d5db"; // gray-300
      }

      ctx.fillStyle = fillColor;
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

    // Draw aspect icon in the center
    const AspectIcon = aspect.icon;
    const iconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    iconSvg.setAttribute("width", "24");
    iconSvg.setAttribute("height", "24");
    iconSvg.setAttribute("viewBox", "0 0 24 24");
    iconSvg.setAttribute("fill", "none");
    iconSvg.setAttribute("stroke", "currentColor");
    iconSvg.setAttribute("stroke-width", "2");
    iconSvg.setAttribute("stroke-linecap", "round");
    iconSvg.setAttribute("stroke-linejoin", "round");

    // Convert the icon to a data URL
    const serializer = new XMLSerializer();
    const iconString = serializer.serializeToString(iconSvg);
    const iconUrl = `data:image/svg+xml;base64,${btoa(iconString)}`;

    // Draw the icon
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, centerX - 12, centerY - 12, 24, 24);
    };
    img.src = iconUrl;

    // Add label
    const label = document.createElement("div");
    label.className = "text-sm font-medium";
    label.textContent = aspect.name;

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
            let color;
            switch (emotion.id) {
              case 1: // Positive
                color = "bg-green-500";
                break;
              case 2: // Neutral
                color = "bg-blue-500";
                break;
              case 3: // Negative
                color = "bg-red-500";
                break;
              default:
                color = "bg-gray-300";
            }

            return (
              <div key={emotion.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
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
