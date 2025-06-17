import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { textTracks } from './tracks';
import { useEffect, useState } from 'react';

type VideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

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
