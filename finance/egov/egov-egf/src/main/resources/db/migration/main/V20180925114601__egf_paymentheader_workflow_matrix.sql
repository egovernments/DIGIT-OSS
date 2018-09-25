delete from eg_wf_matrix where objecttype = 'Paymentheader' ;

INSERT INTO eg_wf_matrix (id, department, objecttype, currentstate, currentstatus, pendingactions, currentdesignation, additionalrule, nextstate, nextaction, nextdesignation, nextstatus, validactions, fromqty, toqty, fromdate, todate) VALUES 
(nextval('SEQ_EG_WF_MATRIX'), 'ANY', 'Paymentheader','NEW', NULL, NULL, 'Accounts Officer', NULL, 'Created', 'Approval Pending', 'Commissioner', 'Created', 'Forward', NULL, NULL, '2018-04-01', '2099-04-01');

INSERT INTO eg_wf_matrix (id, department, objecttype, currentstate, currentstatus, pendingactions, currentdesignation, additionalrule, nextstate, nextaction, nextdesignation, nextstatus, validactions, fromqty, toqty, fromdate, todate) VALUES 
(nextval('SEQ_EG_WF_MATRIX'), 'ANY', 'Paymentheader', 'Rejected', NULL, NULL, 'Accounts Officer', NULL, 'Created', 'Approval Pending', 'Commissioner', NULL, 'Forward,Cancel', NULL, NULL, '2018-04-01', '2099-04-01');

INSERT INTO eg_wf_matrix (id, department, objecttype, currentstate, currentstatus, pendingactions, currentdesignation, additionalrule, nextstate, nextaction, nextdesignation, nextstatus, validactions, fromqty, toqty, fromdate, todate) VALUES 
(nextval('SEQ_EG_WF_MATRIX'), 'ANY', 'Paymentheader', 'Created', NULL, NULL, 'Commissioner', NULL, 'END', 'END', NULL, NULL, 'Approve,Reject', NULL, NULL, '2018-04-01', '2099-04-01');
