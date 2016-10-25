drop table if EXISTS t_file_user;
create table t_file_user(
id int(11) not null auto_increment,
fid int(11) not null,
uid int(11) not null,
ftime TIMESTAMP not null default '0000-00-00 00:00:00',
PRIMARY KEY(id),
FOREIGN KEY(fid) REFERENCES t_file(fid),
FOREIGN KEY(uid) REFERENCES t_user(uid)
)ENGINE=INNODB CHARSET=utf8 COLLATE=utf8_general_ci;