'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface OpenStatusBadgeProps {
  className?: string;
  showText?: boolean;
}

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 is Sunday, 1 is Monday, etc.

interface TimeRange {
  start: string; // format: "HH:MM" in 24-hour format
  end: string; // format: "HH:MM" in 24-hour format
}

// Define the restaurant hours
const HOURS: Record<DayOfWeek, TimeRange[]> = {
  0: [
    { start: '11:30', end: '15:00' },
    { start: '17:00', end: '22:00' },
  ], // Sunday
  1: [
    { start: '11:30', end: '15:00' },
    { start: '17:00', end: '22:00' },
  ], // Monday
  2: [], // Tuesday - Closed
  3: [
    { start: '11:30', end: '15:00' },
    { start: '17:00', end: '22:00' },
  ], // Wednesday
  4: [
    { start: '11:30', end: '15:00' },
    { start: '17:00', end: '22:00' },
  ], // Thursday
  5: [
    { start: '11:30', end: '15:00' },
    { start: '17:00', end: '23:00' },
  ], // Friday
  6: [
    { start: '11:30', end: '15:00' },
    { start: '17:00', end: '23:00' },
  ], // Saturday
};

export function OpenStatusBadge({ className, showText = true }: OpenStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [timeUntilChange, setTimeUntilChange] = useState<string | null>(null);

  useEffect(() => {
    // Check if the restaurant is currently open
    function checkIfOpen() {
      const now = new Date();
      const day = now.getDay() as DayOfWeek;
      const timeRanges = HOURS[day];

      // If no time ranges for today, restaurant is closed
      if (timeRanges.length === 0) {
        setIsOpen(false);
        calculateNextOpenTime(now, day);
        return;
      }

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Check if current time falls within any of today's time ranges
      for (const range of timeRanges) {
        const [startHour, startMinute] = range.start.split(':').map(Number);
        const [endHour, endMinute] = range.end.split(':').map(Number);

        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;

        if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
          setIsOpen(true);
          calculateTimeUntilClose(now, endHour, endMinute);
          return;
        }
      }

      // If we reach here, not currently in any open time range
      setIsOpen(false);
      calculateNextOpenTime(now, day);
    }

    // Calculate time until restaurant closes
    function calculateTimeUntilClose(now: Date, endHour: number, endMinute: number) {
      const closeTime = new Date(now);
      closeTime.setHours(endHour, endMinute, 0, 0);

      const diffMs = closeTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);

      if (diffMinutes < 60) {
        setTimeUntilChange(`Closes in ${diffMinutes} min`);
      } else {
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        setTimeUntilChange(`Closes in ${hours}h ${minutes}min`);
      }
    }

    // Calculate time until restaurant opens
    function calculateNextOpenTime(now: Date, currentDay: DayOfWeek) {
      // Find the next opening time, could be later today or on a future day
      let dayToCheck: DayOfWeek = currentDay;
      let daysAhead = 0;
      let foundNextOpen = false;
      let nextOpenHour = 0;
      let nextOpenMinute = 0;

      // Check up to 7 days ahead
      while (daysAhead < 7 && !foundNextOpen) {
        const timeRanges = HOURS[dayToCheck];

        // If there are time ranges for this day
        if (timeRanges.length > 0) {
          // Check if any of today's remaining time ranges are coming up
          if (dayToCheck === currentDay) {
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            // Find the next upcoming time range for today
            for (const range of timeRanges) {
              const [startHour, startMinute] = range.start.split(':').map(Number);
              const startTimeInMinutes = startHour * 60 + startMinute;

              if (currentTimeInMinutes < startTimeInMinutes) {
                foundNextOpen = true;
                nextOpenHour = startHour;
                nextOpenMinute = startMinute;
                break;
              }
            }
          } else {
            // For future days, just take the first opening time
            const [startHour, startMinute] = timeRanges[0].start.split(':').map(Number);
            foundNextOpen = true;
            nextOpenHour = startHour;
            nextOpenMinute = startMinute;
          }
        }

        if (!foundNextOpen) {
          // Move to next day
          dayToCheck = ((dayToCheck + 1) % 7) as DayOfWeek;
          daysAhead++;
        }
      }

      if (foundNextOpen) {
        const nextOpenDate = new Date(now);
        nextOpenDate.setDate(now.getDate() + daysAhead);
        nextOpenDate.setHours(nextOpenHour, nextOpenMinute, 0, 0);

        const diffMs = nextOpenDate.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        if (daysAhead === 0 && diffMinutes < 60) {
          setTimeUntilChange(`Opens in ${diffMinutes} min`);
        } else if (daysAhead === 0) {
          const hours = Math.floor(diffMinutes / 60);
          const minutes = diffMinutes % 60;
          setTimeUntilChange(`Opens in ${hours}h ${minutes}min`);
        } else {
          // Get day name
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          setTimeUntilChange(`Opens ${dayNames[dayToCheck]} at ${formatTime(nextOpenHour, nextOpenMinute)}`);
        }
      }
    }

    function formatTime(hours: number, minutes: number): string {
      const period = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
    }

    // Check status immediately and set up an interval to check every minute
    checkIfOpen();
    const intervalId = setInterval(checkIfOpen, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Show loading state until we determine the status
  if (isOpen === null) {
    return (
      <div
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
          className
        )}>
        <div className="mr-1 h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
        Checking...
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all',
        isOpen
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200',
        className
      )}>
      <span className={cn('flex h-2 w-2 rounded-full', isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500')} />
      {showText && (
        <span className="font-medium">
          {isOpen ? 'Open Now' : 'Closed'}
          {timeUntilChange && <span className="font-normal opacity-75 ml-1">• {timeUntilChange}</span>}
        </span>
      )}
    </div>
  );
}
