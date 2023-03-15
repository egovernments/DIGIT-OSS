update eg_city set districtname='Ranchi', districtcode='001', grade='Corp' where code='0001';

update eg_citypreferences set recaptchapk='6LfidggTAAAAANDSoCgfkNdvYm3Ugnl9HC8_68o0', recaptchapub='6LfidggTAAAAADwfl4uOq1CSLhCkH8OE7QFinbVs' where id=(select preferences from eg_city where code='0001');
