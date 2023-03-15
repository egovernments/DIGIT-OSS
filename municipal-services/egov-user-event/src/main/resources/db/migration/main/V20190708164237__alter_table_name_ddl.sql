ALTER TABLE eg_men_events RENAME TO eg_usrevents_events;
ALTER TABLE eg_men_recepnt_event_registry RENAME TO eg_usrevents_recepnt_event_registry;
ALTER TABLE eg_men_user_llt RENAME COLUMN lastlogintime TO lastaccesstime;
ALTER TABLE eg_men_user_llt RENAME TO eg_usrevents_user_lat;