INSERT INTO state.eg_user select nextval('state.seq_eg_user'), 'state', NULL, NULL, NULL, 'en_IN', 'egovrestuser', '$2a$10$nB4/6WyQsXPhuhiAIKgSJ.mu59Xax4gD5nFdgAuujlESQFta96APC', '2020-12-31 00:00:00', NULL, NULL, NULL, now(), now(), 1, 1, true, ' Egov Rest user', NULL, NULL, NULL, 'BUSINESS', 0, NULL, NULL, 'state' where not exists (select * from state.eg_user where username='egovrestuser');

INSERT into state.eg_userrole select (select id from eg_role where name = 'BUSINESS'), (select id from state.eg_user where username ='egovrestuser') where not exists (SELECT * FROM state.eg_userrole WHERE roleid in (select id from eg_role where name = 'BUSINESS'));

INSERT into state.eg_userrole select (select id from eg_role where name = 'Third Party Operator'), (select id from state.eg_user where username ='egovrestuser') where not exists (SELECT * FROM state.eg_userrole WHERE roleid in (select id from eg_role where name = 'Third Party Operator'));
