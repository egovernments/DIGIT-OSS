update tenant set name= (select name from city where tenantcode=code);
