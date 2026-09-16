# Architecture Decision Records (ADR)

このディレクトリは、本プロジェクトで採用した（または見送った）アーキテクチャ上の判断を記録する。

状態は `Accepted`（採用）/ `Deprecated`（非推奨）/ `Superseded`（後続 ADR に置換）を使う。置換するときは旧 ADR に「Superseded by 00xx」と明記する。

| ADR | タイトル | 状態 |
| --- | --- | --- |
| [0001](0001-nextjs-static-export.md) | Next.js 静的エクスポート（SSG）を採用する | Accepted |
| [0002](0002-aws-s3-cloudfront-hosting.md) | AWS S3 + CloudFront でホスティングする | Accepted |
| [0003](0003-contentful-rest-cda.md) | Contentful REST CDA をビルド時のみ使う | Accepted |
| [0004](0004-shadcn-tailwind-ui.md) | shadcn/ui + Tailwind CSS を UI 基盤にする | Accepted |
| [0005](0005-contact-lambda-not-server-actions.md) | 問い合わせは Lambda + API Gateway へ POST する | Accepted |
| [0006](0006-nextjs-16-react-19.md) | Next.js 16 / React 19 へ更新する | Accepted |

関連ドキュメント:

- [architecture.md](../architecture.md) — 現行の内部構造
- [content-model.md](../content-model.md) — Contentful モデル
- [runbook.md](../runbook.md) — デプロイ・運用
- [frontend.md](../frontend.md) — UI・Client 境界
