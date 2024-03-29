import clsx from 'clsx';
import { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(postedDate: string) {
  const now = new Date();
  const posted = new Date(postedDate);
  const timeDifference = now.getTime() - posted.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `Few seconds ago`;
  } else if (minutes === 1) {
    return '1 minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return '1 hour ago';
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days === 1) {
    return '1 day ago';
  } else {
    return `${days} days ago`;
  }
}

export function truncateMemberCount(memberCount: number): string {
  if (memberCount < 1) {
    return 'no member';
  } else if (memberCount === 1) {
    return '1 member';
  } else if (memberCount < 1000) {
    return `${memberCount} members`;
  } else if (memberCount < 10000) {
    const truncatedCount = (memberCount / 1000).toFixed(1);
    return `${truncatedCount}K members`;
  } else {
    const truncatedCount = Math.floor(memberCount / 1000);
    return `${truncatedCount}K members`;
  }
}
