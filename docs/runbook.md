# Runbook

ローカル開発、CI/CD、環境変数、障害時の参照用。

## ローカル開発

```bash
npm ci
# .env.local を作成（環境変数は下表）
npm run dev
```

## 環境変数

`.env.local`（開発） / CI では `.env.production`（[deploy.yml](../.github/workflows/deploy.yml) が secrets から生成）。

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `CTF_SPACE_ID` | yes | Contentful Space |
| `CTF_CDA_ACCESS_TOKEN` | yes | CDA トークン |
| `CTF_BLOG_POST_TYPE_ID` | yes | Post Content Type ID |
| `SEND_MESSAGE_API` | prod | 問い合わせ API Gateway URL（ビルド時に Client へ埋め込み） |

## npm スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run lint` | Biome |
| `npm run test` | Vitest |
| `npm run build` | 静的エクスポート（`out/`） |

## デプロイ

**トリガー**: `main` への push、または Contentful Webhook による `repository_dispatch`。

**パイプライン**: lint → test → `next build` → S3 sync（`out/`）→ CloudFront invalidation（`/*`）。

### GitHub Secrets

`CTF_*`, `SEND_MESSAGE_API`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDFRONT_DISTRIBUTION_ID`

## 障害時

| 症状 | 確認 |
| --- | --- |
| 本文が古い | Webhook / Actions ログ。手動で `main` push |
| 問い合わせ失敗 | POST ステータス、Lambda/SES ログ、`SEND_MESSAGE_API` がビルドに入っているか |
| ロールバック | revert → push → invalidation（DB なし） |

問い合わせ API・SES はリポジトリ外。
