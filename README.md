# LumOS - Universal Polyglot Operating System

<div align="center">

![LumOS Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=300&fit=crop)

**Next-Generation Browser-Based Operating System with Lumos Language Integration**

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Uchida16104/LumOS)
[![Deploy on Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

[Live Demo](https://lumos-tawny-seven.vercel.app) | [Documentation](#documentation) | [Features](#features)

</div>
<div id="documentation">

## 🌟 Overview

LumOS is a revolutionary browser-based operating system that brings the power of the Lumos Language to the web. Execute code in 100+ programming languages, manage files, analyze data, and perform network operations - all from your browser.

### Current Deployment

- **Frontend**: [https://lumos-tawny-seven.vercel.app](https://lumos-tawny-seven.vercel.app)
- **Backend**: [https://lumos-faoy.onrender.com](https://lumos-faoy.onrender.com)
- **Database**: Supabase PostgreSQL (lxwracacdahhfxrfchtu)

</div>
<div id="features">

## ✨ Features

### 🎯 Core Capabilities

- **Lumos Language Integration**: Native support for Lumos Language with real-time execution and multi-target compilation
- **Multi-Language Support**: Execute code in Python, Ruby, PHP, Rust, Go, COBOL, JavaScript, and 100+ languages
- **File Management**: Complete virtual file system with upload, download, edit, and delete operations
- **Network Tools**: ping, traceroute, nmap, SSH, FTP, and comprehensive network analysis
- **Data Analytics**: Built-in data processing, analysis, and visualization tools
- **Terminal Emulator**: Full-featured terminal supporting Linux, macOS, and Windows commands
- **Database Operations**: Direct PostgreSQL integration via Supabase

### 🔧 Technical Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

**Backend**:
- Rust (Actix-Web)
- Node.js (Lumos Engine)
- PostgreSQL (Supabase)
- Redis (Session Management)

**Languages**:
- Lumos Language (Primary)
- Python, Ruby, PHP, JavaScript
- Rust, Go, C, C++, C#
- COBOL, Fortran, Assembly
- And 90+ more...

</div>

## 📊 Architecture

```mermaid
graph TB
    subgraph "Frontend - Vercel"
        A[Next.js App]
        B[Desktop UI]
        C[Terminal]
        D[File Explorer]
        E[Lumos Editor]
        F[Network Tools]
        
        A --> B
        B --> C
        B --> D
        B --> E
        B --> F
    end
    
    subgraph "Backend - Render"
        G[Rust Core]
        H[Lumos Engine]
        I[Code Executor]
        J[Network Handler]
        K[File System]
        
        G --> H
        G --> I
        G --> J
        G --> K
    end
    
    subgraph "Database - Supabase"
        L[(PostgreSQL)]
        M[Files Table]
        N[Logs Table]
        O[Analytics Table]
        
        L --> M
        L --> N
        L --> O
    end
    
    A -->|REST API| G
    G -->|SQL| L
    H -->|Execute| I
    
    style A fill:#0070f3
    style G fill:#f74c00
    style L fill:#3ecf8e
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Rust >= 1.70.0
- PostgreSQL (via Supabase)

### Installation

```bash
git clone https://github.com/Uchida16104/LumOS.git
cd LumOS

cp .env.example .env

npm run install:all

npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-lumos.onrender.com
DATABASE_URL=postgresql://postgres:your-lumos@db.your-code.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://db.your-code.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secret-key
```

## 📚 Documentation

### Lumos Language Examples

#### Hello World

```lumos
let message = "Hello, LumOS!"
print(message)
```

#### Functions and Loops

```lumos
def factorial(n) {
  if (n <= 1) {
    return 1
  }
  return n * factorial(n - 1)
}

for i = 1 to 10 {
  print("Factorial of " + str(i) + " = " + str(factorial(i)))
}
```

#### Compilation to Multiple Targets

```bash
lumos compile script.lumos python
lumos compile script.lumos rust
lumos compile script.lumos javascript
```

### API Endpoints

#### Code Execution

```http
POST /execute
Content-Type: application/json

{
  "language": "python",
  "code_snippet": "print('Hello from Python')"
}
```

#### Lumos Execution

```http
POST /lumos/execute
Content-Type: application/json

{
  "code": "let x = 42\nprint(x)",
  "action": "execute"
}
```

#### Lumos Compilation

```http
POST /lumos/compile
Content-Type: application/json

{
  "code": "def greet(name) { return 'Hello, ' + name }",
  "action": "compile",
  "target": "python"
}
```

## 🎮 Usage

### Desktop Interface

1. Access the live demo at [https://lumos-tawny-seven.vercel.app](https://lumos-tawny-seven.vercel.app)
2. Click on desktop icons to launch applications
3. Drag windows to reposition them
4. Minimize/maximize windows using titlebar buttons

### Terminal Commands

```bash
help
ls
pwd
echo "Hello, LumOS"
python3 -c "print('Python in browser')"
lumos run script.lumos
```

### File Operations

1. Open File Explorer
2. Upload files via drag-and-drop
3. Edit files in the Lumos Editor
4. Execute or compile Lumos files
5. Download generated outputs

## 🔐 Security

**⚠️ Important Security Notes**:

- Default credentials are for development only
- Change all passwords before production deployment
- Network tools require proper authentication
- Command execution is sandboxed
- File uploads are scanned and validated

See [SECURITY.md](docs/SECURITY.md) for detailed guidelines.

## 📦 Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel deploy --prod
```

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Root Directory: `frontend`

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: `https://lumos-faoy.onrender.com`
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

### Render (Backend)

```bash
cd backend
render.yaml configuration will be used automatically
```

**Settings**:
- Build Command: `cargo build --release`
- Start Command: `./target/release/lumos_backend`
- Root Directory: `backend`

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `RUST_LOG`: `info`
- `JWT_SECRET`: Your secret key

### Supabase (Database)

1. Create a new Supabase project
2. Run `database/schema.sql` in SQL Editor
3. Note your connection string
4. Update environment variables

## 🛠️ Development

### Project Structure

- `frontend/`: Next.js frontend application
- `backend/`: Rust backend server
- `backend/lumos-engine/`: Lumos Language interpreter and compiler
- `database/`: SQL schemas and migrations
- `docs/`: Documentation files

### Running Tests

```bash
npm run test
npm run test:frontend
cargo test
```

### Building

```bash
npm run build
npm run build:frontend
npm run build:backend
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 👨‍💻 Author

**Hirotoshi Uchida**

- GitHub: [@Uchida16104](https://github.com/Uchida16104)
- Email: contact@lumos-os.dev

## 🙏 Acknowledgments

- Lumos Language Team
- Rust Community
- Next.js Team
- Supabase Team
- Open Source Contributors

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/Uchida16104/LumOS/issues)
- Documentation: [Read the docs](https://github.com/Uchida16104/LumOS/wiki)
- Community: [Join Discord](https://discord.gg/lumos)

---

<div align="center">

**Built with ❤️ using Lumos Language**

[⬆ Back to Top](#lumos---universal-polyglot-operating-system)

</div>
