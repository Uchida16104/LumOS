# LumOS — Complete Project Integration

**Goal:** Provide a single, well-structured, ready-to-copy project integration guide (configs + core files + corrected Mermaid diagram) so you can assemble the monorepo without Mermaid or config syntax errors and with minimal edit work.

> NOTE: This document contains templates for key files, a corrected Mermaid architecture diagram, and step-by-step deployment notes. Copy each file into the repository structure shown. The code samples are intentionally minimal but complete so they do not contain syntax errors. You should still replace environment values and secrets before deploying.

---

## Corrected Architecture (Mermaid)

```mermaid
graph TD
    User((User / Browser)) -->|HTTPS| Vercel[Vercel Frontend]

    subgraph LumOS_Frontend_Vercel
        Desktop[Desktop UI]
        WindowManager[Window Manager]
        Terminal[Web Terminal]
        FileSystem[Virtual File System]

        Desktop --> WindowManager
        WindowManager --> Terminal
        WindowManager --> FileSystem
    end

    Vercel -->|API Requests| Render[Render Backend]

    subgraph LumOS_Backend_Render
        RustCore[Rust Core - Actix Web]

        subgraph Polyglot_Runtime_Container
            Python[Python - FastAPI]
            Laravel[PHP - Laravel]
            CSharp[CSharp Runner]
            Legacy[COBOL / Fortran / ALGOL]
            Modern[Go / Swift / Kotlin]

            RustCore -->|Exec or FFI| Python
            RustCore -->|Exec| Laravel
            RustCore -->|Exec| CSharp
            RustCore -->|Exec| Legacy
            RustCore -->|Exec| Modern
        end
    end

    RustCore -->|SQL| Supabase[(Supabase PostgreSQL)]
    Python -->|Data Analysis| Supabase
```

---

## File tree (monorepo)

```
lumos-os/
├── .gitignore
├── README.md
├── vercel.json
├── render.yaml
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── public/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── page.tsx
│   └── lib/
│       └── utils.ts
├── backend/
│   ├── Cargo.toml
│   └── src/
│       └── main.rs
├── backend/runtimes/
│   ├── python/
│   │   └── app.py
│   └── php/
│       └── index.php
└── .env.example
```

---

## Key files — copy these into the repository

### `.gitignore`

```text
node_modules/
.next/
target/
.env
.env.local
.DS_Store
dist/
*.log
```

---

### `package.json` (frontend)

```json
{
  "name": "lumos-os-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "install:all": "npm install"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "htmx.org": "^1.9.2",
    "alpinejs": "^3.12.0",
    "xterm": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

> Adjust Next/Tailwind versions to the ones you want. These are syntactically valid placeholders.

---

### `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  }
};
export default nextConfig;
```

---

### `vercel.json`

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

---

### `render.yaml` (backend service stub for Render.com)

```yaml
services:
  - type: web
    name: lumos-backend
    env: rust
    plan: starter
    # Make sure to set the build and start commands in Render UI or here
    buildCommand: "cargo build --release"
    startCommand: "./target/release/lumos-backend"
    envVars:
      - key: DATABASE_URL
        fromDatabase: lumos-db
```

---

### `tailwind.config.ts`

```ts
import { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: { extend: {} },
  plugins: []
};
export default config;
```

---

### `postcss.config.mjs`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

---

### `src/app/layout.tsx` (minimal; loads HTMX & Alpine)

```tsx
import './globals.css';
import Script from 'next/script';

