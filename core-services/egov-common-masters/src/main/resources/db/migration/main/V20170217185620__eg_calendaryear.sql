CREATE TABLE eg_calendarYear (
	id BIGINT NOT NULL,
	name INTEGER NOT NULL,
	startDate DATE NOT NULL,
	endDate DATE NOT NULL,
	active BOOLEAN NOT NULL,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_eg_calendarYear PRIMARY KEY (id),
	CONSTRAINT uk_eg_calendarYear_name UNIQUE (name)
);

CREATE SEQUENCE seq_eg_calendarYear
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;