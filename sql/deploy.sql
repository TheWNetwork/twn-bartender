-- auto-generated definition
create table frases
(
    id      int auto_increment
        primary key,
    lang    varchar(2)       not null,
    frase   varchar(255)     not null,
    deleted bit default b'0' null
);

