CREATE TABLE eg_holiday (
	id BIGINT NOT NULL,
	calendarYear INTEGER NOT NULL,
	name CHARACTER VARYING(200) NOT NULL,
	applicableOn DATE NOT NULL,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_eg_holiday PRIMARY KEY (id),
	CONSTRAINT fk_eg_holiday_calendarYear FOREIGN KEY (calendarYear)
		REFERENCES eg_calendarYear(name)
);

CREATE SEQUENCE seq_eg_holiday
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;