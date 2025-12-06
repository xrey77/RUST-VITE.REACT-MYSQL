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
    pub firstname: String,
    pub lastname: String,
    pub mobile: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct UserResponse {
    pub message: String,
}

#[axum::debug_handler]
pub async fn patch_updateprofile(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>,
    extract::Json(payload): extract::Json<UserRequest>
) -> (StatusCode, Json<UserResponse>) {
    
    let result = sqlx::query("UPDATE users SET firstname = ?, lastname = ?, mobile = ?  WHERE id = ?")
        .bind(&payload.firstname)
        .bind(&payload.lastname)
        .bind(&payload.mobile)
        .bind(&id)
        .execute(&state.pool)
        .await;

    if result.expect("REASON").rows_affected() > 0 {

        let newuser = UserResponse {
            message: "You have updated your profile successfully".to_string()
        };    
        return (StatusCode::OK, Json(newuser))
    
    } else {

        let newuser = UserResponse {
            message: "No record(s) where updated....".to_string()
        };    
        return (StatusCode::OK, Json(newuser))
        
    }
}