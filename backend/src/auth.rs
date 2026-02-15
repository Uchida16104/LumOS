use actix_web::{HttpRequest, HttpResponse, Responder, post, web};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;
use chrono::Utc;
use base64::{Engine as _, engine::general_purpose};

#[derive(Debug, Clone, Serialize)]
pub struct SessionInfo {
    pub username: String,
    pub created_at: i64,
    pub last_activity: i64,
}

#[derive(Debug, Clone)]
pub struct AuthState {
    pub sessions: Arc<Mutex<HashMap<String, SessionInfo>>>,
}

impl AuthState {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub success: bool,
    pub session_id: Option<String>,
    pub username: Option<String>,
    pub error: Option<String>,
}

pub fn verify_basic_auth(req: &HttpRequest, auth_state: &AuthState) -> Result<String, String> {
    let auth_header = req.headers().get("authorization")
        .ok_or("No authorization header")?
        .to_str()
        .map_err(|_| "Invalid authorization header")?;

    if !auth_header.starts_with("Basic ") {
        return Err("Invalid authorization type".to_string());
    }

    let encoded = &auth_header[6..];
    let decoded = general_purpose::STANDARD
        .decode(encoded)
        .map_err(|_| "Failed to decode credentials")?;
    
    let credentials = String::from_utf8(decoded)
        .map_err(|_| "Invalid UTF-8 in credentials")?;
    
    let parts: Vec<&str> = credentials.splitn(2, ':').collect();
    if parts.len() != 2 {
        return Err("Invalid credentials format".to_string());
    }

    let username = parts[0];
    let password = parts[1];

    if username == "admin" && password == "admin123" {
        let session_id = Uuid::new_v4().to_string();
        let mut sessions = auth_state.sessions.lock().unwrap();
        sessions.insert(session_id.clone(), SessionInfo {
            username: username.to_string(),
            created_at: Utc::now().timestamp(),
            last_activity: Utc::now().timestamp(),
        });
        Ok(session_id)
    } else {
        Err("Invalid credentials".to_string())
    }
}

#[post("/auth/login")]
pub async fn login(login_req: web::Json<LoginRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if login_req.username == "admin" && login_req.password == "admin123" {
        let session_id = Uuid::new_v4().to_string();
        let mut sessions = auth_state.sessions.lock().unwrap();
        sessions.insert(session_id.clone(), SessionInfo {
            username: login_req.username.clone(),
            created_at: Utc::now().timestamp(),
            last_activity: Utc::now().timestamp(),
        });
        
        HttpResponse::Ok().json(AuthResponse {
            success: true,
            session_id: Some(session_id),
            username: Some(login_req.username.clone()),
            error: None,
        })
    } else {
        HttpResponse::Unauthorized().json(AuthResponse {
            success: false,
            session_id: None,
            username: None,
            error: Some("Invalid credentials".to_string()),
        })
    }
}

#[post("/auth/logout")]
pub async fn logout(req: HttpRequest, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Some(session_id) = req.headers().get("X-Session-ID") {
        if let Ok(session_id) = session_id.to_str() {
            let mut sessions = auth_state.sessions.lock().unwrap();
            sessions.remove(session_id);
            return HttpResponse::Ok().json(serde_json::json!({
                "success": true,
                "message": "Logged out successfully"
            }));
        }
    }
    HttpResponse::BadRequest().json(serde_json::json!({
        "success": false,
        "error": "Invalid session"
    }))
}
