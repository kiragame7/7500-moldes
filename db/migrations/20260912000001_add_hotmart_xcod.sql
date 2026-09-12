alter table conversion_events
  add column hotmart_xcod varchar(255) null after external_id;

create index conversion_events_hotmart_xcod_idx
  on conversion_events (hotmart_xcod, event_name, event_time);
