mod utils;
mod api;

use askama::Template;
use axum::{Router, routing::get, http::{header, Method},
    routing::post, routing::patch,response::Html
};
use std::net::SocketAddr;
use tower_http::services::ServeDir;
use tower_http::cors::CorsLayer;

use std::time::Duration;
use dotenv::dotenv;

use sqlx::mysql::MySqlPoolOptions;
use sqlx::{Pool, MySql};
use std::sync::Arc;

pub struct AppState {
    pub pool: Pool<MySql>,
}

#[tokio::main]
async fn main() {
    let static_files_service = ServeDir::new("assets");

    let cors = CorsLayer::new()
    .allow_origin("http://localhost:5173".parse::<http::HeaderValue>().unwrap())
    .allow_methods([Method::GET, Method::POST, Method::PUT, Method::PATCH, Method::DELETE, Method::OPTIONS])
    .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
    .allow_credentials(true);    

    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = MySqlPoolOptions::new()
        .max_connections(10)
        .min_connections(5)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&database_url)
        .await
        .expect("Could not connect to database");

    let app_state = Arc::new(AppState { pool });

    let auth_routes = Router::new()
        .route("/signup", post(api::auth::register::create_user))
        .route("/signin", post(api::auth::login::create_login))
        .route("/mfa/verifytotp/:id", patch(api::auth::verifyotp::patch_verifytotp))
        .route("/products/list/:page", get(api::products::list::get_productlist))
        .route("/products/search/:page/:key", get(api::products::search::get_productsearch));

    let user_routes = Router::new()
        .route("/getuserid/:id", get(api::users::getuserid::get_userid))
        .route("/mfa/activate/:id", patch(api::auth::activatemfa::patch_activatemfa))
        .route("/getallusers", get(api::users::getallusers::get_allusers))
        .route("/updateprofile/:id", patch(api::users::updateprofile::patch_updateprofile))
        .route("/uploadpicture/:id", patch(api::users::uploadpicture::patch_uploadpicture))
        .route("/changepassword/:id", patch(api::users::changepassword::change_password))
        .layer(axum::middleware::from_fn(utils::validate_jwt));


    let app = Router::new()
        .route("/", get(root_handler))
        .nest("/api", user_routes)
        .nest("/auth", auth_routes)
        .nest_service("/assets", static_files_service)
        .layer(cors)
        .with_state(Arc::clone(&app_state));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));        
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("Listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app.into_make_service()).await.unwrap();    
}

#[derive(Template)]
#[template(path = "index.html")]
struct RustTemplate<'a> {
    title: &'a str,
}

async fn root_handler() -> Html<String> {
    let template = RustTemplate {
        title: "BARCLAYS BANK",
    };
    let html_content = template.render().unwrap();
    Html(html_content)
}

