ALTER table sub_scheme drop constraint "fk_sub_scheme_department";
ALTER table sub_scheme ALTER COLUMN department TYPE VARCHAR(20);
