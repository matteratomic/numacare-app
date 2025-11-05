export const formatRelativeTime = (isoString: string): string => {
  const target = new Date(isoString).getTime();
  const delta = Date.now() - target;

  if (Number.isNaN(target)) {
    return 'unknown';
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (delta < minute) {
    return 'just now';
  }

  if (delta < hour) {
    const minutes = Math.round(delta / minute);
    return `${minutes} min ago`;
  }

  if (delta < day) {
    const hours = Math.round(delta / hour);
    return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.round(delta / day);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};
