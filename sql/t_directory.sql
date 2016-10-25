drop table if exists t_directory;
create table t_directory(
did int(11) not null auto_increment,
dname varchar(100) not null,
primary key(did),
unique key dname using BTREE(dname)
)ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;