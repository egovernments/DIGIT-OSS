ALTER TABLE state.eg_userrole ADD CONSTRAINT fk_userrole_role_id FOREIGN KEY (roleid) REFERENCES state.eg_role(id); 
ALTER TABLE  eg_roleaction ADD CONSTRAINT fk_role_id FOREIGN KEY (roleid) REFERENCES state.eg_role(id); 
ALTER TABLE  eg_feature_role ADD CONSTRAINT fk_feature_role FOREIGN KEY (role) REFERENCES state.eg_role (id); 