use std::sync::Arc;
use crate::AppState;
use axum::extract::State;
use base32::Alphabet;
use sqlx::{FromRow};
use serde::Serialize;
use serde_json::{json, Value};

use axum::{
    http::StatusCode,
    extract::Path,    
    Json,
};

use totp_rs::{Algorithm, TOTP};
use std::time::SystemTime;

#[derive(Debug, Serialize, FromRow)]
pub struct Users {
    username: String,
    email: String,
    secret: String,
}

pub async fn patch_verifytotp(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>, req: String) -> (StatusCode, Json<Value>) {

    // let mut current_users = state.db.lock().await;

    let json_value: serde_json::Value = serde_json::from_str(&req).unwrap();
    let otpcode = &json_value["otp"];

    // let users_result = sqlx::query_as::<_, Users>("SELECT username,email,secret FROM users WHERE id = ?")
    // .bind(id)
    // .fetch_one(&state.pool)
    // .await
    // .expect("Database query failed somehow..");
    let users_result = match sqlx::query_as::<_, Users>("SELECT username, email, secret FROM users WHERE id = ?")
    .bind(id)
    .fetch_one(&state.pool)
    .await {
        Ok(user) => user,
        Err(e) => {
            eprintln!("Database query failed: {:?}", e); // Log the error!
            let response = json!({
                "message": "Internal server error: Database access failed."
            });
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
        }
    };    

    // let secret = users_result.secret;
    let secret_bytes = match base32::decode(Alphabet::Rfc4648 { padding: true }, &users_result.secret) {
        Some(bytes) => bytes,
        None => {
            let response = json!({
                "message": "Internal server error: Invalid secret format."
            });    
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
        }
    };

    let totp = TOTP::new(
        Algorithm::SHA1,
        6,       // Digits
        1,       // Allowed drift
        30,      // Period
        secret_bytes,       
        Some("BARCLAYS BANK".to_string()),
        users_result.email.to_string(),
    ).unwrap();

    let time = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs();

    if totp.check(&otpcode.to_string(), time) {

        let response = json!({
            "username": users_result.username,
            "message": "OTP code has verified successfully."
        });    
        return (StatusCode::OK, Json(response))        
        
    } else {

        let response = json!({
            "message": "Invalid OTP code, please try again."
        });    
        return (StatusCode::CONFLICT, Json(response))    
        
    }
}