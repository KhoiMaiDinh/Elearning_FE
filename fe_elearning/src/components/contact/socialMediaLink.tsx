'use client';

import React from 'react';
import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'github';

interface SocialMediaLinkProps {
  platform: SocialPlatform;
  url: string;
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export function SocialMediaLink({
  platform,
  url,
  icon: Icon,
  size = 24,
  className,
}: SocialMediaLinkProps) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('social-link', `social-${platform}`, className)}
    >
      <div className="social-icon-wrapper">
        <Icon size={size} className="social-icon" />
      </div>
      <span className="social-platform-name">
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </span>
    </Link>
  );
}
