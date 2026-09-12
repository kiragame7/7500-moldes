-- Run this migration after confirming there are no duplicate event_id rows.
-- It repairs databases created before the original CREATE TABLE migration.
alter table conversion_events
  add unique key conversion_events_event_id_uq (event_id);
