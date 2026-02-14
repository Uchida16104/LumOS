use actix_web::{get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder, middleware};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use std::process::Command;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use base64::{Engine as _, engine::general_purpose};
use chrono::Utc;
use log::{info, warn, error};

#[derive(Debug, Clone)]
struct AuthState {
    sessions: Arc<Mutex<HashMap<String, SessionInfo>>>,
}

#[derive(Debug, Clone, Serialize)]
struct SessionInfo {
    username: String,
    created_at: i64,
    last_activity: i64,
}

#[derive(Serialize)]
struct SystemStatus {
    os: String,
    version: String,
    languages_loaded: Vec<String>,
    database: String,
    uptime: String,
    hostname: String,
    network_tools_available: Vec<String>,
}

#[derive(Deserialize)]
struct ExecRequest {
    language: String,
    code_snippet: String,
}

#[derive(Deserialize)]
struct CommandRequest {
    command: String,
    os_type: Option<String>,
}

#[derive(Deserialize)]
struct LumosRequest {
    code: String,
    action: String,
    target: Option<String>,
}

#[derive(Deserialize)]
struct AuthRequest {
    username: String,
    password: String,
}

#[derive(Deserialize)]
struct NetworkRequest {
    tool: String,
    target: Option<String>,
    options: Option<Vec<String>>,
}

#[derive(Deserialize)]
struct DataProcessRequest {
    data: serde_json::Value,
    operation: String,
}

#[derive(Serialize)]
struct ApiResponse {
    success: bool,
    message: Option<String>,
    data: Option<serde_json::Value>,
    error: Option<String>,
}

impl ApiResponse {
    fn success(data: serde_json::Value) -> Self {
        Self {
            success: true,
            message: None,
            data: Some(data),
            error: None,
        }
    }

    fn error(error: String) -> Self {
        Self {
            success: false,
            message: None,
            data: None,
            error: Some(error),
        }
    }
}

fn verify_basic_auth(req: &HttpRequest, auth_state: &AuthState) -> Result<String, String> {
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
        let session_id = uuid::Uuid::new_v4().to_string();
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

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "timestamp": Utc::now().to_rfc3339()
    }))
}

#[get("/status")]
async fn status() -> impl Responder {
    let hostname = hostname::get()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    let status = SystemStatus {
        os: "LumOS Kernel (Rust Host)".to_string(),
        version: "2.1.0".to_string(),
        languages_loaded: vec![
            "Lumos".to_string(),
            "Rust".to_string(),
            "Python".to_string(),
            "Ruby".to_string(),
            "PHP".to_string(),
            "COBOL".to_string(),
            "Java".to_string(),
            "Go".to_string(),
            "JavaScript".to_string(),
        ],
        database: "Supabase (PostgreSQL)".to_string(),
        uptime: "Active".to_string(),
        hostname,
        network_tools_available: vec![
            "ping".to_string(),
            "traceroute".to_string(),
            "nmap".to_string(),
            "ifconfig".to_string(),
            "arp".to_string(),
            "netstat".to_string(),
        ],
    };
    HttpResponse::Ok().json(status)
}

#[post("/auth/login")]
async fn login(auth_req: web::Json<AuthRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if auth_req.username == "admin" && auth_req.password == "admin123" {
        let session_id = uuid::Uuid::new_v4().to_string();
        let mut sessions = auth_state.sessions.lock().unwrap();
        sessions.insert(session_id.clone(), SessionInfo {
            username: auth_req.username.clone(),
            created_at: Utc::now().timestamp(),
            last_activity: Utc::now().timestamp(),
        });
        
        HttpResponse::Ok().json(ApiResponse::success(serde_json::json!({
            "session_id": session_id,
            "username": auth_req.username
        })))
    } else {
        HttpResponse::Unauthorized().json(ApiResponse::error("Invalid credentials".to_string()))
    }
}

#[post("/auth/logout")]
async fn logout(req: HttpRequest, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Some(session_id) = req.headers().get("X-Session-ID") {
        if let Ok(session_id) = session_id.to_str() {
            let mut sessions = auth_state.sessions.lock().unwrap();
            sessions.remove(session_id);
            return HttpResponse::Ok().json(ApiResponse::success(serde_json::json!({
                "message": "Logged out successfully"
            })));
        }
    }
    HttpResponse::BadRequest().json(ApiResponse::error("Invalid session".to_string()))
}

