UPDATE eg_sw_connection conn 
SET assignee=(SELECT cte.assignee 
FROM (SELECT assg.assignee,pi.businessid
FROM eg_wf_processinstance_v2 pi 
INNER JOIN eg_wf_assignee_v2 assg ON pi.id = assg.processinstanceid 
      where pi.lastmodifiedTime  IN  (
          SELECT max(lastmodifiedTime) 
          from eg_wf_processinstance_v2 GROUP BY businessid)) cte 
WHERE cte.businessid = conn.applicationno);