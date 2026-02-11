# LumOS - Universal Polyglot Operating System

## Overview
LumOS is a next-generation web-based operating system that runs entirely in the browser, powered by the Lumos Language and supporting multiple programming languages and network tools.

## Features
- **Authentication**: BASIC auth with session management
- **Multi-Language Support**: Python, Ruby, PHP, COBOL, Rust, and more
- **Lumos Language**: Integrated compiler and interpreter
- **Network Tools**: ping, traceroute, nmap, ssh, ftp, ifconfig, arp, tcpdump, tshark
- **Multi-OS Commands**: Linux (Ubuntu, Debian, Kali, CentOS), macOS, Windows
- **File Explorer**: Virtual file system
- **Data Analytics**: Process and analyze data
- **Real-time Terminal**: Interactive command execution

## Architecture
```
Frontend (Vercel) -> Backend (Render) -> Database (Supabase)
      Next.js            Rust+Node           PostgreSQL
```

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Rust >= 1.70.0
- PostgreSQL (via Supabase)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Uchida16104/LumOS.git
cd LumOS
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8080
- Lumos Engine on port 3001

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Render)
```bash
cd backend
cargo build --release
# Deploy to Render
```

## Security Notice

**WARNING**: This system includes powerful tools (SSH, FTP, network scanning, arbitrary command execution) that can pose significant security risks. 

Recommended security measures:
- Use only in controlled, isolated environments
- Implement proper authentication and authorization
- Use firewall rules to restrict access
- Enable logging and monitoring
- Regular security audits
- Never expose to public internet without proper hardening

## Authentication

Default credentials for development:
- Username: admin
- Password: admin123

**IMPORTANT**: Change these credentials before any production use.

## API Endpoints

### Auth
- `POST /auth/login` - Login with credentials
- `POST /auth/logout` - Logout current session

### Code Execution
- `POST /execute` - Execute code in various languages
- `POST /command` - Execute OS commands
- `POST /lumos/execute` - Execute Lumos code
- `POST /lumos/compile` - Compile Lumos to target language

### Network Tools
- `POST /network/tool` - Execute network tools
- `POST /ssh/execute` - SSH command execution
- `POST /ftp/operation` - FTP operations

### Data Processing
- `POST /data/process` - Process and analyze data

### System
- `GET /status` - System status
- `GET /health` - Health check

## Lumos Language Examples

### Hello World
```lumos
print("Hello, World!")
```

### Variables and Functions
```lumos
let x = 42
let name = "Alice"

def greet(person) {
  return "Hello, " + person
}

print(greet(name))
```

### Compilation
```lumos
// Compile to Python
lumos compile --target python hello.lumos

// Compile to Ruby
lumos compile --target ruby hello.lumos
```

## Network Tools Usage

### Ping
```bash
POST /network/tool
{
  "tool": "ping",
  "target": "example.com"
}
```

### Nmap Scan
```bash
POST /network/tool
{
  "tool": "nmap",
  "target": "192.168.1.0/24",
  "options": ["-sn"]
}
```

### SSH Connection
```bash
POST /ssh/execute
{
  "host": "example.com",
  "port": 22,
  "username": "user",
  "password": "pass",
  "command": "ls -la"
}
```

## License
MIT License - see LICENSE file for details

## Author
Hirotoshi Uchida

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Support
For issues and questions, please open an issue on GitHub.
