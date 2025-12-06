use std::sync::Arc;
use crate::AppState;
use axum::extract::State;
use rust_decimal::Decimal; // or sqlx::types::Decimal if you prefer

use axum::{
    http::StatusCode,
    response::IntoResponse,    
    Json,
};

use axum::{ extract::Path,};
use serde_json::json;
use serde::{Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, FromRow)]
pub struct Products {
    id: i64,
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

pub async fn get_productlist(
    State(state): State<Arc<AppState>>,
    Path(page): Path<i32>) -> impl IntoResponse {
    
    let totalrecords_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM products")
        .fetch_one(&state.pool)
        .await
        .expect("Failed to fetch product count");
    
    let per_page: i32 = 5;
    let offset: i32 = (page -1) * per_page;
    let total1 = totalrecords_count.0 as f64 / per_page as f64;
    let total_pages = total1.ceil() as u32;

    let users_result: Vec<Products> = sqlx::query_as(r#"SELECT id,category,descriptions,qty,unit,costprice,sellprice,saleprice,productpicture,alertstocks,criticalstocks FROM products LIMIT ?, ?"#)
    .bind(&offset)
    .bind(&per_page)
    .fetch_all(&state.pool)
    .await
    .expect("Database query failed somehow.");

    if users_result.is_empty() {
        let response = serde_json::json!({
            "message": "Page not found.."
        });
        return (StatusCode::NOT_FOUND, Json(response)).into_response();      
    }
    
    let response = json!({
        "page": &page,
        "totpage": &total_pages,
        "totalrecords": &totalrecords_count.0,
        "products": users_result
    });

    (StatusCode::OK, Json(response)).into_response()        
}