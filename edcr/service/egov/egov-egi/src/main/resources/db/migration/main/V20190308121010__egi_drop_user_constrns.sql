ALTER TABLE eg_businessuser DROP CONSTRAINT fk_businessuser_user;
ALTER TABLE eg_systemuser DROP CONSTRAINT fk_systemuser_user;
ALTER TABLE eg_userrole DROP CONSTRAINT fk_user_userrole;
ALTER TABLE eg_userdevice DROP CONSTRAINT fk_user_userdevice;