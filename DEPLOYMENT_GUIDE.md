# LumOS Complete Deployment Guide

## Frontend Deployment Configuration for Vercel

### Build Settings
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Root Directory: frontend
```

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://lumos-faoy.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://db.lxwracacdahhfxrfchtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Backend Deployment Settings for Render

### Service Settings
```
Name: lumos-backend
Environment: Rust
Region: Singapore
Plan: Free/Starter
Build Command: cargo build --release
Start Command: ./target/release/lumos_backend
Root Directory: backend
```

### Environment Variables
```
DATABASE_URL=postgresql://postgres:LumosLanguage2026@db.lxwracacdahhfxrfchtu.supabase.co:5432/postgres
RUST_LOG=info
JWT_SECRET=lumos-secret-key-change-in-production-2026
ALLOWED_ORIGINS=https://lumos-tawny-seven.vercel.app,http://localhost:3000
PORT=8080
```

## Supabase Database Configuration

1. Log in to your Supabase project
2. Open the SQL Editor
3. Execute the contents of `database/schema.sql`
4. Set the connection string as an environment variable

## Local Development Environment Setup

```bash
git clone https://github.com/Uchida16104/LumOS.git
cd LumOS
cp .env.example .env
npm run install:all
npm run dev
```

## Post-Deployment Verification Items

1. Frontend displays correctly
2. Backend APIs respond (/health, /status)
3. Database connection is established
4. Lumos Language execution and compilation work
5. Network tools function properly