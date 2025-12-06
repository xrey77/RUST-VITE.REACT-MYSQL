use sqlx::{mysql::MySqlPool, FromRow};
use serde::{Serialize, Deserialize};
use rust_decimal::Decimal;

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize, FromRow)]
struct Product {
    id: Option<i32>,
    category: String,
    descriptions: String,
    qty: i64,
    unit: String,
    costprice: Decimal,
    sellprice: Decimal,
    saleprice: Decimal,
    productpicture: String,
    alertstocks: i64,
    criticalstocks: i64
}