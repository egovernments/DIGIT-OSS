UPDATE eg_tl_tradelicense SET applicationType = 'NEW' WHERE applicationType = null;
UPDATE eg_tl_tradelicense SET workflowCode = 'NewTL' WHERE workflowCode = null;