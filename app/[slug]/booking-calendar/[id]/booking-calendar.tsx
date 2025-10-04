"use client";

import BookingCalendar from "@/components/client/ui/Calendar";
import { Tables } from "@/database.types";
import { useState } from "react";
import "./styles.css";

interface BookingFormData {
  name: string;
  email: string;
  notes: string;
  date: Date;
  time: string;
}

export default function BookingCalendarClient({ masjid }: { masjid: Tables<"masjids"> }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingFormData | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingSubmit = (bookingData: BookingFormData) => {
    console.log("Booking submitted:", bookingData);
    setBookingDetails(bookingData);
    setBookingConfirmed(true);
    
    // In a real app, you would send this data to your API
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-8xl mx-auto">
        <div className="single-row-container">
          <BookingCalendar 
            onDateSelect={handleDateSelect} 
            onTimeSelect={handleTimeSelect}
            onBookingSubmit={handleBookingSubmit}
            eventTitle="Imaam Consultation"
            eventDescription="During this consultation, we'll discuss your needs and provide you with the best possible solution."
            eventDuration="1h"
          />
        </div>
        
        {bookingConfirmed && bookingDetails && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-800">Booking Confirmed!</h3>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-green-100 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Appointment Details</h4>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Date:</span> {bookingDetails.date.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Time:</span> {bookingDetails.time}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Name:</span> {bookingDetails.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {bookingDetails.email}
              </p>
              {bookingDetails.notes && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {bookingDetails.notes}
                </p>
              )}
            </div>
            
            <p className="text-sm text-green-700">
              A confirmation email has been sent to your email address.
            </p>
            
            <div className="mt-4">
              <button
                onClick={() => {
                  setBookingConfirmed(false);
                  setBookingDetails(null);
                }}
                className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}