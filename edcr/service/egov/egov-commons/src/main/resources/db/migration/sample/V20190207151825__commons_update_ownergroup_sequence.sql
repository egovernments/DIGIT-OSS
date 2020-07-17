SELECT setval('"seq_eg_ownergroup"',(SELECT MAX(ID) FROM eg_position ));
