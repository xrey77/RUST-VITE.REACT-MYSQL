use serde::{Deserialize, Serialize};
use jsonwebtoken::{decode, DecodingKey, Validation};
use http::header::AUTHORIZATION;

use axum::{
    extract::Request,
    middleware::Next,
    response::{IntoResponse, Response},
    http::StatusCode,
};
use axum::body::Body;

#[derive(Debug, Serialize)]
struct ErrorResponse {
    message: String,
    // code: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // Subject (user ID)
    pub exp: usize,  // Expiration time
}


pub async fn validate_jwt(mut req: Request<Body>, next: Next) -> Response {
    let token = req.headers()
        .get(AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .and_then(|header_str| header_str.strip_prefix("Bearer "))
        .map(|token_str| token_str.to_string());

    // NOTE: Handle the potential panic here in a production setting
    let secret_key = std::env::var("JWT_SECRET").expect("JWT_SECRET not set").as_bytes().to_vec();                        

    match token {
        Some(token) => {
            let decoding_key = DecodingKey::from_secret(secret_key.as_ref()); 
            let validation = Validation::default();

            match decode::<Claims>(&token, &decoding_key, &validation) {
                Ok(token_data) => {
                    req.extensions_mut().insert(token_data.claims);
                    next.run(req).await
                }
                Err(_) => {
                    // Invalid token: return a JSON response with a 401 status
                    let error_response = ErrorResponse {
                        message: "Unauthorized Access.".to_string()
                        // code: 401,
                    };
                    (StatusCode::UNAUTHORIZED, axum::Json(error_response)).into_response()
                }
            }
        }
        None => {
            // Missing token: return a JSON response with a 401 status
            let error_response = ErrorResponse {
                message: "Authorization token missing".to_string()
                // code: 401,
            };
            (StatusCode::UNAUTHORIZED, axum::Json(error_response)).into_response()
        }
    }
}
