WITH cte AS (
SELECT assg.assignee,pi.businessid,ROW_NUMBER() OVER() AS rn
FROM eg_wf_processinstance_v2 pi 
INNER JOIN eg_wf_assignee_v2 assg ON pi.id = assg.processinstanceid)
UPDATE eg_ws_connection conn 
SET assignee=(SELECT cte.assignee 
FROM cte 
WHERE cte.businessid = conn.applicationno);