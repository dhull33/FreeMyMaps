-- Session Store Table
-- From node-connect-pg-simple: https://github.com/voxpelli/node-connect-pg-simple
CREATE TABLE "session" (
                         "sid" varchar NOT NULL COLLATE "default",
                         "sess" json NOT NULL,
                         "expire" timestamp(6) NOT NULL
)
  WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- User Table
CREATE TABLE "user"
(
  user_id VARCHAR NOT NULL,
  password VARCHAR not null,
  email VARCHAR not null
);

create unique index user_email_uindex
on "user" (email);

create unique index user_user_id_uindex
on "user" (user_id);

alter table "user"
  add constraint user_pk
    primary key (user_id);

-- Maps Table
CREATE TABLE maps
(
  map_id VARCHAR not null,
  user_id VARCHAR,
  map_features VARCHAR
);

create unique index maps_map_id_uindex
on maps (map_id);

alter table maps
  add constraint maps_pk
    primary key (map_id);
