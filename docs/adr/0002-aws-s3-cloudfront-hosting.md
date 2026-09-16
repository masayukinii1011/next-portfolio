# ADR 0002: AWS S3 + CloudFront でホスティングする

## 状態

Accepted

## コンテキスト

msykn.com は Nuxt 版から S3 + CloudFront + Route 53 で配信してきた。Next.js 移行後も、更新は Webhook 連携 CI で足りる見込み。

Vercel 等のマネージド Front も選択肢だった。

## 決定

- 静的ファイルは **S3**、配信は **CloudFront**、DNS は **Route 53**
- **Lambda@Edge**（または相当）で URL 正規化（末尾スラッシュ等）— インフラは本リポジトリ外、README の閲覧時図を参照
- デプロイは **GitHub Actions**（[deploy.yml](../../.github/workflows/deploy.yml)）で lint / test / build / sync / invalidation

## 理由

- 更新頻度が低く ISR のメリットが薄い
- Contentful Publish → CI 再ビルドで鮮度を担保できる
- 既存 AWS 勘所・コスト構造を踏襲できる

## 結果

- 良い: フロントと問い合わせ API（別スタック）を分離できる
- 悪い: プレビュー環境や branch deploy は自前で用意する必要がある
- 見送り: Vercel ホスティング、CloudFront Functions への全面移行（現状 Edge で足りている）

## 関連

- [runbook.md](../runbook.md)
- [0001](0001-nextjs-static-export.md)
