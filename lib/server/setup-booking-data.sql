-- Sample Booking System Setup Script
-- Replace 'your-masjid-id-here' with your actual masjid ID

-- 1. Create Imam Consultation booking type
INSERT INTO booking_types (
  id,
  masjid_id,
  name,
  description,
  duration_minutes,
  buffer_minutes,
  price,
  is_active,
  requires_approval,
  min_advance_booking_hours,
  max_advance_booking_days,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'your-masjid-id-here', -- Replace with your masjid ID
  'Imam Consultation',
  'Private consultation with the imam for religious guidance, marriage counseling, and spiritual support.',
  60,
  15,
  NULL, -- Free service
  true,
  true, -- Requires approval
  24, -- Must book at least 24 hours in advance
  30, -- Can book up to 30 days in advance
  now(),
  now()
);

-- 2. Create Hall Rental booking type
INSERT INTO booking_types (
  id,
  masjid_id,
  name,
  description,
  duration_minutes,
  buffer_minutes,
  price,
  is_active,
  requires_approval,
  min_advance_booking_hours,
  max_advance_booking_days,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'your-masjid-id-here', -- Replace with your masjid ID
  'Hall Rental',
  'Rent the main hall or community center for events, meetings, and celebrations.',
  120,
  30,
  50.00,
  true,
  true, -- Requires approval
  48, -- Must book at least 48 hours in advance
  60, -- Can book up to 60 days in advance
  now(),
  now()
);

-- 3. Add availability schedules for Imam Consultations
-- Get the booking type ID first (replace in the WHERE clause)
-- Weekdays 10 AM - 4 PM for Imam Consultations

INSERT INTO booking_availabilities (
  id,
  booking_type_id,
  day_of_week,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'monday'::day_of_week,
  '10:00',
  '16:00',
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.name = 'Imam Consultation' AND bt.masjid_id = 'your-masjid-id-here';

INSERT INTO booking_availabilities (
  id,
  booking_type_id,
  day_of_week,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'tuesday'::day_of_week,
  '10:00',
  '16:00',
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.name = 'Imam Consultation' AND bt.masjid_id = 'your-masjid-id-here';

INSERT INTO booking_availabilities (
  id,
  booking_type_id,
  day_of_week,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'wednesday'::day_of_week,
  '10:00',
  '16:00',
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.name = 'Imam Consultation' AND bt.masjid_id = 'your-masjid-id-here';

INSERT INTO booking_availabilities (
  id,
  booking_type_id,
  day_of_week,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'thursday'::day_of_week,
  '10:00',
  '16:00',
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.name = 'Imam Consultation' AND bt.masjid_id = 'your-masjid-id-here';

-- 4. Add availability schedules for Hall Rentals
-- Fridays, Saturdays, Sundays for Hall Rentals

INSERT INTO booking_availabilities (
  id,
  booking_type_id,
  day_of_week,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'friday'::day_of_week,
  '14:00',
  '20:00',
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.name = 'Hall Rental' AND bt.masjid_id = 'your-masjid-id-here';

INSERT INTO booking_availabilities (
  id,
  booking_type_id,
  day_of_week,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'saturday'::day_of_week,
  '10:00',
  '18:00',
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.name = 'Hall Rental' AND bt.masjid_id = 'your-masjid-id-here';

INSERT INTO booking_availabilities (
  id,
  booking_type_id,
  day_of_week,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'sunday'::day_of_week,
  '10:00',
  '16:00',
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.name = 'Hall Rental' AND bt.masjid_id = 'your-masjid-id-here';

-- 5. Sample blackout for Eid (optional - adjust dates as needed)
/*
INSERT INTO booking_blackouts (
  id,
  booking_type_id,
  title,
  description,
  start_date,
  end_date,
  start_time,
  end_time,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  bt.id,
  'Eid Holiday',
  'Masjid closed for Eid celebrations',
  '2024-04-10', -- Adjust date
  '2024-04-12', -- Adjust date
  NULL, -- All day
  NULL, -- All day
  true,
  now(),
  now()
FROM booking_types bt
WHERE bt.masjid_id = 'your-masjid-id-here';
*/