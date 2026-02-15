use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NetworkRequest {
    pub tool: String,
    pub target: Option<String>,
    pub options: Option<Vec<String>>,
}

#[derive(Serialize)]
pub struct NetworkResponse {
    pub success: bool,
    pub output: Option<String>,
    pub tool: String,
    pub target: Option<String>,
    pub error: Option<String>,
}

pub fn execute_network_tool(tool: &str, target: Option<&str>, options: Option<&Vec<String>>) -> NetworkResponse {
    let target_str = target.unwrap_or("127.0.0.1");
    
    let output = match tool {
        "ping" => {
            Command::new("ping")
                .arg("-c")
                .arg("4")
                .arg(target_str)
                .output()
        },
        "traceroute" => {
            Command::new("traceroute")
                .arg(target_str)
                .output()
        },
        "nmap" => {
            let mut cmd = Command::new("nmap");
            cmd.arg(target_str);
            if let Some(opts) = options {
                for opt in opts {
                    cmd.arg(opt);
                }
            }
            cmd.output()
        },
        "ifconfig" => {
            Command::new("ifconfig")
                .output()
        },
        "ip" => {
            Command::new("ip")
                .arg("addr")
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
        "nslookup" => {
            Command::new("nslookup")
                .arg(target_str)
                .output()
        },
        "dig" => {
            Command::new("dig")
                .arg(target_str)
                .output()
        },
        _ => {
            return NetworkResponse {
                success: false,
                output: None,
                tool: tool.to_string(),
                target: target.map(|s| s.to_string()),
                error: Some(format!("Unsupported network tool: {}", tool)),
            };
        }
    };

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout);
            let stderr = String::from_utf8_lossy(&o.stderr);
            let combined = format!("{}\n{}", stdout, stderr).trim().to_string();
            
            NetworkResponse {
                success: o.status.success(),
                output: Some(combined),
                tool: tool.to_string(),
                target: target.map(|s| s.to_string()),
                error: if !o.status.success() {
                    Some("Tool execution failed".to_string())
                } else {
                    None
                },
            }
        },
        Err(e) => {
            NetworkResponse {
                success: false,
                output: None,
                tool: tool.to_string(),
                target: target.map(|s| s.to_string()),
                error: Some(format!("Network tool error: {}", e)),
            }
        }
    }
}
