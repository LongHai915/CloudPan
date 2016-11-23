drop table if exists users;
create table users(
	uid int(11) not null AUTO_INCREMENT,
	name varchar(30) COLLATE utf8_general_ci not null DEFAULT '',
	email varchar(50) COLLATE utf8_general_ci not null DEFAULT '',
	password varchar(32) COLLATE utf8_general_ci not null DEFAULT '',
	time TIMESTAMP not null DEFAULT '0000-00-00 00:00:00',
	lastLoginTim TIMESTAMP not null DEFAULT '0000-00-00 00:00:00',
	PRIMARY KEY(uid),
	UNIQUE KEY name USING BTREE(name)
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

alter table users rename t_users;

alter table t_users CHANGE COLUMN name uname varchar(30);
alter table t_users CHANGE COLUMN email uemail varchar(50);