# LumOS デプロイメントガイド

## 概要

このドキュメントでは、LumOSを本番環境にデプロイするための手順を説明します。

## アーキテクチャ

### フロントエンド (Vercel)
- Next.js 14 アプリケーション
- URL: https://lumos-tawny-seven.vercel.app/
- リージョン: 東京 (hnd1)

### バックエンド (Render)
- Rust (Actix-web) サーバー
- Lumos Language Engine (Node.js)
- URL: https://lumos-faoy.onrender.com
- リージョン: シンガポール

### データベース (Supabase)
- PostgreSQL 15
- 接続文字列: postgresql://postgres:LumosLanguage2026@db.lxwracacdahhfxrfchtu.supabase.co:5432/postgres

## フロントエンドデプロイメント (Vercel)

### 前提条件
- Vercel アカウント
- GitHubリポジトリへのアクセス

### 手順

1. Vercelダッシュボードにログイン
2. 「New Project」をクリック
3. GitHubリポジトリを接続
4. プロジェクト設定:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. 環境変数の設定:
   ```
   NEXT_PUBLIC_API_URL=https://lumos-faoy.onrender.com
   NEXT_PUBLIC_WS_URL=wss://lumos-faoy.onrender.com/ws
   NEXT_PUBLIC_SUPABASE_URL=https://db.lxwracacdahhfxrfchtu.supabase.co
   ```

6. 「Deploy」をクリック

### 自動デプロイメント
- `main`ブランチへのプッシュで自動デプロイ
- プレビュー環境は各プルリクエストで自動作成

## バックエンドデプロイメント (Render)

### 前提条件
- Render アカウント
- GitHubリポジトリへのアクセス

### 手順

1. Renderダッシュボードにログイン
2. 「New Web Service」をクリック
3. GitHubリポジトリを接続
4. サービス設定:
   - Name: lumos-backend
   - Region: Singapore
   - Branch: main
   - Root Directory: `backend`
   - Environment: Rust
   - Build Command: `cargo build --release`
   - Start Command: `./target/release/lumos_backend`

5. 環境変数の設定:
   ```
   DATABASE_URL=postgresql://postgres:LumosLanguage2026@db.lxwracacdahhfxrfchtu.supabase.co:5432/postgres
   RUST_LOG=info
   PORT=8080
   LUMOS_ENGINE_PATH=/opt/render/project/src/backend/lumos-engine/src/index.js
   ```

6. 「Create Web Service」をクリック

### Lumos Engine セットアップ

バックエンドのデプロイ前に、Lumos Language Engineの依存関係をインストール:

```bash
cd backend/lumos-engine
npm install
```

### ヘルスチェック

Renderはヘルスチェックエンドポイント (`/health`) を自動的に監視します。

## データベースセットアップ (Supabase)

### 前提条件
- Supabase プロジェクト

### 手順

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. SQLエディタを開く
4. `database/schema.sql`の内容を実行
5. Row Level Security (RLS) が有効になっていることを確認
6. 接続文字列をコピー

### 認証設定

Supabase Authを使用する場合:
1. Authentication > Providers で必要なプロバイダーを有効化
2. Site URL を設定 (例: https://lumos-tawny-seven.vercel.app/)
3. Redirect URLs を追加

## 環境変数管理

### 開発環境

`.env.local`ファイルを作成:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_SUPABASE_URL=https://db.lxwracacdahhfxrfchtu.supabase.co
DATABASE_URL=postgresql://postgres:LumosLanguage2026@db.lxwracacdahhfxrfchtu.supabase.co:5432/postgres
```

### 本番環境

各プラットフォームの環境変数設定UIで設定します。

## デプロイメント確認

### フロントエンド

1. https://lumos-tawny-seven.vercel.app/ にアクセス
2. デスクトップUIが表示されることを確認
3. ターミナルウィンドウを開いてコマンドを実行

### バックエンド

1. https://lumos-faoy.onrender.com/status にアクセス
2. システムステータスが返されることを確認
3. https://lumos-faoy.onrender.com/health でヘルスチェック

### データベース

1. Supabaseダッシュボードで接続を確認
2. Table Editor でテーブルが作成されていることを確認

## トラブルシューティング

### フロントエンドビルドエラー

- `npm install` を実行して依存関係を更新
- `next.config.mjs` の設定を確認
- Vercel ビルドログを確認

### バックエンドビルドエラー

- Rustのバージョンを確認 (1.70以上)
- `Cargo.toml` の依存関係を確認
- Render ビルドログを確認

### データベース接続エラー

- 接続文字列を確認
- Supabase プロジェクトがアクティブか確認
- ファイアウォールルールを確認

## パフォーマンス最適化

### フロントエンド

- 画像最適化 (Next.js Image component)
- コード分割
- キャッシング戦略

### バックエンド

- コンパイル時最適化 (`--release`)
- データベース接続プーリング
- Redis キャッシング (オプション)

## モニタリング

### Vercel Analytics

Vercelダッシュボードで以下を監視:
- デプロイメント履歴
- ビルド時間
- エラーレート

### Render Monitoring

Renderダッシュボードで以下を監視:
- CPU/メモリ使用率
- リクエスト数
- レスポンスタイム

### Supabase Monitoring

Supabaseダッシュボードで以下を監視:
- データベース接続数
- クエリパフォーマンス
- ストレージ使用量

## セキュリティ

### 環境変数

- すべての秘密情報は環境変数として管理
- `.env.example` を参照して設定

### CORS

- バックエンドでCORS設定を適切に構成
- 本番環境では特定のオリジンのみ許可

### データベース

- Row Level Security (RLS) を必ず有効化
- 最小権限の原則に従う

## バックアップ

### データベース

Supabaseは自動バックアップを提供:
- 日次バックアップ (Free Plan: 7日間保持)
- ポイントインタイムリカバリ (Pro Plan以上)

手動バックアップも可能:
```bash
pg_dump $DATABASE_URL > backup.sql
```

## スケーリング

### 水平スケーリング

Render では自動スケーリング設定が可能:
1. Scaling タブを開く
2. インスタンス数を設定
3. 自動スケーリングルールを定義

### 垂直スケーリング

より大きなインスタンスタイプに変更:
1. Instance Type を選択
2. より高性能なプランを選択

## 継続的インテグレーション/デプロイメント (CI/CD)

### GitHub Actions

`.github/workflows/deploy.yml` でCI/CDパイプラインを構成:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## サポート

問題が発生した場合:
1. GitHubイシューを作成
2. デプロイメントログを確認
3. 環境変数を再確認
4. ドキュメントを参照

## まとめ

このガイドに従うことで、LumOSを本番環境に正常にデプロイできます。各ステップを慎重に実行し、デプロイメント後は必ず動作確認を行ってください。
