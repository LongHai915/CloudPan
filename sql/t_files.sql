drop table if EXISTS t_files;
create table t_files(
fid int(11) not null auto_increment,
fname varchar(100) not null default'',
fsize double,
primary key(fid),
unique key fname using BTREE(fname) 
)ENGINE=INNODB default CHARSET=utf8 collate=utf8_general_ci;