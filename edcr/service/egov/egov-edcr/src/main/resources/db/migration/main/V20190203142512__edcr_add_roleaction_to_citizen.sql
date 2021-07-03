INSERT INTO eg_roleaction (actionid, roleid)
    SELECT (select id from eg_action where name='View-EdcrApplication'), (select id from eg_role  where name ='CITIZEN')
WHERE
    NOT EXISTS (select actionid,roleid from eg_roleaction where actionid in (select id from eg_action where name='View-EdcrApplication') and roleid in
  (select id from eg_role  where name ='CITIZEN'));