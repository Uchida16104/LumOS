# Deployment Guide for LumOS

## Prerequisites

### System Requirements
- Node.js >= 18.0.0
- Rust >= 1.70.0
- PostgreSQL 14+ (via Supabase recommended)
- 2GB RAM minimum
- 10GB disk space

## Frontend Deployment (Vercel)

### Build Settings
- Framework Preset: Next.js
- Build Command: npm run build
- Output Directory: .next
- Install Command: npm install
- Root Directory: frontend

### Environment Variables
- NEXT_PUBLIC_API_URL: Backend URL
- NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anonymous key

## Backend Deployment (Render)

### Service Settings
- Environment: Rust
- Build Command: cargo build --release
- Start Command: ./target/release/lumos_backend
- Root Directory: backend

### Environment Variables
- DATABASE_URL: PostgreSQL connection string
- RUST_LOG: info
- JWT_SECRET: Strong random secret
- ALLOWED_ORIGINS: Frontend domain
- PORT: 8080

## Database Setup (Supabase)

Execute the SQL schema from database/schema.sql in your Supabase project SQL Editor.

## Post-Deployment Verification

Verify that the frontend displays correctly, backend APIs respond properly, database connection is established, Lumos Language execution works, and network tools function as expected.
