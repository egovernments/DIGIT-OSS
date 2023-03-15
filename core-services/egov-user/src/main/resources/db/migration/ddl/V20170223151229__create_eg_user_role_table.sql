CREATE TABLE eg_userrole (
    roleid bigint NOT NULL references eg_role(id),
    userid bigint NOT NULL references eg_user(id)
);