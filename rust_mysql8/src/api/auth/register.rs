use crate::utils; 

use std::sync::Arc;
use crate::AppState;
use axum::extract::State;

use axum::extract;
use axum::{
    http::StatusCode,
    Json,
};

use std::string::String;
use serde::{Deserialize, Serialize};


#[derive(Deserialize, Debug)]
pub struct UserRequest {
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub mobile: String,
    pub username: String,
    pub password: String,
}


#[derive(Serialize, Clone, Debug)]
pub struct UserResponse {
    pub message: String,
}

#[axum::debug_handler]
pub async fn create_user(
    State(state): State<Arc<AppState>>,
    extract::Json(payload): extract::Json<UserRequest>
) -> (StatusCode, Json<UserResponse>) {

    let email_result: i64 = sqlx::query_scalar(r#"SELECT COUNT(*) FROM users WHERE email = ?"#)
        .bind(&payload.email)
        .fetch_one(&state.pool)
        .await
        .expect("Failed to fetch count");

    if email_result > 0 {

        let response = UserResponse { message: "Email Address is already taken.".to_string() };
        return (StatusCode::CONFLICT, Json(response))

    } else {

        let username_result: i64 = sqlx::query_scalar(r#"SELECT COUNT(*) FROM users WHERE username = ?"#)
        .bind(&payload.username)
        .fetch_one(&state.pool)
        .await
        .expect("Failed to fetch count");

        if username_result > 0 {
            let response = UserResponse { message: "Username is already taken.".to_string() };
            return (StatusCode::CONFLICT, Json(response))    
        }


    }

    let hashed_password = utils::hash_password(&payload.password).unwrap();
    
    let result = sqlx::query("INSERT INTO users (firstname,lastname,email,mobile,username,password_digest) VALUES (?,?,?,?,?,?)")
        .bind(&payload.firstname)
        .bind(&payload.lastname)
        .bind(&payload.email)
        .bind(&payload.mobile)
        .bind(&payload.username)
        .bind(&hashed_password)
        .execute(&state.pool)
        .await;

    let newuser = UserResponse {
        message: format!("You have registered successfully, your User ID is : {}", result.expect("REASON").last_insert_id())
    };

    return (StatusCode::CREATED, Json(newuser))
    


}