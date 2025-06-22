import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { textTracks } from './tracks';
import { useEffect, useState, useRef } from 'react';
import { APIUpsertProgressItemCourse } from '@/utils/course';

type VideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
  lecture_id?: string;
  progress?: number; // percent (0 - 100)
  isOwner?: boolean;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, lecture_id, progress, isOwner }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const playerRef = useRef<any>(null);

  // Save progress function
  const saveProgress = () => {
    const player = playerRef.current;
    if (!player || !lecture_id || !player.duration) return;
    const percent = Math.floor((player.currentTime / player.duration) * 100);
    if (isOwner) return;
    APIUpsertProgressItemCourse(lecture_id, { watch_time: percent });
  };

  // Auto-seek based on progress
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const seekWhenReady = () => {
      if (typeof progress === 'number' && progress > 0 && progress < 100 && player.duration) {
        const time = (progress / 100) * player.duration;
        player.currentTime = time;
      }
    };

    player.addEventListener('loadedmetadata', seekWhenReady);
    return () => {
      player.removeEventListener('loadedmetadata', seekWhenReady);
    };
  }, [progress]);

  // Track pause/ended/tab close
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !lecture_id) return;

    const handlePause = () => saveProgress();
    const handleEnded = () => APIUpsertProgressItemCourse(lecture_id, { watch_time: 100 });
    const handleBeforeUnload = () => saveProgress();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveProgress();
    };

    player.addEventListener('pause', handlePause);
    player.addEventListener('ended', handleEnded);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      player.removeEventListener('pause', handlePause);
      player.removeEventListener('ended', handleEnded);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Save progress when unmounting
      saveProgress();
    };
  }, [lecture_id]);

  useEffect(() => {
    // Tạo một video element tạm thời
    const video = document.createElement('video');
    video.src = src;

    // Lắng nghe sự kiện loadeddata
    video.addEventListener('loadeddata', () => {
      // Tạo canvas để vẽ frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Vẽ frame đầu tiên
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Seek đến giây thứ 1 để lấy frame tốt hơn
        video.currentTime = 1;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Chuyển canvas thành URL
        const url = canvas.toDataURL();
        setThumbnailUrl(url);
      }
    });
  }, [src]);

  return (
    <MediaPlayer
      ref={playerRef}
      src={src}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      playsInline
      title={title}
      poster={thumbnailUrl || '/images/video.png'}
    >
      <MediaProvider>
        <Poster className="vds-poster" />
        {textTracks.map((track) => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>
      <DefaultVideoLayout thumbnails={src} icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
