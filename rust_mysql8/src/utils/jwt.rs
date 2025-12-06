use chrono::{Utc, Duration};
use jsonwebtoken::{encode, EncodingKey, Header}; //Algorithm
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use rand::Rng;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    sub: String, // Subject (whom the token refers to)
    exp: usize,  // Required (expiration time as UTC timestamp)
}

// pub fn create_jwt(user_id: &str, company_name: &str, secret: &[u8]) -> Result<String, jsonwebtoken::errors::Error> {

pub fn create_jwt(user_id: &str, secret: &[u8]) -> Result<String, jsonwebtoken::errors::Error> {

    let expiration = (Utc::now() + Duration::days(1)).timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        // company: company_name.to_owned(),
        exp: expiration,
    };

    let header = Header::default(); // Uses HS256 by default
    let encoding_key = EncodingKey::from_secret(secret);

    // Encode the token
    encode(&header, &claims, &encoding_key)
}

#[allow(dead_code)]
pub fn decode_jwt(token: &str, secret: &[u8]) -> Result<Claims, jsonwebtoken::errors::Error> {
    let decoding_key = DecodingKey::from_secret(secret);
    let validation = Validation::default(); // Validates standard claims (like 'exp') by default

    // Decode and validate the token
    let token_data = decode::<Claims>(token, &decoding_key, &validation)?;
    
    Ok(token_data.claims)
}


// A secure key for HS256 should be at least 32 bytes (256 bits).
// For HS512, use 64 bytes.
const JWT_SECRET_LEN: usize = 32;

#[allow(dead_code)]
pub fn generate_secure_secret() -> [u8; JWT_SECRET_LEN] {
    let mut rng = rand::rng(); 
    // let mut rng = rand::thread_rng();
    let mut secret = [0u8; JWT_SECRET_LEN];
    rng.fill(&mut secret);
    secret
}