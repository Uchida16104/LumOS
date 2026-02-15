use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct ExecRequest {
    pub language: String,
    pub code_snippet: String,
}

#[derive(Serialize)]
pub struct ExecResponse {
    pub success: bool,
    pub output: Option<String>,
    pub stdout: Option<String>,
    pub stderr: Option<String>,
    pub exit_code: Option<i32>,
    pub error: Option<String>,
}

pub fn execute_code(language: &str, code: &str) -> ExecResponse {
    let output = match language {
        "python" => {
            Command::new("python3")
                .arg("-c")
                .arg(code)
                .output()
        },
        "ruby" => {
            Command::new("ruby")
                .arg("-e")
                .arg(code)
                .output()
        },
        "php" => {
            Command::new("php")
                .arg("-r")
                .arg(code)
                .output()
        },
        "node" | "javascript" => {
            Command::new("node")
                .arg("-e")
                .arg(code)
                .output()
        },
        "rust" => {
            std::fs::write("/tmp/temp_rust_code.rs", code).ok();
            Command::new("rustc")
                .arg("/tmp/temp_rust_code.rs")
                .arg("-o")
                .arg("/tmp/temp_rust_binary")
                .output()
                .ok();
            Command::new("/tmp/temp_rust_binary")
                .output()
        },
        "go" => {
            std::fs::write("/tmp/temp_go_code.go", code).ok();
            Command::new("go")
                .arg("run")
                .arg("/tmp/temp_go_code.go")
                .output()
        },
        "bash" | "sh" => {
            Command::new("sh")
                .arg("-c")
                .arg(code)
                .output()
        },
        _ => {
            return ExecResponse {
                success: false,
                output: None,
                stdout: None,
                stderr: None,
                exit_code: None,
                error: Some(format!("Unsupported language: {}", language)),
            };
        }
    };

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout).to_string();
            let stderr = String::from_utf8_lossy(&o.stderr).to_string();
            let combined = format!("{}\n{}", stdout, stderr).trim().to_string();
            
            ExecResponse {
                success: o.status.success(),
                output: Some(combined.clone()),
                stdout: Some(stdout),
                stderr: Some(stderr),
                exit_code: o.status.code(),
                error: if !o.status.success() {
                    Some("Execution failed".to_string())
                } else {
                    None
                },
            }
        },
        Err(e) => {
            ExecResponse {
                success: false,
                output: None,
                stdout: None,
                stderr: None,
                exit_code: None,
                error: Some(format!("Execution error: {}", e)),
            }
        }
    }
}
