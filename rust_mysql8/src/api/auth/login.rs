use crate::utils; 

use std::sync::Arc;
use crate::AppState;
use axum::extract::State;
use sqlx::{FromRow};

use serde::{Deserialize, Serialize};
use axum::{
    http::StatusCode,
    Json,
};
use anyhow::Result;

#[derive(Debug, Serialize, FromRow, Clone)]
pub struct Users {
    id: i32,
    firstname: String,
    lastname: String,
    email: String,
    mobile: String,
    username: String,
    password_digest: String,
    roles: String,
    isactivated: i32,
    isblocked: i32,
    mailtoken: i32,
    userpic: String,
    qrcodeurl: Option<String>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct RequestData {
    username: String,
    password: String
}

use serde_json::{json, Value};

pub async fn create_login(
    State(state): State<Arc<AppState>>,
    payload: Json<RequestData>) -> (StatusCode, Json<Value>) {

    let user_result: Result<Users, sqlx::Error> = sqlx::query_as::<_, Users>(
        "SELECT id, firstname, lastname, email, mobile, username, password_digest,roles,isactivated,isblocked,mailtoken,userpic,qrcodeurl FROM users WHERE username = ?"
    )    
    .bind(&payload.username)
    .fetch_one(&state.pool)
    .await;

    match user_result {
        Ok(user_data) => {

            match utils::verify_password(&payload.password, &user_data.password_digest) {
                Ok(is_valid) => {
                    if is_valid {

                        let mut token_string = String::new();
                        let secret_key = std::env::var("JWT_SECRET").expect("JWT_SECRET not set").as_bytes().to_vec();                        
                        // let jwt_token = utils::create_jwt(&user_data.email, "BARCLAYS BANK", &secret_key);
                        let jwt_token = utils::create_jwt(&user_data.email, &secret_key);
                        match jwt_token {
                            Ok(token) => {
                                token_string.push_str(&token);
                            }
                            Err(e) => {
                                eprintln!("Failed to create JWT : {}", e);
                            }
                        }
                        
                        let response = json!({
                            "id": user_data.id,
                            "firstname": user_data.firstname,
                            "lastname": user_data.lastname,
                            "email": user_data.email,
                            "mobile": user_data.mobile,
                            "username": user_data.username,
                            "roles": user_data.roles,
                            "isactivated": user_data.isactivated,
                            "isblocked": user_data.isblocked,
                            "userpic": user_data.userpic,
                            "qrcodeurl": user_data.qrcodeurl,
                            "token": token_string,
                            "message": "Logged-In Successful."
                        });
                    
                        (StatusCode::OK, Json(response))
            
                    } else {
                        let response = json!({
                            "message": "Invalid password."
                        });

                        (StatusCode::CONFLICT, Json(response))
                    }
                }
                Err(e) => {

                    let response = json!({
                        "message": e.to_string()
                    });
                
                    (StatusCode::CONFLICT, Json(response))      

                }
            }

        }
        Err(e) => {
            println!("ERROR ! :{}", e);
            let response = json!({
                "message": "Username not found, please register."
            });

            (StatusCode::CONFLICT, Json(response))            
    
        }
    }
}




