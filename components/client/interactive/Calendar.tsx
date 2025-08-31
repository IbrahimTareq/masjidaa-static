"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  EventClickArg,
  EventHoveringArg,
  EventContentArg,
  EventApi,
  DayCellContentArg,
} from "@fullcalendar/core";
import { useDateTimeFormat } from "@/hooks/useDateTimeFormat";
import { useMasjidContext } from "@/context/masjidContext";

// Types
export interface CalendarEvent {
  id: string;
  linkId: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  description?: string;
  location?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  height?: string | number;
  headerToolbar?: {
    left?: string;
    center?: string;
    right?: string;
  };
  onEventClick?: (info: { event: { id: string; title: string } }) => void;
  showHijriDate?: boolean;
}

// Constants
const DEFAULT_HEADER_TOOLBAR = {
  left: "prev,next today",
  center: "title",
  right: "",
};

const EVENT_TIME_FORMAT = {
  hour: "numeric" as const,
  minute: "2-digit" as const,
  meridiem: "short" as const,
};

// Utility Functions
const createTooltipContent = (event: EventApi): string => {
  const date = event.start?.toLocaleDateString() || "N/A";

  // Check if event is all-day or has no specific time
  const isAllDay = event.allDay || !event.start || event.start.getHours() === 0 && event.start.getMinutes() === 0;
  
  const timeSection = !isAllDay 
    ? `<p class="text-xs text-gray-300 mb-1">
        <span class="font-medium">Time:</span> ${event.start?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) || "N/A"}
      </p>`
    : "";

  const description = event.extendedProps.description
    ? `<p class="text-xs text-gray-300 mb-1"><span class="font-medium">Description:</span> ${event.extendedProps.description}</p>`
    : "";

  const location = event.extendedProps.location
    ? `<p class="text-xs text-gray-300"><span class="font-medium">Location:</span> ${event.extendedProps.location}</p>`
    : "";

  return `
    <div class="bg-gray-900 text-white p-3 rounded-lg shadow-lg max-w-xs">
      <h3 class="font-semibold text-sm mb-1">${event.title}</h3>
      <p class="text-xs text-gray-300 mb-1">
        <span class="font-medium">Date:</span> ${date}
      </p>
      ${timeSection}
      ${description}
      ${location}
    </div>
  `;
};

const createTooltipElement = (
  event: EventApi,
  element: HTMLElement
): HTMLDivElement => {
  const tooltip = document.createElement("div");
  tooltip.innerHTML = createTooltipContent(event);
  tooltip.className = "absolute z-50 pointer-events-none";
  tooltip.id = `tooltip-${event.id}`;

  // Position tooltip
  const rect = element.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

  return tooltip;
};

const applyHoverEffect = (element: HTMLElement): void => {
  element.style.transform = "scale(1.02)";
  element.style.transition = "transform 0.2s ease";
  element.style.zIndex = "10";
  element.style.cursor = "pointer";
};

const removeHoverEffect = (element: HTMLElement): void => {
  element.style.transform = "";
  element.style.zIndex = "";
};

const removeTooltip = (eventId: string): void => {
  const tooltip = document.getElementById(`tooltip-${eventId}`);
  tooltip?.remove();
};

// Main Component
const Calendar: React.FC<CalendarProps> = ({
  events = [],
  height = "auto",
  headerToolbar = DEFAULT_HEADER_TOOLBAR,
  onEventClick,
  showHijriDate = false,
}) => {
  const masjid = useMasjidContext();
  const { hijriDate } = useDateTimeFormat();

  // Event Handlers
  const handleEventClick = (clickInfo: EventClickArg): void => {
    const eventLinkId = clickInfo.event.extendedProps.linkId;
    const eventTitle = clickInfo.event.title;

    const eventUrl = `/${masjid?.slug}/event/${eventLinkId}`;
    window.open(eventUrl, "_blank");

    // Call provided callback if exists
    onEventClick?.({ event: { id: eventLinkId, title: eventTitle } });
  };

  const handleEventMouseEnter = (mouseEnterInfo: EventHoveringArg): void => {
    const { event, el: element } = mouseEnterInfo;

    // Create and show tooltip
    const tooltip = createTooltipElement(event, element);
    document.body.appendChild(tooltip);

    // Apply hover effect
    applyHoverEffect(element);
  };

  const handleEventMouseLeave = (mouseLeaveInfo: EventHoveringArg): void => {
    const { event, el: element } = mouseLeaveInfo;

    // Remove tooltip and hover effect
    removeTooltip(event.id);
    removeHoverEffect(element);
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div className="p-1">
      <div className="font-medium text-xs truncate">
        {eventInfo.event.title}
      </div>
      {eventInfo.timeText && (
        <div className="text-xs opacity-75">{eventInfo.timeText}</div>
      )}
    </div>
  );

  // Custom day cell renderer
  const renderDayCell = (info: DayCellContentArg) => {
    const date = info.date;

    if (!showHijriDate) {
      return (
        <div className="fc-daygrid-day-frame fc-scrollgrid-sync-inner">
          <div className="fc-daygrid-day-top">
            <span className="fc-daygrid-day-number">{date.getDate()}</span>
          </div>
        </div>
      );
    }

    const hijriDateString = hijriDate(date.toISOString());
    const [hijriDay] = hijriDateString.split(" ");

    return (
      <div className="fc-daygrid-day-frame fc-scrollgrid-sync-inner">
        <div className="fc-daygrid-day-top">
          <span className="fc-daygrid-day-number">
            {date.getDate()} <span className="text-gray-500">({hijriDay})</span>
          </span>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTitle = (dateInfo: any) => {
    const date = new Date(dateInfo.date.marker);
    const gregorianMonth = date.toLocaleString("en-US", { month: "long" });
    const gregorianYear = date.getFullYear();
    const hijriDateString = hijriDate(date.toISOString());
    const [, hijriMonth, hijriYear] = hijriDateString.split(" ");

    if (!showHijriDate) {
      return `${gregorianMonth} ${gregorianYear}`;
    }

    return `${gregorianMonth} ${gregorianYear} (${hijriMonth} ${hijriYear})`;
  };

  // Render
  return (
    <div className="w-full">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height={height}
        headerToolbar={headerToolbar}
        events={events}
        editable={false}
        selectable={false}
        dayMaxEvents={3}
        weekends={true}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        eventContent={renderEventContent}
        eventClassNames="cursor-pointer hover:opacity-90 transition-opacity bg-theme border-theme"
        dayCellClassNames="hover:bg-gray-50 transition-colors"
        aspectRatio={1.35}
        eventDisplay="block"
        displayEventTime={true}
        eventTimeFormat={EVENT_TIME_FORMAT}
        dayCellContent={renderDayCell}
        titleFormat={formatTitle}
      />
    </div>
  );
};

export default Calendar;
