use std::sync::Arc;
use crate::AppState;
use axum::extract::State;

use axum::{
    http::StatusCode,
    extract::Path,    
    Json,
};
use data_encoding::BASE32;
use std::string::String;
use serde_json::{json, Value};
use sqlx::{FromRow};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Users {
    username: String,
    email: String,
}

use totp_rs::{Algorithm, TOTP, Secret};

#[axum::debug_handler]
pub async fn patch_activatemfa(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>, req: String) -> (StatusCode, Json<Value>) {
    
    let json_value: serde_json::Value = serde_json::from_str(&req).unwrap();
    let is_mfaenable = &json_value["TwoFactorEnabled"];


    if is_mfaenable == true {
    
        let users_result = sqlx::query_as::<_, Users>("SELECT username, email FROM users WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .expect("Database query failed somehow..");

        let secret: Secret = Secret::generate_secret();

        let totp = TOTP::new(
            Algorithm::SHA1,
            6,
            1,
            30,
            secret.to_bytes().expect("Invalid secret bytes"),
            Some("BARCLAYS BANK".to_string()),
            users_result.email.to_string(),
        ).unwrap();        

        let qrcode_base64 = totp.get_qr_base64();
        let qrcode_string: String = qrcode_base64.clone().expect("Failed to get the base64 string");

        let secret_bytes: Vec<u8> = secret.to_bytes().expect("Failed to convert secret to bytes");
    
        let encoded_secret: String = BASE32.encode(&secret_bytes);
    
        let result = sqlx::query("UPDATE users SET qrcodeurl = ?, secret = ? WHERE id = ?")
        .bind(&qrcode_string)
        .bind(&encoded_secret)
        .bind(&id)
        .execute(&state.pool)
        .await;

        if result.expect("REASON").rows_affected() > 0 {


            let response = json!({
                "qrcodeurl": &qrcode_string,
                "message": "Multi-Factor Authenticator has been anabled"
            });    
            return (StatusCode::OK, Json(response))
        
        } else {

            let response = json!({
                "message": "Unable to enable MFA."
            });    
            return (StatusCode::OK, Json(response))
            
        }

    } else {

        let result = sqlx::query("UPDATE users SET qrcodeurl = null, secret = null WHERE id = ?")
        .bind(&id)
        .execute(&state.pool)
        .await;

        if result.expect("REASON").rows_affected() > 0 {

            let response = json!({
                "message": "Multi-Factor Authenticator has been disabled."
            });    
            return (StatusCode::OK, Json(response))
        
        } else {

            let response = json!({
                "message": "Unable to disable MFA."
            });    
            return (StatusCode::OK, Json(response))
            
        }

    }
}