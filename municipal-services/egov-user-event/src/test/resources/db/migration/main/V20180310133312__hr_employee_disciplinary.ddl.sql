 CREATE TABLE egeis_disciplinary (
	id BIGINT NOT NULL,
	employeeId BIGINT NOT NULL,
   	gistCase CHARACTER VARYING(250) NOT NULL,
   	disciplinaryAuthority CHARACTER VARYING(250) NOT NULL,
  	orderNo CHARACTER VARYING(250) NOT NULL,
   	orderDate DATE NOT NULL,
   	memoNo CHARACTER VARYING(250) NOT NULL,
 	memoDate DATE NOT NULL,
   	memoServingDate DATE NOT NULL,
	dateOfReceiptMemoDate DATE,
    explanationAccepted BOOLEAN,
    chargeMemoNo CHARACTER VARYING(250),
  	chargeMemoDate DATE,
    dateOfReceiptToChargeMemoDate DATE,
    accepted BOOLEAN,
	dateOfAppointmentOfEnquiryOfficerDate DATE,
  	enquiryOfficerName CHARACTER VARYING(250),
    dateOfAppointmentOfPresentingOfficer DATE ,
    presentingOfficerName CHARACTER VARYING(250),
   	findingsOfEO CHARACTER VARYING(250),	
   	enquiryReportSubmittedDate DATE,
  	dateOfCommunicationOfER DATE,
   	dateOfSubmissionOfExplanationByCO DATE,
    acceptanceOfExplanation BOOLEAN,
	proposedPunishmentByDA CHARACTER VARYING(250),
	showCauseNoticeNo CHARACTER VARYING(250),
	showCauseNoticeDate DATE,
   	showCauseNoticeServingDate DATE,
   	explanationToShowCauseNotice CHARACTER VARYING(250),
   	explanationToShowCauseNoticeAccepted BOOLEAN,
   	punishmentAwarded CHARACTER VARYING(250) ,
   	proceedingsNumber CHARACTER VARYING(250),
    proceedingsDate DATE,
   	proceedingsServingDate DATE,
	courtCase BOOLEAN,
	courtOrderNo CHARACTER VARYING(250),
  	courtOrderDate DATE,
 	gistOfDirectionIssuedByCourt CHARACTER VARYING(250),
 	createdBy BIGINT NOT NULL,
	createdDate DATE NOT NULL,
	lastModifiedBy BIGINT,
	lastModifiedDate DATE,
	tenantId CHARACTER VARYING(250) NOT NULL,
	CONSTRAINT pk_egeis_disciplinary PRIMARY KEY (id,tenantId),
	CONSTRAINT fk_egeis_disciplinary_employeeId FOREIGN KEY (employeeId,tenantId)
		REFERENCES egeis_employee (id,tenantId)
);

CREATE SEQUENCE seq_egeis_disciplinary
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

