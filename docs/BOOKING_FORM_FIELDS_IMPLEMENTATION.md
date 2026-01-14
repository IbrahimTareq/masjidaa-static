# Booking Form Fields Implementation

## Overview
This document describes the implementation of additional form fields for booking types, similar to the event registration form functionality.

## Changes Made

### 1. New Service: `bookingForm.ts`
**Location:** `lib/server/services/bookingForm.ts`

Created a new service to fetch booking forms from the database:
```typescript
export async function getBookingFormById(
  id: string
): Promise<Tables<"booking_forms"> | null>
```

This service fetches booking form schemas from the `booking_forms` table using the form ID.

### 2. Updated Booking Page Server Component
**Location:** `app/[slug]/bookings/[bookingTypeId]/book/page.tsx`

**Changes:**
- Added import for `getBookingFormById` service
- Added parallel fetching of booking form when `booking_form_id` exists on the booking type
- Pass `bookingForm` prop to the `BookingClient` component

```typescript
const [availabilities, location, blackouts, existingBookings, bankAccount, bookingForm] = await Promise.all([
  // ... other fetches
  bookingType.booking_form_id ? getBookingFormById(bookingType.booking_form_id) : Promise.resolve(null),
]);
```

### 3. Updated Booking Client Component
**Location:** `app/[slug]/bookings/[bookingTypeId]/book/booking.tsx`

**Major Changes:**

#### a. Added Dependencies
- Imported `Form` from `@rjsf/core`
- Imported `validator` from `@rjsf/validator-ajv8`

#### b. Added Custom Date Widget
Created a `DateWidget` component that provides day/month/year dropdowns for date fields, matching the event registration implementation.

#### c. Updated Props Interface
Added `bookingForm` prop to `BookingClientProps`:
```typescript
interface BookingClientProps {
  // ... existing props
  bookingForm?: Tables<"booking_forms"> | null;
}
```

#### d. Updated State Management
- Modified `formData` state to accept additional fields: `BookingFormData & Record<string, any>`
- Added `additionalFormData` state to track custom form fields separately

#### e. Updated Details Step Rendering
The details step now renders:
1. **Standard Booking Form:** Always renders the existing `BookingForm` component with base fields:
   - Name
   - Email
   - Phone
   - Notes
   - Terms and conditions checkbox

2. **Additional Custom Fields:** When `bookingForm?.schema` exists, appends a separate section below with:
   - "Additional Information" heading
   - Custom fields from the booking form schema
   - Custom date widget for date fields
   - Proper form validation using RJSF validator
   - Single submit button at the bottom

When additional fields are present:
- The standard form's submit button is hidden via `hideSubmitButton` prop
- The additional fields form handles the final submission
- Both forms' data is merged before submission

### 4. Updated BookingForm Component
**Location:** `components/client/interactive/BookingForm.tsx`

**Changes:**
- Added `hideSubmitButton` prop to conditionally hide the submit button and terms text
- When `hideSubmitButton={true}`, the form only collects data without showing submit controls
- This allows the additional fields form to handle the final submission

### 5. Updated Booking Actions
**Location:** `lib/server/actions/bookingActions.ts`

**Changes:**

#### a. Updated Function Signature
Modified `submitBookingAction` to accept additional form fields:
```typescript
export async function submitBookingAction(
  formData: BookingFormData & {
    booking_type_id: string;
    masjid_id: string;
    status?: "pending" | "confirmed";
    [key: string]: any; // Allow additional form fields
  }
): Promise<BookingActionResult>
```

#### b. Extract and Store Additional Fields
Added logic to extract additional form fields (excluding base booking fields) and store them in the `data` JSON field:

```typescript
// Extract additional form fields
const baseFields = [
  'booking_type_id', 'masjid_id', 'status', 'booking_date', 
  'start_time', 'end_time', 'name', 'email', 'phone', 'notes'
];
const additionalFields: Record<string, any> = {};
Object.keys(formData).forEach(key => {
  if (!baseFields.includes(key)) {
    additionalFields[key] = formData[key];
  }
});

// Store in booking data
data: {
  name: sanitizedData.name,
  email: sanitizedData.email,
  phone: sanitizedData.phone,
  notes: sanitizedData.notes || null,
  ...additionalFields, // Include all additional form fields
},
```

