import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { APIUpsertProgressItemCourse } from "@/utils/course";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  coverPhoto?: string;
  lecture_id?: string;
  progress?: number; // percent (0 - 100)
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  coverPhoto,
  lecture_id,
  progress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<Hls | null>(null);
  const [qualityLevels, setQualityLevels] = useState<
    { id: number; label: string }[]
  >([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);

  // Lưu tiến độ
  const saveProgress = () => {
    const video = videoRef.current;
    if (!video || !lecture_id || !video.duration) return;
    const percent = Math.floor((video.currentTime / video.duration) * 100);
    APIUpsertProgressItemCourse(lecture_id, { watch_time: percent });
  };

  // Load video và HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hlsInstance = new Hls();
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hlsInstance.levels.map((level, index) => ({
          id: index,
          label: `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`,
        }));
        setQualityLevels(levels);
        setHls(hlsInstance);
      });

      setHls(hlsInstance);

      return () => {
        hlsInstance.destroy();
        saveProgress();
      };
    } else if (video.canPlayType("application/x-mpegURL")) {
      video.src = videoUrl;
    }
  }, [videoUrl]);

  // Auto-seek theo progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seekWhenReady = () => {
      if (
        typeof progress === "number" &&
        progress > 0 &&
        progress < 100 &&
        video.duration
      ) {
        const time = (progress / 100) * video.duration;
        video.currentTime = time;
      }
    };

    video.addEventListener("loadedmetadata", seekWhenReady);

    return () => {
      video.removeEventListener("loadedmetadata", seekWhenReady);
    };
  }, [progress]);

  // Track pause/ended/tab close
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !lecture_id) return;

    const handlePause = () => saveProgress();
    const handleEnded = () =>
      APIUpsertProgressItemCourse(lecture_id, { watch_time: 100 });
    const handleBeforeUnload = () => saveProgress();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveProgress();
    };

    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lecture_id]);

  const handleQualitySelect = (levelId: number) => {
    if (hls) {
      hls.currentLevel = levelId;
      setSelectedQuality(levelId);
      setShowQualityMenu(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-richBlack rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-cosmicCobalt dark:text-AntiFlashWhite mb-4">
        {title}
      </h2>
      <div className="relative aspect-video">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              controls
              className="w-full h-full rounded-md"
              poster={coverPhoto}
            />

            {/* Nút cài đặt chất lượng */}
            {qualityLevels.length > 0 && (
              <div className="absolute bottom-2 right-2 z-20">
                <button
                  onClick={() => setShowQualityMenu((prev) => !prev)}
                  className="px-2 py-1 text-xs rounded bg-black/60 text-white hover:bg-black/80"
                >
                  ⚙
                </button>
                {showQualityMenu && (
                  <div className="absolute bottom-10 right-0 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded shadow-md w-36 text-sm">
                    <ul>
                      <li
                        onClick={() => handleQualitySelect(-1)}
                        className={cn(
                          "cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700",
                          selectedQuality === -1 &&
                            "font-semibold text-blue-600"
                        )}
                      >
                        Tự động
                      </li>
                      {qualityLevels.map((level) => (
                        <li
                          key={level.id}
                          onClick={() => handleQualitySelect(level.id)}
                          className={cn(
                            "cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700",
                            selectedQuality === level.id &&
                              "font-semibold text-blue-600"
                          )}
                        >
                          {level.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
