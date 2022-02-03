do
$$
declare
    f record;
begin
    for f in  
		select fsm_app.applicationno,fsm_app.vehicletype,
		vehicle.type, vehicle.tankcapicity
		from eg_fsm_application fsm_app, eg_vehicle vehicle 
		where fsm_app.vehicle_id=vehicle.id  
    loop 
		UPDATE eg_fsm_application 
		set vehiclecapacity=f.tankcapicity,lastmodifiedby='SAN-798',lastmodifiedtime=extract(epoch from current_timestamp )*1000
		where applicationno=f.applicationno;
    end loop;
end;
$$
