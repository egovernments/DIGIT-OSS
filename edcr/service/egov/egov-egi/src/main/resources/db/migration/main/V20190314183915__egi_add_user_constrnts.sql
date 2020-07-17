ALTER TABLE eg_businessuser ADD CONSTRAINT fk_businessuser_user FOREIGN KEY (id) REFERENCES state.eg_user(id);
delete from eg_systemuser where id not in (1,2,3);
ALTER TABLE eg_systemuser ADD CONSTRAINT fk_systemuser_user FOREIGN KEY (id) REFERENCES state.eg_user(id);
ALTER TABLE eg_userdevice ADD CONSTRAINT fk_user_userdevice FOREIGN KEY (userid) REFERENCES state.eg_user(id);