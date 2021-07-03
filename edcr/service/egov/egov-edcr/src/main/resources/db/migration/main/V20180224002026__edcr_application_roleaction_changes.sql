Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='File Download'));

update eg_action set enabled =false where name ='Get edcr applcation details';

update eg_action set displayname='Resubmit E-DCR Plan' where name ='Re Upload Edcr file';

update eg_action set displayname='New E-DCR Plan' where name='New-EdcrApplication';