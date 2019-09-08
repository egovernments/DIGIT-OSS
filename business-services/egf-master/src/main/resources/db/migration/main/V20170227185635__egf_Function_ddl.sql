
Create table egf_function( 
	id bigint,
	name varchar(128) NOT NULL,
	code varchar(16) NOT NULL,
	level smallint NOT NULL,
	active boolean NOT NULL,
	isParent boolean NOT NULL,
	parentId bigint ,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_function add constraint pk_egf_function primary key (id);
alter table egf_function add constraint fk_egf_function_parentId  FOREIGN KEY (parentId) REFERENCES egf_function(id);
create sequence seq_egf_function;
