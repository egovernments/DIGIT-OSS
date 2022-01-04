---------------------------- DROP FOREIGN KEYS ----------------------------

ALTER TABLE eg_holiday DROP CONSTRAINT fk_eg_holiday_calendaryear;


--------------------------- UPDATE PRIMARY KEYS ---------------------------

-- EG_CALENDARYEAR TABLE
ALTER TABLE eg_calendaryear DROP CONSTRAINT pk_eg_calendaryear;
ALTER TABLE eg_calendaryear ADD CONSTRAINT pk_eg_calendaryear PRIMARY KEY (id, tenantId);
ALTER TABLE eg_calendaryear DROP CONSTRAINT uk_eg_calendaryear_name;
ALTER TABLE eg_calendaryear ADD CONSTRAINT uk_eg_calendaryear_name_tenantId UNIQUE (name, tenantId);

-- EG_CATEGORY TABLE
ALTER TABLE eg_category DROP CONSTRAINT pk_eg_category;
ALTER TABLE eg_category ADD CONSTRAINT pk_eg_category PRIMARY KEY (id, tenantId);

-- EG_COMMUNITY TABLE
ALTER TABLE eg_community DROP CONSTRAINT pk_eg_community;
ALTER TABLE eg_community ADD CONSTRAINT pk_eg_community PRIMARY KEY (id, tenantId);

-- EG_DEPARTMENT TABLE
ALTER TABLE eg_department DROP CONSTRAINT pk_eg_department;
ALTER TABLE eg_department ADD CONSTRAINT pk_eg_department PRIMARY KEY (id, tenantId);

-- EG_LANGUAGE TABLE
ALTER TABLE eg_language DROP CONSTRAINT pk_eg_language;
ALTER TABLE eg_language ADD CONSTRAINT pk_eg_language PRIMARY KEY (id, tenantId);

-- EG_RELIGION TABLE
ALTER TABLE eg_religion DROP CONSTRAINT pk_eg_religion;
ALTER TABLE eg_religion ADD CONSTRAINT pk_eg_religion PRIMARY KEY (id, tenantId);

-- EG_HOLIDAY TABLE
ALTER TABLE eg_holiday DROP CONSTRAINT pk_eg_holiday;
ALTER TABLE eg_holiday ADD CONSTRAINT pk_eg_holiday PRIMARY KEY (id, tenantId);


-------------------------- RECREATE FOREIGN KEYS --------------------------

ALTER TABLE eg_holiday ADD CONSTRAINT fk_eg_holiday_calendaryear FOREIGN KEY (calendaryear, tenantId)
	REFERENCES eg_calendaryear (name, tenantId);

