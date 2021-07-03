create table tmp_new_coa (
	srlno numeric,
	glcode varchar(10),
	name varchar(150),
	status varchar(150),
	coatype char(1),
	budgetenable boolean
);

CREATE OR REPLACE FUNCTION load_coa() RETURNS void AS $BODY$
declare
	coa_name varchar(200);
	coa_code varchar(10);
	coa_type varchar(1);
	coa_budgetreq boolean;
	isCoaExists boolean default true;
	srl bigint;
	coa_seq bigint;
	minor_code varchar(5);
	major_code varchar(3);
	top_code char(1);
	cur_coa tmp_new_coa%ROWTYPE;
begin
	RAISE NOTICE 'Inside COA data load';
	for cur_coa  in( select * from tmp_new_coa where status is null order by srlno)
	loop
	begin
		coa_name:=cur_coa.name;
		coa_code:=cur_coa.glcode;
		srl:=cur_coa.srlno;
		coa_type:=cur_coa.coatype;
		coa_budgetreq:=cur_coa.budgetenable;

		RAISE NOTICE 'Loading data for code %',coa_code;
		-- Check if glcode already exist
		isCoaExists:=coa_exist(coa_code);

		--If exist then dont load again
		if(isCoaExists=true) then
			update chartofaccounts set name=coa_name,budgetcheckreq=coa_budgetreq where glcode=coa_code;
			update tmp_new_coa set status ='COA already exist.Updated details' where srlno=srl;
		end if;

		-- check if glcode does not exist check if minor code,major code exit
		if(isCoaExists=false) then
			RAISE NOTICE 'COA does not exist %',coa_code;
			minor_code:=substring(coa_code,0,6);
			major_code:=substring(coa_code,0,4);

			--check major exist
			if(coa_exist(major_code)=true ) then
				-- check minor exist
				if(coa_exist(minor_code)=true ) then
					RAISE NOTICE 'Minor code exist %',minor_code;
				else
					-- load minor
					select nextval('seq_chartofaccounts') into coa_seq;
					INSERT INTO chartofaccounts (id, glcode, name,isactiveforposting, parentid, lastmodifieddate, lastmodifiedby,createddate,type, classification, budgetcheckreq, majorcode, createdby) values (coa_seq,minor_code,coa_name,false,(select id from chartofaccounts where glcode=major_code),current_date,1,current_date,coa_type,2,false,major_code,1);
				end if;
				select nextval('seq_chartofaccounts') into coa_seq;
				--load detailed code
				INSERT INTO chartofaccounts (id, glcode, name,isactiveforposting, parentid, lastmodifieddate, lastmodifiedby,createddate,type, classification, budgetcheckreq, majorcode, createdby) values (coa_seq,coa_code,coa_name,true,(select id from chartofaccounts where glcode=minor_code),current_date,1,current_date,coa_type,4,coa_budgetreq,major_code,1);
			else
				if(coa_type='A')then
					top_code:='4';
				elsif(coa_type='L') then
					top_code:='3';
				elsif(coa_type='I')then
					top_code:='1';
				elsif(coa_type='E')then
					top_code:='2';
				else
					RAISE NOTICE 'Wrong data..for top code... %',coa_type;
				end if;

				--load major code
				select nextval('seq_chartofaccounts') into coa_seq;
				INSERT INTO chartofaccounts (id, glcode, name,isactiveforposting, parentid, lastmodifieddate, lastmodifiedby,createddate,type, classification, budgetcheckreq, majorcode, createdby) values (coa_seq,major_code,coa_name,false,(select id from chartofaccounts where glcode=top_code),current_date,1,current_date,coa_type,1,false,major_code,1);

				-- load minor code
				select nextval('seq_chartofaccounts') into coa_seq;
				INSERT INTO chartofaccounts (id, glcode, name,isactiveforposting, parentid, lastmodifieddate, lastmodifiedby,createddate,type, classification, budgetcheckreq, majorcode, createdby) values (coa_seq,minor_code,coa_name,false,(select id from chartofaccounts where glcode=major_code),current_date,1,current_date,coa_type,2,false,major_code,1);

				-- load detailed code
				select nextval('seq_chartofaccounts') into coa_seq;
				INSERT INTO chartofaccounts (id, glcode, name,isactiveforposting, parentid, lastmodifieddate, lastmodifiedby,createddate,type, classification, budgetcheckreq, majorcode, createdby) values (coa_seq,coa_code,coa_name,true,(select id from chartofaccounts where glcode=minor_code),current_date,1,current_date,coa_type,4,coa_budgetreq,major_code,1);
			end if;

			update tmp_new_coa set status ='Updated' where srlno=srl;
		end if;
	end;
	end loop;
