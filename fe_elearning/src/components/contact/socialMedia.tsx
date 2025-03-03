import React from "react";

type socialMedia = {
  url: string;
  icon: React.ComponentType<any>; // Type for an icon component
  sizeIcon?: number;
  color?: string;
  className?: string; // Additional class name for the social media container
};
const SocialMedia: React.FC<socialMedia> = ({
  url,
  icon: Icon,
  sizeIcon,
  color,
  className,
}) => {
  return (
    <div className="card">
      <a
        className={`socialContainer ${className}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        <Icon
          color={color ? color : "#F9F9F7"}
          size={sizeIcon}
          className={`socialSvg ${className}`}
        />
      </a>
    </div>
  );
};

export default SocialMedia;
