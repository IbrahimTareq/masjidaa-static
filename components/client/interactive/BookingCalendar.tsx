"use client";

import React, { useState, useMemo } from "react";
import { Tables } from "@/database.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDateTimeConfig } from "@/context/dateTimeContext";

interface BookingTypeForCalendar {
  min_advance_booking_hours?: number | null;
  max_advance_booking_days?: number | null;
}

interface BookingCalendarProps {
  availabilities: Tables<"booking_availabilities">[];
  existingBookings: Tables<"bookings">[];
  blackouts: Tables<"booking_blackouts">[];
  onDateSelect: (date: string) => void;
  timezone?: string;
  bookingType: BookingTypeForCalendar;
}

interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasAvailability: boolean;
  isSelectable: boolean;
  hasBookings: boolean;
  isBlackedOut: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availabilities,
  existingBookings,
  blackouts,
  onDateSelect,
  timezone = 'UTC',
  bookingType,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { timeZone } = useDateTimeConfig();

  // Calculate date boundaries using context timezone
  const now = new Date();
  const nowInMasjidTz = new Date(now.toLocaleString('en-US', { timeZone }));

  // For calendar display, we need to determine if ANY time slots on a date could be available
  // So we check if the minimum advance booking time extends beyond the start of the next day
  const minAdvanceHours = bookingType.min_advance_booking_hours || 0;
  const minAdvanceMs = minAdvanceHours * 60 * 60 * 1000;
  const earliestBookingTime = new Date(nowInMasjidTz.getTime() + minAdvanceMs);

  // For the calendar, show a date as available if the date is >= the date of earliest booking time
  // The actual time slot filtering will happen in the time picker
  const minDate = new Date(earliestBookingTime);
  minDate.setHours(0, 0, 0, 0); // Set to start of day for date comparison

  // Create today's date at midnight for max date calculation
  const todayInMasjidTz = new Date(nowInMasjidTz);
  todayInMasjidTz.setHours(0, 0, 0, 0);

  const maxDate = bookingType.max_advance_booking_days
    ? new Date(todayInMasjidTz.getTime() + (bookingType.max_advance_booking_days * 24 * 60 * 60 * 1000))
    : new Date(todayInMasjidTz.getTime() + (90 * 24 * 60 * 60 * 1000)); // Default 90 days

  // Get available days of week
  const availableDays = useMemo(() => {
    const days = new Set<string>();
    availabilities.forEach(availability => {
      if (availability.day_of_week) {
        days.add(availability.day_of_week);
      }
    });
    return days;
  }, [availabilities]);

  // Get days with existing bookings
  const daysWithBookings = useMemo(() => {
    const days = new Set<string>();
    existingBookings.forEach(booking => {
      if (booking.booking_date && ['pending', 'confirmed'].includes(booking.status || '')) {
        days.add(booking.booking_date);
      }
    });
    return days;
  }, [existingBookings]);

  // Get blackout days
  const blackoutDays = useMemo(() => {
    const days = new Set<string>();
    blackouts.forEach(blackout => {
      if (blackout.start_date && blackout.end_date) {
        // Generate all dates in the blackout range
        const startDate = new Date(blackout.start_date);
        const endDate = new Date(blackout.end_date);
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const dateString = `${year}-${month}-${day}`;
          days.add(dateString);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return days;
  }, [blackouts]);

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Start from the Sunday before first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // End on the Saturday after last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      // Generate local date string to avoid timezone shifts
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const dayOfWeek = current.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      const isCurrentMonth = current.getMonth() === currentDate.getMonth();
      const isToday = current.toDateString() === todayInMasjidTz.toDateString();
      const hasAvailability = availableDays.has(dayOfWeek);
      const hasBookings = daysWithBookings.has(dateString);
      const isBlackedOut = blackoutDays.has(dateString);

      // Check if date is selectable
      const isSelectable =
        isCurrentMonth &&
        current >= minDate &&
        current <= maxDate &&
        hasAvailability &&
        !isBlackedOut;

      days.push({
        date: new Date(current),
        dateString,
        isCurrentMonth,
        isToday,
        hasAvailability,
        isSelectable,
        hasBookings,
        isBlackedOut,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentDate, availableDays, daysWithBookings, blackoutDays, minDate, maxDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isSelectable) {
      onDateSelect(day.dateString);
    }
  };

  const getDayClasses = (day: CalendarDay): string => {
    const baseClasses = "h-10 w-10 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer";

    if (!day.isCurrentMonth) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`;
    }

    if (!day.isSelectable) {
      if (day.isBlackedOut) {
        return `${baseClasses} text-gray-300 cursor-not-allowed`;
      } else if (day.hasAvailability) {
        return `${baseClasses} text-gray-400 cursor-not-allowed`;
      } else {
        return `${baseClasses} text-gray-400 cursor-not-allowed`;
      }
    }

    if (day.isToday) {
      return `${baseClasses} bg-theme text-white hover:bg-theme-accent`;
    }

    return `${baseClasses} text-gray-900 hover:bg-gray-100 border border-gray-200`;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-md mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={currentDate.getMonth() === todayInMasjidTz.getMonth() && currentDate.getFullYear() === todayInMasjidTz.getFullYear()}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>

        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div key={index} className="relative">
            <div
              className={getDayClasses(day)}
              onClick={() => handleDateClick(day)}
            >
              {day.date.getDate()}
            </div>

            {/* Available date indicator */}
            {day.isCurrentMonth && day.isSelectable && !day.isToday && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-theme rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2 text-xs text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-theme rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;