CREATE TABLE public.eg_birth_dtls_audit
(
     operation char(1)  NOT NULL,
	 stamp timestamp NOT NULL, 
	 id character varying(64)  NOT NULL,
    registrationno character varying(64)  NOT NULL,
    hospitalname character varying(500) ,
    dateofreport timestamp without time zone,
    dateofbirth timestamp without time zone NOT NULL,
    firstname character varying(200) ,
    middlename character varying(200) ,
    lastname character varying(200) ,
    placeofbirth character varying(1000) ,
    informantsname character varying(200) ,
    informantsaddress character varying(1000) ,
    createdtime bigint,
    createdby character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    counter smallint,
    tenantid character varying(50)  NOT NULL,
    gender smallint NOT NULL,
    remarks character varying(1000) ,
    hospitalid character varying(64) 
);

CREATE OR REPLACE FUNCTION process_eg_birth_dtls_audit() RETURNS TRIGGER AS $eg_birth_dtls_audit$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO eg_birth_dtls_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO eg_birth_dtls_audit SELECT 'U', now(), OLD.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$eg_birth_dtls_audit$ LANGUAGE plpgsql;

CREATE TRIGGER eg_birth_dtls_audit
BEFORE UPDATE OR DELETE ON eg_birth_dtls
    FOR EACH ROW EXECUTE PROCEDURE process_eg_birth_dtls_audit();

CREATE TABLE public.eg_birth_father_info_audit
(
     operation char(1)  NOT NULL,
	 stamp timestamp NOT NULL, 
	 id character varying(64)  NOT NULL,
    firstname character varying(200) ,
    middlename character varying(200) ,
    lastname character varying(200) ,
    aadharno character varying(150) ,
    emailid character varying(300) ,
    mobileno character varying(150) ,
    education character varying(100) ,
    proffession character varying(100) ,
    nationality character varying(100) ,
    religion character varying(100) ,
    createdtime bigint,
    createdby character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    birthdtlid character varying(64)  NOT NULL
);

CREATE OR REPLACE FUNCTION process_eg_birth_father_info_audit() RETURNS TRIGGER AS $eg_birth_father_info_audit$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO eg_birth_father_info_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO eg_birth_father_info_audit SELECT 'U', now(), OLD.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$eg_birth_father_info_audit$ LANGUAGE plpgsql;

CREATE TRIGGER eg_birth_father_info_audit
BEFORE UPDATE OR DELETE ON eg_birth_father_info
    FOR EACH ROW EXECUTE PROCEDURE process_eg_birth_father_info_audit();

CREATE TABLE public.eg_birth_mother_info_audit
(
     operation char(1)  NOT NULL,
	 stamp timestamp NOT NULL, 
	 id character varying(64)  NOT NULL,
    firstname character varying(200) ,
    middlename character varying(200) ,
    lastname character varying(200) ,
    aadharno character varying(150) ,
    emailid character varying(300) ,
    mobileno character varying(150) ,
    education character varying(100) ,
    proffession character varying(100) ,
    nationality character varying(100) ,
    religion character varying(100) ,
    createdtime bigint,
    createdby character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    birthdtlid character varying(64)  NOT NULL
);

CREATE OR REPLACE FUNCTION process_eg_birth_mother_info_audit() RETURNS TRIGGER AS $eg_birth_mother_info_audit$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO eg_birth_mother_info_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO eg_birth_mother_info_audit SELECT 'U', now(), OLD.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$eg_birth_mother_info_audit$ LANGUAGE plpgsql;

CREATE TRIGGER eg_birth_mother_info_audit
BEFORE UPDATE OR DELETE ON eg_birth_mother_info
    FOR EACH ROW EXECUTE PROCEDURE process_eg_birth_mother_info_audit();

CREATE TABLE public.eg_birth_permaddr_audit
(
     operation char(1)  NOT NULL,
	 stamp timestamp NOT NULL, 
	 id character varying(64)  NOT NULL,
    buildingno character varying(1000) ,
    houseno character varying(1000) ,
    streetname character varying(1000) ,
    locality character varying(1000) ,
    tehsil character varying(1000) ,
    district character varying(100) ,
    city character varying(100) ,
    state character varying(100) ,
    pinno character varying(100) ,
    country character varying(100) ,
    createdby character varying(64) ,
    createdtime bigint,
    lastmodifiedby character varying(64) ,
    lastmodifiedtime bigint,
    birthdtlid character varying(64) NOT NULL
);

CREATE OR REPLACE FUNCTION process_eg_birth_permaddr_audit() RETURNS TRIGGER AS $eg_birth_permaddr_audit$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO eg_birth_permaddr_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO eg_birth_permaddr_audit SELECT 'U', now(), OLD.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$eg_birth_permaddr_audit$ LANGUAGE plpgsql;

CREATE TRIGGER eg_birth_permaddr_audit
BEFORE UPDATE OR DELETE ON eg_birth_permaddr
    FOR EACH ROW EXECUTE PROCEDURE process_eg_birth_permaddr_audit();
	
	
CREATE TABLE public.eg_birth_presentaddr_audit
(
     operation char(1)  NOT NULL,
	 stamp timestamp NOT NULL, 
	 id character varying(64)  NOT NULL,
    buildingno character varying(1000) ,
    houseno character varying(1000) ,
    streetname character varying(1000) ,
    locality character varying(1000) ,
    tehsil character varying(1000) ,
    district character varying(100) ,
    city character varying(100) ,
    state character varying(100) ,
    pinno character varying(100) ,
    country character varying(100) ,
    createdby character varying(64) ,
    createdtime bigint,
    lastmodifiedby character varying(64) ,
    lastmodifiedtime bigint,
    birthdtlid character varying(64) NOT NULL
);

CREATE OR REPLACE FUNCTION process_eg_birth_presentaddr_audit() RETURNS TRIGGER AS $eg_birth_presentaddr_audit$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO eg_birth_presentaddr_audit SELECT 'D', now(), OLD.*;
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO eg_birth_presentaddr_audit SELECT 'U', now(), OLD.*;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$eg_birth_presentaddr_audit$ LANGUAGE plpgsql;

CREATE TRIGGER eg_birth_presentaddr_audit
BEFORE UPDATE OR DELETE ON eg_birth_presentaddr
    FOR EACH ROW EXECUTE PROCEDURE process_eg_birth_presentaddr_audit();
