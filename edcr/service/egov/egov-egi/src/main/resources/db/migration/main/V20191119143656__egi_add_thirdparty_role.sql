
INSERT into state.eg_userrole select (select id from state.eg_role where name = 'BUSINESS'), (select id from state.eg_user where username ='egovrestuser') where not exists (SELECT * FROM state.eg_userrole WHERE roleid in (select id from state.eg_role where name = 'BUSINESS') and userid in (select id from state.eg_user where username ='egovrestuser'));

INSERT into state.eg_userrole select (select id from state.eg_role where name = 'Third Party Operator'), (select id from state.eg_user where username ='egovrestuser') where not exists (SELECT * FROM state.eg_userrole WHERE roleid in (select id from state.eg_role where name = 'Third Party Operator') and userid in (select id from state.eg_user where username ='egovrestuser'));