#[post("/execute")]
async fn execute_code(req: HttpRequest, exec_req: web::Json<ExecRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Err(e) = verify_basic_auth(&req, &auth_state) {
        return HttpResponse::Unauthorized().json(ApiResponse::error(e));
    }

    let output = match exec_req.language.as_str() {
        "python" => {
            Command::new("python3")
                .arg("-c")
                .arg(&exec_req.code_snippet)
                .output()
        },
        "ruby" => {
            Command::new("ruby")
                .arg("-e")
                .arg(&exec_req.code_snippet)
                .output()
        },
        "php" => {
            Command::new("php")
                .arg("-r")
                .arg(&exec_req.code_snippet)
                .output()
        },
        "rust" => {
            std::fs::write("/tmp/temp_rust_code.rs", &exec_req.code_snippet)
                .unwrap_or_default();
            Command::new("rustc")
                .arg("/tmp/temp_rust_code.rs")
                .arg("-o")
                .arg("/tmp/temp_rust_binary")
                .output()
                .ok();
            Command::new("/tmp/temp_rust_binary")
                .output()
        },
        _ => return HttpResponse::BadRequest().json(ApiResponse::error("Unsupported language".to_string())),
    };

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout);
            let stderr = String::from_utf8_lossy(&o.stderr);
            HttpResponse::Ok().json(ApiResponse::success(serde_json::json!({
                "stdout": stdout,
                "stderr": stderr,
                "output": format!("{}\n{}", stdout, stderr),
                "exit_code": o.status.code().unwrap_or(-1)
            })))
        },
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::error(format!("Execution failed: {}", e))),
    }
}

#[post("/command")]
async fn execute_command(req: HttpRequest, cmd_req: web::Json<CommandRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Err(e) = verify_basic_auth(&req, &auth_state) {
        return HttpResponse::Unauthorized().json(ApiResponse::error(e));
    }

    let os_type = cmd_req.os_type.as_deref().unwrap_or("linux");
    
    let output = match os_type {
        "linux" | "ubuntu" | "debian" | "kali" | "centos" | "macos" => {
            Command::new("sh")
                .arg("-c")
                .arg(&cmd_req.command)
                .output()
        },
        "windows" => {
            Command::new("cmd")
                .arg("/C")
                .arg(&cmd_req.command)
                .output()
        },
        "powershell" => {
            Command::new("powershell")
                .arg("-Command")
                .arg(&cmd_req.command)
                .output()
        },
        _ => return HttpResponse::BadRequest().json(ApiResponse::error("Unsupported OS type".to_string())),
    };

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout);
            let stderr = String::from_utf8_lossy(&o.stderr);
            HttpResponse::Ok().json(ApiResponse::success(serde_json::json!({
                "output": format!("{}\n{}", stdout, stderr),
                "exit_code": o.status.code().unwrap_or(-1)
            })))
        },
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::error(format!("Command execution failed: {}", e))),
    }
}

#[post("/network/tool")]
async fn network_tool(req: HttpRequest, net_req: web::Json<NetworkRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Err(e) = verify_basic_auth(&req, &auth_state) {
        return HttpResponse::Unauthorized().json(ApiResponse::error(e));
    }

    let target = net_req.target.as_deref().unwrap_or("127.0.0.1");
    
    let output = match net_req.tool.as_str() {
        "ping" => {
            Command::new("ping")
                .arg("-c")
                .arg("4")
                .arg(target)
                .output()
        },
        "traceroute" => {
            Command::new("traceroute")
                .arg(target)
                .output()
        },
        "nmap" => {
            let mut cmd = Command::new("nmap");
            cmd.arg(target);
            if let Some(options) = &net_req.options {
                for opt in options {
                    cmd.arg(opt);
                }
            }
            cmd.output()
        },
        "ifconfig" => {
            Command::new("ifconfig")
                .output()
        },
        "arp" => {
            Command::new("arp")
                .arg("-a")
                .output()
        },
        "netstat" => {
            Command::new("netstat")
                .arg("-tuln")
                .output()
        },
        _ => return HttpResponse::BadRequest().json(ApiResponse::error("Unsupported network tool".to_string())),
    };

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout);
            let stderr = String::from_utf8_lossy(&o.stderr);
            HttpResponse::Ok().json(ApiResponse::success(serde_json::json!({
                "output": format!("{}\n{}", stdout, stderr),
                "tool": net_req.tool,
                "target": target
            })))
        },
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::error(format!("Tool execution failed: {}", e))),
    }
}

