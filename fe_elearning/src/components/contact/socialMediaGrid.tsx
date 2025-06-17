'use client';

import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  InstagramIcon as TiktokIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialMediaLink, SocialPlatform } from './socialMediaLink';

interface SocialMediaGridProps {
  className?: string;
  showLabels?: boolean;
  size?: number;
  platforms?: {
    platform: SocialPlatform;
    url: string;
  }[];
}

export function SocialMediaGrid({
  className,
  showLabels = false,
  size = 24,
  platforms = [
    { platform: 'facebook', url: 'https://facebook.com/' },
    { platform: 'twitter', url: 'https://twitter.com/' },
    { platform: 'instagram', url: 'https://instagram.com/' },
    { platform: 'linkedin', url: 'https://linkedin.com/' },
  ],
}: SocialMediaGridProps) {
  const getIconForPlatform = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return Facebook;
      case 'twitter':
        return Twitter;
      case 'instagram':
        return Instagram;
      case 'linkedin':
        return Linkedin;
      case 'youtube':
        return Youtube;
      case 'github':
        return Github;
      case 'tiktok':
        return TiktokIcon;
      default:
        return Facebook;
    }
  };

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4', className)}>
      {platforms &&
        platforms.length > 0 &&
        platforms.map((item) => (
          <SocialMediaLink
            key={item.platform}
            platform={item.platform}
            url={item.url}
            icon={getIconForPlatform(item.platform)}
            size={size}
          />
        ))}
    </div>
  );
}