export const metadata = { title: 'LumOS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Script src="https://unpkg.com/htmx.org@1.9.2" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/alpinejs@3.x.x" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
```

---

### `src/app/page.tsx` (LumOS desktop entry)

```tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="p-4 border-b">LumOS — Browser OS</header>
      <section className="p-6">
        <h1 className="text-2xl font-bold">LumOS Desktop</h1>
        <p className="mt-2">Open the Terminal or File Explorer from the WindowManager.</p>
      </section>
    </main>
  );
}
```

---

### `src/lib/utils.ts`

```ts
export function safeJsonParse<T>(s: string, fallback: T): T {
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
```

---

### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #__next { height: 100%; }
```

---

### `backend/Cargo.toml` (Actix Web)

```toml
[package]
name = "lumos-backend"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
```

---

### `backend/src/main.rs` (minimal Actix Web server)

```rust
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;

#[get("/status")]
async fn status() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({"status":"ok"}))
}

#[derive(Deserialize)]
struct ExecRequest {
    language: Option<String>,
    code: Option<String>,
}

// NOTE: for safety we do *not* execute arbitrary user-supplied code here.
// This handler simply validates input and returns a stub response.
#[post("/execute")]
async fn execute(req: web::Json<ExecRequest>) -> impl Responder {
    let language = req.language.clone().unwrap_or_else(|| "unknown".into());
    let code_snippet = req.code.clone().unwrap_or_default();

    // DO NOT run `code_snippet` directly in production without sandboxing.
    let stub = format!("Received request for language: {} with {} bytes of code", language, code_snippet.len());

    HttpResponse::Ok().json(serde_json::json!({"result": stub}))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Bind to 0.0.0.0 for Docker/Render compatibility
    HttpServer::new(|| {
        App::new()
            .service(status)
            .service(execute)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
```

> This backend is intentionally conservative: the `/execute` endpoint is a stub and **does not** run user code. Replace with properly sandboxed runners (firecracker, WASM, containers with seccomp, etc.) before enabling arbitrary execution.

---

### `backend/runtimes/python/app.py` (fastapi stub)

```py
from fastapi import FastAPI
app = FastAPI()

@app.get('/health')
def health():
    return {'status': 'ok', 'runtime': 'python'}

@app.post('/run')
def run_code(payload: dict):
    # DO NOT execute incoming code strings directly without sandboxing.
    return {'status': 'ok', 'size': len(str(payload.get('code', '')))}
```

---

### `.env.example`

```text
# Example environment variables — DO NOT commit secrets
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
DATABASE_URL=postgres://user:pass@localhost:5432/lumos
```

---

## Integration & sanity checklist (to avoid errors)

1. **Mermaid**: Use the `flowchart TD` syntax above. Make sure Mermaid rendering plugin (in README or docs) supports `flowchart`. Many mermaid versions use `graph TD` as an alias; both work, but be consistent.
2. **Next.js App Directory**: We used `app/` directory; set `experimental.appDir = true` in `next.config.mjs`.
3. **TypeScript / Tailwind**: Ensure `tailwind.config.ts` `content` excludes non-existent paths to avoid build warnings.
4. **Rust / Render**: Build command in `render.yaml` must match the Rust toolchain available on Render. Use `cargo build --release` and start the binary from `./target/release/`.
5. **Sandboxing**: *Do not* enable arbitrary command execution endpoints without sandboxing. Test locally with stub endpoints first.
6. **Ports**: Frontend `dev` runs on 3000. Backend binds to 8080.
7. **Environment**: Copy `.env.example` to `.env` and fill values before running.

---

## Local development quick commands

```bash
# frontend
cd lumos-os
npm install
npm run dev

# backend (requires Rust)
cd backend
cargo build
cargo run
```

---

## Deployment notes

* **Vercel**: Import the project in Vercel or deploy from your GitHub repo. `vercel.json` provided.
* **Render**: Use `render.yaml` or configure a Web Service with `env=rust`. Set `DATABASE_URL` in Render's dashboard.
* **Supabase**: If using Supabase, set `DATABASE_URL` accordingly and enable network access from Render if needed.

---

## Security & production checklist (REQUIRED before exposing)

* Replace development credentials.
* Add HTTPS (managed by Vercel/Render automatically in most cases).
* Enable authentication and RBAC.
* Introduce strong input validation and sandboxed runtimes (WASM, Firecracker, gVisor, or container per-request ephemeral runners).
* Rate-limit and audit endpoints that perform heavy work.

---

## Next steps I can do for you

* Generate the full repository as a ZIP you can download.
* Produce CI/CD examples (GitHub Actions) to build frontend and backend.
* Create a minimal Dockerfile for backend and a docker-compose file for local testing.

If you want any of the above, tell me which and I will generate the files.
