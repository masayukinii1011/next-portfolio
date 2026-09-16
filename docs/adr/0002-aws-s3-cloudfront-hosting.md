# ADR 0002: S3 + CloudFront

## 状態

Accepted

## コンテキスト

Nuxt 版からの AWS 構成を踏襲。Vercel ISR は更新頻度に対して過剰。

## 決定

S3 + CloudFront + Route 53。デプロイは GitHub Actions（lint / test / build / sync / invalidation）。

## 理由

Contentful Webhook で再ビルドすれば鮮度は足りる。

## 結果

プレビュー環境は自前。問い合わせ API は別スタック。
