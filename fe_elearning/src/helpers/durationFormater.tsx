export const formatDuration = (duration: number) => {
  const roundedDuration = Math.round(duration);
  const hours = Math.floor(roundedDuration / 3600);
  const minutes = Math.floor((roundedDuration % 3600) / 60);
  const seconds = Math.round(roundedDuration % 60);

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(' ');
};
