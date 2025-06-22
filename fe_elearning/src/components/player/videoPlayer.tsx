import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { textTracks } from './tracks';
import { useEffect, useState, useRef } from 'react';
import { APIUpsertProgressItemCourse } from '@/utils/course';
import { debounce } from 'lodash';

type VideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
  lecture_id?: string;
  progress?: number; // percent (0 - 100)
  isOwner?: boolean;
};

export function useProgressTracker(playerRef: any, lecture_id: string) {
  const saveProgress = (player: any, lecture_id: string) => {
    const currentTime = player?.state?.currentTime;
    const duration = player?.state?.duration;

    if (!currentTime || !duration || !lecture_id) return;

    const watch_time = Math.min((currentTime / duration) * 100, 100);
    if (!isNaN(watch_time)) {
      console.log('[saveProgress] Watch time:', watch_time);
      APIUpsertProgressItemCourse(lecture_id, { watch_time });
    }
  };

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !lecture_id) return;

    const debouncedSave = debounce(() => saveProgress(player, lecture_id), 500);

    const unsubPaused = player.subscribe((state: any) => {
      if (state.paused) {
        console.log('[Paused] Saving progress...');
        debouncedSave();
      }
    });

    const unsubEnded = player.subscribe((state: any) => {
      if (state.ended) {
        console.log('[Ended] Saving 100% progress');
        APIUpsertProgressItemCourse(lecture_id, { watch_time: 100 });
      }
    });

    const handleBeforeUnload = () => {
      console.log('[BeforeUnload] Saving progress...');
      saveProgress(player, lecture_id);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('[VisibilityChange] Saving progress...');
        saveProgress(player, lecture_id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubPaused();
      unsubEnded();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      saveProgress(player, lecture_id);
    };
  }, [playerRef, lecture_id]);
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  lecture_id,
  progress = 0,
  isOwner,
  poster,
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const playerRef = useRef<any>(null);
  if (lecture_id) {
    useProgressTracker(playerRef, lecture_id);
  }

  // // Save progress function
  // const saveProgress = () => {
  //   const player = playerRef.current;
  //   if (!player || !lecture_id || !player.duration) return;
  //   const percent = Math.floor((player.currentTime / player.duration) * 100);
  //   if (isOwner) return;
  //   APIUpsertProgressItemCourse(lecture_id, { watch_time: percent });
  // };

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const interval = setInterval(() => {
      const duration = player?.state?.duration;
      if (duration && !Number.isNaN(duration)) {
        const targetTime = (progress / 100) * duration;
        player.currentTime = targetTime;
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [progress]);

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
      poster={thumbnailUrl || '/images/logo.png'}
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