## Database Schema

The implementation leverages existing database tables:

### `booking_types` Table
- Has a `booking_form_id` field (nullable) that links to `booking_forms`

### `booking_forms` Table
- `id`: UUID
- `masjid_id`: UUID (foreign key to masjids)
- `name`: string
- `schema`: JSON (JSON Schema for form fields)
- `ui_schema`: JSON (nullable, RJSF UI Schema for customization)
- `created_at`: timestamp
- `updated_at`: timestamp

### `bookings` Table
- Has a `data` field of type JSON that stores all form data including additional fields
- Has a `booking_form_id` field (nullable) that references which form was used

## How It Works

1. **Admin creates a booking form** in the admin panel with custom fields defined in JSON Schema format
2. **Admin links the form** to a booking type via `booking_form_id`
3. **User navigates** to the booking flow for that booking type
4. **Server fetches** the booking form if `booking_form_id` exists
5. **Client renders** the form in two sections:
   - Standard fields (name, email, phone, notes)
   - Additional custom fields (if booking form exists)
6. **User fills out** all required fields
7. **On submit**, all data (base + custom) is merged and sent to the server
8. **Server stores** the data in the `bookings.data` JSON field
9. **Admin can view** all submitted data including custom fields

## Visual Layout

### Without Custom Form
```
┌─────────────────────────────────┐
│ Your Details                    │
├─────────────────────────────────┤
│ Booking Summary                 │
│ - Date, Time, Service           │
├─────────────────────────────────┤
│ Contact Information             │
│ - Name                          │
│ - Email                         │
│ - Phone                         │
│ - Additional Notes              │
│ - Terms Checkbox                │
│                                 │
│ [Submit Button]                 │
└─────────────────────────────────┘
```

### With Custom Form
```
┌─────────────────────────────────┐
│ Your Details                    │
├─────────────────────────────────┤
│ Booking Summary                 │
│ - Date, Time, Service           │
├─────────────────────────────────┤
│ Contact Information             │
│ - Name                          │
│ - Email                         │
│ - Phone                         │
│ - Additional Notes              │
│ - Terms Checkbox                │
├─────────────────────────────────┤
│ Additional Information          │
│ - Custom Field 1                │
│ - Custom Field 2                │
│ - Custom Field 3                │
│ ...                             │
├─────────────────────────────────┤
│ Payment Required (if paid)      │
│ - Amount Display                │
├─────────────────────────────────┤
│ [Submit Button]                 │
│                                 │
│ Terms text                      │
└─────────────────────────────────┘
```

The layout creates a seamless, single-form experience where:
- Contact Information section appears first
- Additional Information section appears immediately below
- Both sections are part of the same form submission
- Single submit button at the bottom handles all data

## Features

- ✅ Dynamic form fields based on JSON Schema
- ✅ Custom date widget with dropdowns
- ✅ Form validation using RJSF validator
- ✅ Seamless integration with existing booking flow
- ✅ Backward compatible (works without custom forms)
- ✅ Stores additional fields in JSON format
- ✅ Supports all RJSF field types (text, number, date, select, etc.)
- ✅ Custom UI schema support for field customization

## Testing

To test the implementation:

1. Create a booking form in the admin panel with custom fields
2. Link the form to a booking type
3. Navigate to the booking flow for that type
4. Verify that custom fields appear in the form
5. Fill out and submit the form
6. Check that the booking is created with all data stored in the `data` field

## Example Custom Form Schema

```json
{
  "type": "object",
  "required": ["numberOfPeople", "preferredDate"],
  "properties": {
    "numberOfPeople": {
      "type": "number",
      "title": "Number of People",
      "minimum": 1
    },
    "preferredDate": {
      "type": "string",
      "title": "Preferred Date",
      "format": "date"
    },
    "specialRequirements": {
      "type": "string",
      "title": "Special Requirements"
    }
  }
}
```

## Styling

The implementation uses existing RJSF styles from `app/globals.css` that match the application's theme.

