use std::sync::Arc;
use crate::AppState;
use axum::extract::State;

use axum::{ 
    extract::{Multipart},
};
use serde_json::{json, Value};
use axum::{
    http::StatusCode,
    extract::Path,    
    Json,
};

use tokio::fs;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use tracing::info;

use sqlx::{FromRow};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Users {
    userpic: String,
}

pub async fn patch_uploadpicture(
    State(state): State<Arc<AppState>>,
    Path(id): Path<u32>, mut multipart: Multipart) -> (StatusCode, Json<Value>) {
    while let Some(field) = multipart.next_field().await.unwrap() {

        let users_result = sqlx::query_as::<_, Users>("SELECT userpic FROM users WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .expect("Database query failed somehow..");

        let name = field.name().unwrap().to_string();
        let file_name = field.file_name().unwrap().to_string(); //originam filename
        let content_type = field.content_type().unwrap().to_string();
        let data = field.bytes().await.unwrap();

        let extension = std::path::Path::new(&file_name)
        .extension()
        .and_then(|s| s.to_str())
        .unwrap_or("jpg"); 

        let new_filename = format!("00{}.{}", id, extension);

        info!(
            "Name: {}, FileName: {}, ContentType: {}, Size: {} bytes",
            name, file_name, content_type, data.len()
        );

        // Check if the field is an image (optional)
        if content_type.starts_with("image/") {
            let path = format!("./assets/users/{}", new_filename);
            
            // delete old picture
            if users_result.userpic != "pix.png" {
                let oldpic = format!("./assets/users/{}", users_result.userpic);
                let _ = fs::remove_file(oldpic).await;
            }
            // Ensure the 'uploads' directory exists
            if let Err(e) = tokio::fs::create_dir_all("./assets").await {
                eprintln!("Failed to create directory: {}", e);

                let response = json!({
                    "message": "Failed to create upload directory."
                });
                return (StatusCode::CONFLICT, Json(response));

            }

            // Write the file to disk asynchronously
            let mut file = match File::create(&path).await {
                Ok(file) => file,
                Err(e) => {
                    eprintln!("Failed to create file: {}", e);

                    let response = json!({
                        "message": "Failed to create file."
                    });
                    return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
                }
            };

            if let Err(e) = file.write_all(&data).await {
                eprintln!("Failed to write to file: {}", e);

                let response = json!({
                    "message": "Failed to create file."
                });
                return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
            }
            let result = sqlx::query("UPDATE users SET userpic = ? WHERE id = ?")
            .bind(&new_filename)
            .bind(&id)
            .execute(&state.pool)
            .await;
    
            if result.expect("REASON").rows_affected() > 0 {
                let response = json!({
                    "userpic": new_filename,
                    "message": "You have change your profile picture successfully."
                });
                return (StatusCode::CREATED, Json(response))
    
            } else {
                let response = json!({
                    "message": "Unable to upload picture, please select image only."
                });
                return (StatusCode::CONFLICT, Json(response))
    
            }

        } else {

            let response = json!({
                "message": "Invalid file type. Only images are allowed."
            });
            return (StatusCode::BAD_REQUEST, Json(response));

        }
    }

    let response = json!({
        "message": "No file uploaded."
    });
    return (StatusCode::BAD_REQUEST, Json(response));

 }