--- ADD CONSTRINT--------
ALTER TABLE egbpa_occupancy ADD CONSTRAINT fk_eg_occupancy_mdfdby FOREIGN KEY (lastmodifiedby) REFERENCES state.eg_user(id);
ALTER TABLE egbpa_occupancy ADD CONSTRAINT fk_eg_occupancy_crtby FOREIGN KEY (createdby) REFERENCES state.eg_user(id);
ALTER TABLE egbpa_sub_occupancy ADD CONSTRAINT fk_eg_sub_occupancy_crtby FOREIGN KEY (createdby) REFERENCES state.eg_user(id);
ALTER TABLE egbpa_sub_occupancy ADD CONSTRAINT fk_eg_sub_occupancy_mdfdby FOREIGN KEY (lastmodifiedby) REFERENCES state.eg_user(id);
ALTER TABLE egbpa_usage ADD CONSTRAINT fk_egbpa_usage_crtby FOREIGN KEY (createdby) REFERENCES state.eg_user(id);
ALTER TABLE egbpa_usage ADD CONSTRAINT fk_egbpa_usage_mdfdby FOREIGN KEY (lastmodifiedby) REFERENCES state.eg_user(id);