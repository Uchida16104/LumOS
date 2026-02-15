use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct LumosRequest {
    pub code: String,
    pub action: String,
    pub target: Option<String>,
}

#[derive(Serialize)]
pub struct LumosResponse {
    pub success: bool,
    pub output: Option<String>,
    pub compiled: Option<String>,
    pub target: Option<String>,
    pub error: Option<String>,
}

pub fn execute_lumos(code: &str) -> LumosResponse {
    std::fs::write("/tmp/temp_lumos.lumos", code).ok();
    
    let output = Command::new("node")
        .arg("/app/backend/lumos-engine/index.cjs")
        .arg("/tmp/temp_lumos.lumos")
        .output();

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout).to_string();
            let stderr = String::from_utf8_lossy(&o.stderr).to_string();
            
            LumosResponse {
                success: o.status.success(),
                output: Some(if stderr.is_empty() { stdout } else { format!("{}\n{}", stdout, stderr) }),
                compiled: None,
                target: None,
                error: if !o.status.success() { Some("Execution failed".to_string()) } else { None },
            }
        },
        Err(e) => {
            LumosResponse {
                success: false,
                output: None,
                compiled: None,
                target: None,
                error: Some(format!("Lumos execution error: {}", e)),
            }
        }
    }
}

pub fn compile_lumos(code: &str, target: &str) -> LumosResponse {
    std::fs::write("/tmp/temp_lumos.lumos", code).ok();
    
    let output = Command::new("node")
        .arg("/app/backend/lumos-engine/index.cjs")
        .arg("compile")
        .arg("/tmp/temp_lumos.lumos")
        .arg(target)
        .output();

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout).to_string();
            let stderr = String::from_utf8_lossy(&o.stderr).to_string();
            
            LumosResponse {
                success: o.status.success(),
                output: None,
                compiled: Some(if stderr.is_empty() { stdout } else { format!("{}\n{}", stdout, stderr) }),
                target: Some(target.to_string()),
                error: if !o.status.success() { Some("Compilation failed".to_string()) } else { None },
            }
        },
        Err(e) => {
            LumosResponse {
                success: false,
                output: None,
                compiled: None,
                target: Some(target.to_string()),
                error: Some(format!("Lumos compilation error: {}", e)),
            }
        }
    }
}
