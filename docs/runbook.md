# Runbook

## 環境変数

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `CTF_SPACE_ID` | yes | Contentful Space |
| `CTF_CDA_ACCESS_TOKEN` | yes | CDA トークン |
| `CTF_BLOG_POST_TYPE_ID` | yes | Post Content Type ID |
| `SEND_MESSAGE_API` | prod | 問い合わせ API Gateway URL（ビルド時に Client へ埋め込み） |

CI: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) が secrets から `.env.production` を生成。

## GitHub Secrets（デプロイ）

`CTF_*`, `SEND_MESSAGE_API`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDFRONT_DISTRIBUTION_ID`

## 障害時

| 症状 | 確認 |
| --- | --- |
| 本文が古い | Webhook / Actions ログ。手動で `main` push |
| 問い合わせ失敗 | POST ステータス、Lambda/SES ログ、`SEND_MESSAGE_API` がビルドに入っているか |
| ロールバック | revert → push → invalidation（DB なし） |

問い合わせ API・SES はリポジトリ外。
