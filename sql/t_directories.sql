drop table if exists t_directories;
create table t_directories(
did int(11) not null auto_increment,
dname varchar(100) not null,
primary key(did),
unique key dname using BTREE(dname)
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;