--- DROP CONSTRAINT--------
ALTER TABLE egbpa_occupancy DROP CONSTRAINT IF EXISTS fk_eg_occupancy_mdfdby;
ALTER TABLE egbpa_occupancy DROP CONSTRAINT IF EXISTS fk_eg_occupancy_crtby;
ALTER TABLE egbpa_sub_occupancy DROP CONSTRAINT IF EXISTS fk_eg_sub_occupancy_crtby;
ALTER TABLE egbpa_sub_occupancy DROP CONSTRAINT IF EXISTS fk_eg_sub_occupancy_mdfdby;
ALTER TABLE egbpa_usage DROP CONSTRAINT IF EXISTS fk_egbpa_usage_mdfdby;
ALTER TABLE egbpa_usage DROP CONSTRAINT IF EXISTS fk_egbpa_usage_crtby;