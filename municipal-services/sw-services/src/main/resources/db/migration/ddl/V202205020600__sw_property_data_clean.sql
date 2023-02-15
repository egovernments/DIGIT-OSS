UPDATE eg_sw_connection conn 
set property_id = pt.propertyid 
from eg_pt_property pt 
where conn.property_id = pt.id;