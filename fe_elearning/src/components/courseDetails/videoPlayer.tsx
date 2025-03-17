import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<Hls | null>(null);
  const [qualityLevels, setQualityLevels] = useState<
    { id: number; label: string }[]
  >([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1); // -1 là tự động

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hlsInstance = new Hls();
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);

      // Lắng nghe sự kiện khi danh sách chất lượng được tải
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hlsInstance.levels.map((level, index) => ({
          id: index,
          label: `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`,
        }));
        setQualityLevels(levels);
        setHls(hlsInstance);
      });

      return () => {
        hlsInstance.destroy();
      };
    } else if (video.canPlayType("application/x-mpegURL")) {
      video.src = videoUrl;
    }
  }, [videoUrl]);

  // Xử lý khi người dùng chọn chất lượng
  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const level = parseInt(event.target.value, 10);
    if (hls) {
      hls.currentLevel = level; // Chuyển đổi chất lượng
      setSelectedQuality(level);
    }
  };
  return (
    <div className="bg-white dark:bg-richBlack rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-4">
        {title}
      </h2>
      <div className="aspect-video">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              controls
              className="w-full h-full rounded-md"
            />
            {qualityLevels.length > 0 && (
              <div className="mt-2">
                <label
                  htmlFor="quality"
                  className="mr-2 text-cosmicCobalt dark:text-AntiFlashWhite"
                >
                  Chất lượng:
                </label>
                <select
                  id="quality"
                  value={selectedQuality}
                  onChange={handleQualityChange}
                  className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 text-cosmicCobalt dark:text-AntiFlashWhite"
                >
                  <option value={-1}>Tự động</option>
                  {qualityLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
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
