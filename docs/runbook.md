# Runbook

[msykn.com](https://msykn.com/) のローカル開発・CI/CD・障害時の参照用。

## ローカル開発

```bash
npm ci
# .env.local は README の環境変数一覧を参照して作成
npm run dev
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー（Turbopack） |
| `npm run lint` | Biome |
| `npm run test` | Vitest |
| `npm run build` | 静的エクスポート → `out/` |

ビルドには Contentful CDA トークンが必要。未設定だと取得エラーでビルド失敗または空ページになる。

## 環境変数

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `CTF_SPACE_ID` | yes | Contentful Space ID |
| `CTF_CDA_ACCESS_TOKEN` | yes | CDA 読み取りトークン |
| `CTF_BLOG_POST_TYPE_ID` | yes | Blog Post Content Type ID |
| `SEND_MESSAGE_API` | prod yes | 問い合わせ API Gateway の URL（ビルド時に Client へ埋め込み） |

CI では `.github/workflows/deploy.yml` が `.env.production` を secrets から生成する。

## デプロイ（GitHub Actions）

**トリガー**

- `main` への push
- Contentful Webhook からの `repository_dispatch`

**パイプライン**

1. `npm run lint` / `npm test`
2. `npm run build`（Contentful 取得込み）
3. `out/` を S3 sync（`--delete`）
4. CloudFront invalidation（`/*`）

図: [README](../README.md#ビルド時cicd)

### 必要な GitHub Secrets

| Secret | 用途 |
| --- | --- |
| `CTF_*` | Contentful |
| `SEND_MESSAGE_API` | 問い合わせ |
| `AWS_S3_BUCKET` | 静的ホスティング |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | デプロイ IAM |
| `CLOUDFRONT_DISTRIBUTION_ID` | キャッシュ無効化 |

## Contentful Webhook

Entry Publish 時に GitHub Actions を起動する想定。イベント種別と `repository_dispatch` の設定は Contentful 管理画面側。Webhook 失敗時は `main` へ空コミット push で再デプロイ可能。

## 本番確認

- トップ / Works 一覧・詳細が最新 Entry と一致するか
- OGP 画像（Contentful CDN URL）が表示されるか
- `/contact` からテスト送信（SES / Lambda ログ）

## 問い合わせが届かないとき

1. ブラウザ Network で `SEND_MESSAGE_API` への POST ステータス
2. API Gateway / Lambda / SES の CloudWatch ログ
3. ビルド時の `SEND_MESSAGE_API` が空でないか（空だとフォーム側でエラー toast）

フロントは honeypot フィールド `website` を実装（[ContactForm.tsx](../src/app/components/ContactForm.tsx)）。

## ロールバック

1. 問題のある commit を revert して `main` push、または以前の `out/` 相当を S3 から復元
2. CloudFront invalidation を実行

DB は無いため、アプリロールバック = 静的ファイルの差し替えのみ。

## 関連ドキュメント

- [architecture.md](architecture.md) — ビルド時データ流れ
- [content-model.md](content-model.md) — Entry 更新の影響範囲
