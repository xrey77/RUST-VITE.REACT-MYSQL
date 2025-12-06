use std::sync::Arc;
use crate::AppState;
use axum::extract::State;

use axum::{
    Json,
    http::StatusCode,
    response::IntoResponse,    
    extract::Path,    
};

use serde::{Serialize};
use sqlx::{FromRow};

#[derive(Debug, Serialize, FromRow)]
pub struct Users {
    id: i64,
    firstname: String,
    lastname: String,
    email: String,
    mobile: String,
    username: String,
    roles: String,
    isactivated: i64,
    isblocked: i64,
    mailtoken: i64,
    userpic: String,
    qrcodeurl: Option<String>,
}

pub async fn get_userid(
    State(state): State<Arc<AppState>>,    
    Path(id): Path<u32>) -> impl IntoResponse {
        
    let user_count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .expect("Failed to fetch user count");

    if user_count > (0,) {
        let users_result = sqlx::query_as::<_, Users>("SELECT id,firstname,lastname,email,mobile,username,roles,isactivated,isblocked,mailtoken,userpic,qrcodeurl FROM users WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .expect("Database query failed somehow..");
    
        (StatusCode::OK, Json(users_result)).into_response()    
    } else {
        let response = serde_json::json!({
            "message": "User ID not found.."
        });
        return (StatusCode::NOT_FOUND, Json(response)).into_response();      

    }
}