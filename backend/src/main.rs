use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Serialize)]
struct SystemStatus {
    os: String,
    languages_loaded: Vec<String>,
    database: String,
}

#[derive(Deserialize)]
struct ExecRequest {
    language: String,
    code_snippet: String,
}

#[get("/status")]
async fn status() -> impl Responder {
    let status = SystemStatus {
        os: "LumOS Kernel (Rust Host)".to_string(),
        languages_loaded: vec![
            "Rust".to_string(), "Python".to_string(), "PHP".to_string(), 
            "COBOL".to_string(), "Java".to_string(), "Go".to_string()
        ],
        database: "Supabase (PostgreSQL)".to_string(),
    };
    HttpResponse::Ok().json(status)
}

#[post("/execute")]
async fn execute_code(req: web::Json<ExecRequest>) -> impl Responder {
    // SECURITY WARNING: In a real production environment, this requires strict sandboxing (e.g., Firecracker, WebAssembly).
    // This is a conceptual implementation for the LumOS project.
    
    let output = match req.language.as_str() {
        "python" => {
            // Call Python Runtime
            Command::new("python3")
                .arg("-c")
                .arg(&req.code_snippet)
                .output()
        },
        "php" => {
             // Call Laravel/PHP Runtime
             Command::new("php")
                .arg("-r")
                .arg(&req.code_snippet)
                .output()
        },
        // ... Add logic for COBOL, Fortran, etc. using installed system compilers
        _ => return HttpResponse::BadRequest().body("Unsupported language"),
    };

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout);
            let stderr = String::from_utf8_lossy(&o.stderr);
            HttpResponse::Ok().body(format!("STDOUT:\n{}\nSTDERR:\n{}", stdout, stderr))
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Execution failed: {}", e)),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting LumOS Backend Core...");
    HttpServer::new(|| {
        App::new()
            .service(status)
            .service(execute_code)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
