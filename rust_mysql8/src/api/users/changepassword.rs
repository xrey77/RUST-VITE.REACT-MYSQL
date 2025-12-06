use crate::utils; 

use std::sync::Arc;
use crate::AppState;
use axum::extract::State;

use axum::extract;
use axum::{
    http::StatusCode,
    extract::Path,    
    Json,
};

use std::string::String;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct UserRequest {
    pub password: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct UserResponse {
    pub message: String,
}

pub async fn change_password(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>,
    extract::Json(payload): extract::Json<UserRequest>
) -> (StatusCode, Json<UserResponse>) {
    
    let hashed_password = utils::hash_password(&payload.password).unwrap();

    let result = sqlx::query("UPDATE users SET password_digest = ? WHERE id = ?")
        .bind(&hashed_password)
        .bind(&id)
        .execute(&state.pool)
        .await;

    if result.expect("REASON").rows_affected() > 0 {

        let newpassword = UserResponse {
            message: "You have changed your password successfully.".to_string()
        };    
        return (StatusCode::OK, Json(newpassword))
    
    } else {

        let newpassword = UserResponse {
            message: "Unable to change your password, try again later....".to_string()
        };    
        return (StatusCode::OK, Json(newpassword))
        
    }
}