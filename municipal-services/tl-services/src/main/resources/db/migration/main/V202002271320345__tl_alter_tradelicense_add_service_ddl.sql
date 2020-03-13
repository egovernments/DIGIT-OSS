UPDATE eg_tl_tradelicense SET applicationType = 'NEW' WHERE applicationType is NULL;
UPDATE eg_tl_tradelicense SET workflowCode = 'NewTL' WHERE workflowCode is NULL;