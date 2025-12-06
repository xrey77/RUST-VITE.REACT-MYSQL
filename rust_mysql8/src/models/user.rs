use sqlx::{mysql::MySqlPool, FromRow};
use serde::{Serialize, Deserialize};

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize, FromRow)]
struct User {
    id: Option<i32>,
    firstname: String,
    lastname: String,
    email: String,
    mobile: String,
    username: String,
    password: String,
    roles: String,
    isactivated: i64,
    isblocked: i64,
    mailtoken: i64,
    userpic: String,
    qrcodeurl: String,
    secret: String
}