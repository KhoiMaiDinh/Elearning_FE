import React from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  coverPhoto?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  coverPhoto,
}) => {
  return (
    <div className="bg-white dark:bg-richBlack rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-4">
        {title}
      </h2>
      <div className="aspect-video">
        {videoUrl ? (
          <video controls className="w-full h-full rounded-md">
            <source src={videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        ) : (
          <img
            src={coverPhoto || "/placeholder-video.jpg"}
            alt={title}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
