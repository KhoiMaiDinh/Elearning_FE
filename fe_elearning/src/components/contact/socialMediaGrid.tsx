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

// Define color mapping for each platform with inline styles
const platformStyles = {
  facebook: {
    background: '#1877F2', // Facebook blue chính thức
    shadow: '0 4px 15px rgba(24, 119, 242, 0.3)',
    hoverShadow: '0 8px 25px rgba(24, 119, 242, 0.4)',
  },
  twitter: {
    background: '#1DA1F2', // Twitter blue chính thức
    shadow: '0 4px 15px rgba(29, 161, 242, 0.3)',
    hoverShadow: '0 8px 25px rgba(29, 161, 242, 0.4)',
  },
  instagram: {
    background:
      'linear-gradient(45deg, #FFDC80 0%, #FCAF45 15%, #F77737 30%, #F56040 45%, #FD1D1D 60%, #E1306C 75%, #C13584 90%, #833AB4 100%)', // Instagram gradient với nhiều ánh tím đỏ
    shadow: '0 4px 15px rgba(193, 53, 132, 0.4)',
    hoverShadow: '0 8px 25px rgba(193, 53, 132, 0.5)',
  },
  linkedin: {
    background: '#0A66C2', // LinkedIn blue mới (2019+)
    shadow: '0 4px 15px rgba(10, 102, 194, 0.3)',
    hoverShadow: '0 8px 25px rgba(10, 102, 194, 0.4)',
  },
  youtube: {
    background: '#FF0000', // YouTube red chính thức
    shadow: '0 4px 15px rgba(255, 0, 0, 0.3)',
    hoverShadow: '0 8px 25px rgba(255, 0, 0, 0.4)',
  },
  github: {
    background: '#181717', // GitHub dark chính thức
    shadow: '0 4px 15px rgba(24, 23, 23, 0.3)',
    hoverShadow: '0 8px 25px rgba(24, 23, 23, 0.4)',
  },
  tiktok: {
    background: 'linear-gradient(45deg, #000000 0%, #FF0050 100%)', // TikTok black với accent pink
    shadow: '0 4px 15px rgba(255, 0, 80, 0.3)',
    hoverShadow: '0 8px 25px rgba(255, 0, 80, 0.4)',
  },
} as const;

export function SocialMediaGrid({
  className,
  showLabels = false,
  size = 28,
  platforms = [
    { platform: 'facebook', url: 'https://facebook.com/' },
    { platform: 'twitter', url: 'https://twitter.com/' },
    { platform: 'instagram', url: 'https://instagram.com/' },
    { platform: 'linkedin', url: 'https://linkedin.com/' },
    { platform: 'youtube', url: 'https://youtube.com/' },
    { platform: 'github', url: 'https://github.com/' },
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

  const getStyleForPlatform = (platform: SocialPlatform) => {
    return platformStyles[platform] || platformStyles.facebook;
  };

  // Calculate optimal layout based on number of platforms
  const getLayoutClasses = (count: number) => {
    if (count <= 2) return 'max-w-md justify-center';
    if (count <= 4) return 'max-w-lg justify-center';
    if (count <= 6) return 'max-w-2xl justify-center';
    return 'max-w-4xl justify-center';
  };

  const platformCount = platforms?.length || 0;

  return (
    <div className={cn('w-full mx-auto', className)}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Theo dõi chúng tôi
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Theo dõi chúng tôi trên các nền tảng mạng xã hội
        </p>
      </div>

      {/* Social Icons Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div
          className={cn(
            'flex flex-wrap gap-6 items-center mx-auto',
            getLayoutClasses(platformCount)
          )}
        >
          {platforms &&
            platforms.length > 0 &&
            platforms.map((item) => {
              const IconComponent = getIconForPlatform(item.platform);
              const platformStyle = getStyleForPlatform(item.platform);

              return (
                <div
                  key={item.platform}
                  className="flex flex-col items-center justify-center group"
                  style={{
                    minWidth: '80px', // Ensure consistent spacing
                  }}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border border-white/30"
                    style={{
                      background: platformStyle.background,
                      boxShadow: platformStyle.shadow,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = platformStyle.hoverShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = platformStyle.shadow;
                    }}
                    title={item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                  >
                    <IconComponent size={size} className="text-white relative z-10" />
                  </a>

                  {/* Platform name */}
                  <span className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 text-center">
                    {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="flex justify-center mt-6">
        <div
          className="w-16 h-1 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
          }}
        ></div>
      </div>
    </div>
  );
}
