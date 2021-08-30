CREATE INDEX on_eventtype ON eg_usrevents_events ("eventtype");
CREATE INDEX on_status ON eg_usrevents_events ("status");
CREATE INDEX on_postedby ON eg_usrevents_events ("postedby");
CREATE INDEX on_tenantid ON eg_usrevents_events ("tenantid");

CREATE INDEX on_recepient ON eg_usrevents_recepnt_event_registry ("recepient");