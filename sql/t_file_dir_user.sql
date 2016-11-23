drop table if EXISTS t_file_dir_user;
create table t_file_dir_user(
id int(11) not null auto_increment,
fid int(11) not null,
did int(11) not null,
uid int(11) not null,
PRIMARY KEY(id),
FOREIGN KEY(fid) REFERENCES t_files(fid),
FOREIGN KEY(did) REFERENCES t_directories(did),
FOREIGN KEY(uid) REFERENCES t_users(uid)
)CHARSET=utf8 COLLATE=utf8_general_ci;