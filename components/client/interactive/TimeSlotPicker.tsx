"use client";

import { Tables } from "@/database.types";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { CheckCircle2, Clock } from "lucide-react";
import React from "react";

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  date: string;
  slots: TimeSlot[];
  loading: boolean;
  onSlotSelect: (slot: TimeSlot) => void;
  bookingType: Tables<"booking_types">;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  date,
  slots,
  loading,
  onSlotSelect,
  bookingType,
  timezone,
}) => {
  const { formatTime } = useDateTimeFormat();
  // Group slots by time of day
  const groupedSlots = React.useMemo(() => {
    const groups: {
      morning: TimeSlot[];
      afternoon: TimeSlot[];
      evening: TimeSlot[];
    } = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    slots.forEach((slot) => {
      const hour = parseInt(slot.start_time.split(":")[0]);

      if (hour < 12) {
        groups.morning.push(slot);
      } else if (hour < 17) {
        groups.afternoon.push(slot);
      } else {
        groups.evening.push(slot);
      }
    });

    return groups;
  }, [slots]);

  const availableSlots = slots.filter((slot) => slot.available);
  const unavailableSlots = slots.filter((slot) => !slot.available);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme mx-auto mb-4"></div>
        <p className="text-gray-600">Loading available times...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No time slots available
        </h3>
        <p className="text-gray-600">
          There are no available time slots for the selected date. Please choose
          a different date.
        </p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          All slots are booked
        </h3>
        <p className="text-gray-600 mb-6">
          All time slots for this date are currently unavailable. Please choose
          a different date.
        </p>

        {unavailableSlots.length > 0 && (
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Unavailable times:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {unavailableSlots.map((slot, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-center text-sm text-gray-500"
                >
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderTimeGroup = (groupName: string, groupSlots: TimeSlot[]) => {
    const availableGroupSlots = groupSlots.filter((slot) => slot.available);

    if (availableGroupSlots.length === 0) return null;

    return (
      <div key={groupName} className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
          {groupName}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableGroupSlots.map((slot, index) => (
            <TimeSlotButton
              key={`${groupName}-${index}`}
              slot={slot}
              onSelect={onSlotSelect}
              bookingType={bookingType}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm">
            {availableSlots.length} time slot
            {availableSlots.length !== 1 ? "s" : ""} available
          </span>
        </div>

        <div className="text-sm text-gray-500">
          Duration: {bookingType.duration_minutes} minutes
        </div>
      </div>

      <div>
        {renderTimeGroup("morning", groupedSlots.morning)}
        {renderTimeGroup("afternoon", groupedSlots.afternoon)}
        {renderTimeGroup("evening", groupedSlots.evening)}
      </div>

      {/* Show unavailable slots if any */}
      {unavailableSlots.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Unavailable times ({unavailableSlots.length}):
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {unavailableSlots.map((slot, index) => (
              <div
                key={`unavailable-${index}`}
                className="p-2 bg-gray-100 border border-gray-200 rounded-lg text-center text-xs text-gray-500"
              >
                {formatTime(slot.start_time)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface TimeSlotButtonProps {
  slot: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
  bookingType: Tables<"booking_types">;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  slot,
  onSelect,
  bookingType,
}) => {
  const { formatTime } = useDateTimeFormat();
  const handleClick = () => {
    onSelect(slot);
  };

  return (
    <button
      onClick={handleClick}
      className="p-3 bg-white border border-gray-200 rounded-lg hover:border-theme hover:bg-theme/5 transition-colors text-center group cursor-pointer"
    >
      <div className="font-medium text-gray-900 group-hover:text-theme">
        {formatTime(slot.start_time)}
      </div>
    </button>
  );
};

export default TimeSlotPicker;
