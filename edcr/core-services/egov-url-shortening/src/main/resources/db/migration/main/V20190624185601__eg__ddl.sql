DROP SEQUENCE IF EXISTS eg_url_shorter_id;
CREATE SEQUENCE eg_url_shorter_id;

CREATE TABLE "eg_url_shortener" (
	"id" VARCHAR(128) NOT NULL,
	"validform" bigint,
	"validto" bigint,
	"url"  VARCHAR(1024) NOT NULL,
	PRIMARY KEY ("id")
);
