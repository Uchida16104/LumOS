#!/bin/bash

# This script creates all LumOS project files

# Create LICENSE
cat > LICENSE << 'EOFLICENSE'
MIT License

Copyright (c) 2026 Hirotoshi Uchida

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOFLICENSE

# Create package.json
cat > package.json << 'EOFPKG'
{
  "name": "lumos-os",
  "version": "2.1.0",
  "description": "LumOS - Universal Polyglot Operating System with Lumos Language Integration",
  "private": true,
  "workspaces": [
    "frontend",
    "backend/lumos-engine"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\" \"npm run dev:lumos\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && cargo run",
    "dev:lumos": "cd backend/lumos-engine && node index.cjs",
    "build": "npm run build:frontend && npm run build:backend && npm run build:lumos",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && cargo build --release",
    "build:lumos": "cd backend/lumos-engine && npm install",
    "install:all": "npm install && cd frontend && npm install && cd ../backend/lumos-engine && npm install",
    "start": "npm run start:frontend",
    "start:frontend": "cd frontend && npm start",
    "start:backend": "cd backend && ./target/release/lumos_backend",
    "test": "npm run test:frontend && npm run test:backend",
    "test:frontend": "cd frontend && npm run test",
    "test:backend": "cd backend && cargo test",
    "lint": "npm run lint:frontend",
    "lint:frontend": "cd frontend && npm run lint",
    "clean": "rm -rf frontend/.next frontend/node_modules backend/target backend/lumos-engine/node_modules node_modules",
    "deploy:vercel": "cd frontend && vercel deploy --prod",
    "deploy:render": "cd backend && git push render main"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "keywords": [
    "lumos",
    "os",
    "polyglot",
    "compiler",
    "interpreter",
    "network-tools",
    "terminal",
    "web-os",
    "browser-os",
    "multi-language"
  ],
  "author": "Hirotoshi Uchida",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Uchida16104/LumOS.git"
  },
  "bugs": {
    "url": "https://github.com/Uchida16104/LumOS/issues"
  },
  "homepage": "https://lumos-tawny-seven.vercel.app"
}
EOFPKG

echo "Root configuration files created"

