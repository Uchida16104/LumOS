# LumOS - Universal Polyglot Operating System

Version 2.0.0 - Complete Integration with Lumos Language

## 概要

LumOSは、ブラウザで実行可能な次世代ポリグロットOSです。Lumos Languageを統合し、100以上のプログラミング言語をサポートします。

## アーキテクチャ

```
フロントエンド (Vercel)
├── Next.js 14 + React 18
├── TypeScript
├── Tailwind CSS
├── Framer Motion
└── Lumos Language REPL

バックエンド (Render)
├── Rust (Actix-web)
├── Lumos Language Engine (Node.js)
├── Python Runtime
├── PHP/Laravel Runtime
└── その他の言語ランタイム

データベース
└── Supabase (PostgreSQL)
```

## デプロイURL

- **フロントエンド**: https://lumos-tawny-seven.vercel.app/
- **バックエンド**: https://lumos-faoy.onrender.com
- **データベース**: postgresql://postgres:LumosLanguage2026@db.lxwracacdahhfxrfchtu.supabase.co:5432/postgres

## 機能

### コア機能
- Lumos Language統合インタプリタ
- 100以上の言語へのコンパイル
- リアルタイムコード実行
- 仮想ファイルシステム
- ターミナルエミュレータ
- システムモニタリング

### ネットワーク機能
- SSH接続
- ネットワーク分析
- 外部API通信
- WebSocket通信

### データ処理
- データ分析エンジン
- リアルタイムデータ処理
- データ可視化

## セットアップ

### 前提条件
- Node.js 18以上
- Rust 1.70以上
- npm 9以上

### インストール

```bash
git clone https://github.com/Uchida16104/LumOS.git
cd LumOS
npm run install:all
```

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

## ディレクトリ構造

```
lumos-os-complete/
├── package.json
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── vercel.json
├── frontend/
│   ├── package.json
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
├── backend/
│   ├── Cargo.toml
│   ├── render.yaml
│   ├── src/
│   │   └── main.rs
│   ├── lumos-engine/
│   │   ├── package.json
│   │   ├── src/
│   │   └── examples/
│   └── runtimes/
└── database/
    └── schema.sql
```

## ライセンス

MIT License - Copyright (c) 2026 Hirotoshi Uchida

## 作成者

Hirotoshi Uchida

## リンク

- [Lumos Language](https://github.com/Uchida16104/Lumos-Language)
- [公式サイト](https://lumos-tawny-seven.vercel.app/)