#[post("/lumos/execute")]
async fn lumos_execute(req: HttpRequest, lumos_req: web::Json<LumosRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Err(e) = verify_basic_auth(&req, &auth_state) {
        return HttpResponse::Unauthorized().json(ApiResponse::error(e));
    }

    std::fs::write("/tmp/temp_lumos.lumos", &lumos_req.code).unwrap_or_default();
    
    let output = Command::new("node")
        .arg("/app/backend/lumos-engine/index.cjs")
        .arg("/tmp/temp_lumos.lumos")
        .output();

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout);
            let stderr = String::from_utf8_lossy(&o.stderr);
            HttpResponse::Ok().json(ApiResponse::success(serde_json::json!({
                "output": stdout.to_string(),
                "error": stderr.to_string(),
                "success": o.status.success()
            })))
        },
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::error(format!("Lumos execution failed: {}", e))),
    }
}

#[post("/lumos/compile")]
async fn lumos_compile(req: HttpRequest, lumos_req: web::Json<LumosRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Err(e) = verify_basic_auth(&req, &auth_state) {
        return HttpResponse::Unauthorized().json(ApiResponse::error(e));
    }

    let target = lumos_req.target.as_deref().unwrap_or("python");
    
    std::fs::write("/tmp/temp_lumos.lumos", &lumos_req.code).unwrap_or_default();
    
    let output = Command::new("node")
        .arg("/app/backend/lumos-engine/index.cjs")
        .arg("compile")
        .arg("/tmp/temp_lumos.lumos")
        .arg(target)
        .output();

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout);
            HttpResponse::Ok().json(ApiResponse::success(serde_json::json!({
                "compiled": stdout.to_string(),
                "target": target,
                "success": o.status.success()
            })))
        },
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse::error(format!("Lumos compilation failed: {}", e))),
    }
}

#[post("/data/process")]
async fn data_process(req: HttpRequest, data_req: web::Json<DataProcessRequest>, auth_state: web::Data<AuthState>) -> impl Responder {
    if let Err(e) = verify_basic_auth(&req, &auth_state) {
        return HttpResponse::Unauthorized().json(ApiResponse::error(e));
    }

    let result = match data_req.operation.as_str() {
        "sum" => {
            if let Some(arr) = data_req.data.as_array() {
                let sum: f64 = arr.iter()
                    .filter_map(|v| v.as_f64())
                    .sum();
                serde_json::json!({ "sum": sum })
            } else {
                serde_json::json!({ "error": "Invalid data format" })
            }
        },
        "average" => {
            if let Some(arr) = data_req.data.as_array() {
                let values: Vec<f64> = arr.iter()
                    .filter_map(|v| v.as_f64())
                    .collect();
                let avg = if !values.is_empty() {
                    values.iter().sum::<f64>() / values.len() as f64
                } else {
                    0.0
                };
                serde_json::json!({ "average": avg })
            } else {
                serde_json::json!({ "error": "Invalid data format" })
            }
        },
        "count" => {
            if let Some(arr) = data_req.data.as_array() {
                serde_json::json!({ "count": arr.len() })
            } else {
                serde_json::json!({ "error": "Invalid data format" })
            }
        },
        _ => serde_json::json!({ "error": "Unsupported operation" }),
    };

    HttpResponse::Ok().json(ApiResponse::success(result))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    info!("Starting LumOS Backend Core v2.1.0...");
    
    let auth_state = web::Data::new(AuthState {
        sessions: Arc::new(Mutex::new(HashMap::new())),
    });

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .unwrap_or(8080);

    info!("Server will listen on 0.0.0.0:{}", port);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("https://lumos-tawny-seven.vercel.app")
            .allowed_origin("http://localhost:3000")
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .app_data(auth_state.clone())
            .service(health)
            .service(status)
            .service(login)
            .service(logout)
            .service(execute_code)
            .service(execute_command)
            .service(network_tool)
            .service(lumos_execute)
            .service(lumos_compile)
            .service(data_process)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