end;
$BODY$ LANGUAGE PLPGSQL VOLATILE COST 100;

CREATE OR REPLACE FUNCTION coa_exist(code character varying) 
RETURNS boolean AS 
$BODY$
	declare isexist boolean default true;
begin
	PERFORM id from chartofaccounts where upper(glcode)=upper(code);
	IF NOT FOUND THEN
		RAISE NOTICE 'Inside COA Code Unique checking %',code;
	isexist:=false;
END IF;
	return isexist;
end;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;

create table tmp_delete_coa (
	srlno numeric,
	glcode varchar(10),
	name varchar(150),
	status varchar(150)
);

CREATE OR REPLACE FUNCTION delete_coa()  RETURNS void AS 
$BODY$
declare
	coa_name varchar(200); 
	coa_code varchar(10);
	isCoaTxnExists boolean default true;
	srl bigint;
	cur_coa chartofaccounts%ROWTYPE;
begin
	RAISE NOTICE 'Inside COA deletion..';
	for cur_coa in (select * from chartofaccounts where glcode not in (select glcode from tmp_new_coa) and classification=4 order by glcode)
	loop
	begin
		coa_name:=cur_coa.name;
		coa_code:=cur_coa.glcode;

		RAISE NOTICE 'Processing COA code %',coa_code;
		-- Check if glcode already exist
		isCoaTxnExists:=coa_records_exist(coa_code);

		--If exist then dont load again
		if(isCoaTxnExists=false) then
			delete from chartofaccountdetail where glcodeid in (select id from chartofaccounts where glcode=coa_code);
			delete from chartofaccounts where glcode=coa_code;
			insert into tmp_delete_coa(glcode,name,status) values (coa_code,coa_name,'DELETED');
		else
			insert into tmp_delete_coa(glcode,name,status) values (coa_code,coa_name,'CANNOT DELETE..TXN EXIST');
		end if;

	end;
	end loop;
	RAISE NOTICE 'Finished processing deletion of COA';
end;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE OR REPLACE FUNCTION coa_records_exist(code character varying) 
RETURNS boolean AS
$BODY$
	declare isexist boolean default true;
begin
	PERFORM distinct gcode from (select glcode as gcode,name as gname from chartofaccounts where id in (select distinct chartofaccount from egcl_collectiondetails) and classification=4 and glcode=code 
union 
	select glcode as gcode,name as gname from chartofaccounts where id in (select distinct glcodeid from generalledger) and classification=4 and glcode=code 
union 
	select distinct c.glcode as gcode,name as gname  from egcl_service_accountdetails sa,chartofaccounts c where c.id=sa.chartofaccount and c.glcode=code 
union
	select distinct c.glcode as gcode,name as gname  from egf_instrumentaccountcodes iac,chartofaccounts c where c.id=iac.glcodeid and c.glcode=code
union
	select distinct c.glcode as gcode,name as gname  from bankaccount ba,chartofaccounts c where c.id=ba.glcodeid and c.glcode=code
union
	select distinct c.glcode as gcode,name as gname  from eg_billdetails db,chartofaccounts c where c.id=db.glcodeid and c.glcode=code
union
	select distinct c.glcode as gcode,name as gname  from transactionsummary ts,chartofaccounts c where c.id=ts.glcodeid and c.glcode=code
union
	select distinct c.glcode as gcode,c.name as gname  from egf_budgetgroup bg,chartofaccounts c where c.id=bg.maxcode and c.glcode=code
union
	select distinct c.glcode as gcode,name as gname  from tds td,chartofaccounts c where c.id=td.glcodeid and c.glcode=code
) as s1 order by gcode;

	IF NOT FOUND THEN
		RAISE NOTICE 'COA TXNS does not exist %',code;
		isexist:=false;
	END IF;
return isexist;
end;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;
