"use client";

import { Tables } from "@/database.types";
import { DayCellContentArg, DayHeaderContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import React, { useRef, useState } from "react";

interface BookingCalendarProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (time: string, date: Date) => void;
  onBookingSubmit?: (bookingData: BookingFormData) => void;
  eventTitle?: string;
  eventDescription?: string;
  eventHost?: string;
  eventDuration?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingFormData {
  name: string;
  email: string;
  notes: string;
  date: Date;
  time: string;
}

// Dummy data for available time slots
const generateTimeSlots = (date: Date) => {
  return [
    { time: "10:00am", available: true },
    { time: "11:00am", available: true },
    { time: "12:00pm", available: true },
    { time: "1:00pm", available: true },
    { time: "2:00pm", available: true },
    { time: "3:00pm", available: true },
    { time: "4:00pm", available: true },
    { time: "5:00pm", available: true },
    { time: "6:00pm", available: true },
    { time: "7:00pm", available: true },
  ].map(slot => ({
    ...slot,
    // Randomly mark some slots as unavailable
    available: Math.random() > 0.3
  }));
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  initialDate = new Date(),
  onDateSelect,
  onTimeSelect,
  onBookingSubmit,
  eventTitle = "Imaam Consultation",
  eventDescription = "During this demo, we'll walk you through all the features of our platform and show you how they work. You're welcome to ask questions at any time.",
  eventDuration = "1h",
}) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>(generateTimeSlots(initialDate));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    notes: "",
    date: initialDate,
    time: "",
  });
  
  // Format date as "Sun 05" format
  const formatShortDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate().toString().padStart(2, '0');
    return `${dayName} ${dayNumber}`;
  };

  // Handle date click
  const handleDateClick = (arg: { date: Date }) => {
    setSelectedDate(arg.date);
    setAvailableSlots(generateTimeSlots(arg.date));
    setSelectedTime(null);
    onDateSelect?.(arg.date);
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      updateCurrentMonth(calendarApi.getDate());
    }
  };

  const handleNextMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      updateCurrentMonth(calendarApi.getDate());
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      updateCurrentMonth(calendarApi.getDate());
    }
  };

  // Update current month display
  const updateCurrentMonth = (date: Date) => {
    setCurrentMonth(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
  };

  // Handle time slot selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onTimeSelect?.(time, selectedDate);
    
    // Open booking modal
    setFormData({
      ...formData,
      date: selectedDate,
      time: time,
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookingSubmit?.(formData);
    setShowModal(false);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      notes: "",
      date: selectedDate,
      time: "",
    });
  };

  // Custom day cell renderer
  const renderDayCell = (info: DayCellContentArg) => {
    return (
      <div className="fc-daygrid-day-number">
        {info.date.getDate()}
        {info.date.getDate() === 5 && info.isToday && (
          <span className="inline-block w-1 h-1 bg-black rounded-full ml-1 align-middle"></span>
        )}
      </div>
    );
  };

  // Handle calendar view change
  const handleDatesSet = (arg: { start: Date; end: Date; view: { title: string } }) => {
    updateCurrentMonth(arg.start);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden text-black">
        <div className="flex flex-col md:flex-row">
          {/* Event Details Section */}
          <div className="md:w-1/4 p-6 md:border-r border-gray-100">
            <div className="flex items-start">              
              {/* Event Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{eventTitle}</h2>
                <p className="text-gray-600 text-sm mb-4">{eventDescription}</p>
                
                <div className="flex flex-col space-y-2 text-sm text-gray-500">
                  {/* Duration Icon */}
                  <div className="flex items-center">
                    <div className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <span>{eventDuration}</span>
                  </div>
                  
                  {/* Video Icon */}
                  <div className="flex items-center">
                    <div className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <polyline points="16 3 12 7 8 3"></polyline>
                      </svg>
                    </div>
                    <span>Cal Video</span>
                  </div>
                  
                  {/* Location Dropdown */}
                  <div className="flex items-center">
                    <div className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="11" r="3"></circle>
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
                      </svg>
                    </div>
                    <span className="flex items-center">
                      Australia/Melbourne
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="md:w-3/5 p-4 md:border-r border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">{currentMonth}</h2>
              <div className="flex space-x-2">
                <button 
                  className="p-1" 
                  aria-label="Previous month"
                  onClick={handlePrevMonth}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button 
                  className="p-1" 
                  aria-label="Today"
                  onClick={handleToday}
                >
                  <span className="text-sm font-medium">Today</span>
                </button>
                <button 
                  className="p-1" 
                  aria-label="Next month"
                  onClick={handleNextMonth}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="calendar-wrapper compact-calendar">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={selectedDate}
                headerToolbar={false}
                height="auto"
                dayHeaderFormat={{ weekday: 'short' }}
                dayHeaderContent={(arg: DayHeaderContentArg) => {
                  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                  return days[arg.date.getDay()];
                }}
                dayCellContent={renderDayCell}
                dateClick={handleDateClick}
                fixedWeekCount={false}
                showNonCurrentDates={true}
                datesSet={handleDatesSet}
                dayCellClassNames={(info) => {
                  const isSelected = info.date.toDateString() === selectedDate.toDateString();
                  const isToday = info.date.toDateString() === new Date().toDateString();
                  
                  if (isSelected) return 'selected-day bg-gray-800 text-white';
                  if (isToday) return 'today';
                  return '';
                }}
              />
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="md:w-1/4 p-4">
            <div className="mb-2">
              <h2 className="text-lg font-medium">{formatShortDate(selectedDate)}</h2>
            </div>

            <div className="time-slots-grid">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  disabled={!slot.available}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  className={`py-3 px-4 rounded-lg flex items-center justify-between border ${
                    selectedTime === slot.time 
                      ? 'border-green-500 bg-green-50' 
                      : slot.available 
                        ? 'border-gray-200 hover:border-green-300' 
                        : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${slot.available ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={`${selectedTime === slot.time ? 'text-green-700' : ''}`}>
                      {slot.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Book Appointment</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Selected Date & Time:</p>
              <p className="font-medium text-black">
                {selectedDate.toLocaleDateString()} at {selectedTime}
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCalendar;