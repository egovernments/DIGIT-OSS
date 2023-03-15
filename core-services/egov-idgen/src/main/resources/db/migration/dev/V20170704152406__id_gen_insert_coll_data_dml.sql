UPDATE id_generator set format = 'GN-CL-[cy:yyyy/MM/dd]-[SEQ_COLL_RCPT_NUM]' where sequencenumber=3;
UPDATE id_generator set format = 'AP-PT-[cy:yyyy/MM/dd]-[SEQ_ACK_NUM]-[d{2}]' where sequencenumber=1;
UPDATE id_generator set format = 'MH-PT-[fy:yyyy-yyyy]-[SEQ_ASSESMNT_NUM]-[d{2}]' where sequencenumber=2;
