use std::sync::Arc;
use crate::AppState;
use axum::extract::State;

use axum::{
    http::StatusCode,
    response::IntoResponse,    
    Json,
};
use serde::{Serialize};
use sqlx::FromRow;

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
}

pub async fn get_allusers(
    State(state): State<Arc<AppState>>) -> impl IntoResponse {

        let users_result: Vec<Users> = sqlx::query_as(r#"SELECT id,firstname,lastname,email,mobile,username,roles,isactivated,isblocked,mailtoken,userpic FROM users"#)
        .fetch_all(&state.pool)
        .await
        .expect("Database query failed somehow..");

        if users_result.is_empty() {

            let response = serde_json::json!({
                "message": "No record(s) found.."
            });
            return (StatusCode::NOT_FOUND, Json(response)).into_response();      
        }
    
        (StatusCode::OK, Json(users_result)).into_response()

}