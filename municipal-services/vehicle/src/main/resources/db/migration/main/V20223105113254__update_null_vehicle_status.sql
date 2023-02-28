UPDATE eg_vehicle 
		set status='ACTIVE',
		lastmodifiedby='SAN-1098',
		lastmodifiedtime=extract(epoch from current_timestamp )*1000
		where status is null; 