# ADR 0001: Next.js 静的エクスポート（SSG）を採用する

## 状態

Accepted

## コンテキスト

個人ポートフォリオは更新頻度が低く、全ページを CDN から配信したい。Nuxt 版から Next.js App Router へリプレイスするにあたり、ホスティングは既存の AWS 静的サイト構成を維持する。

Vercel の ISR や Node サーバー常時起動は、運用コストと構成の単純さの観点で必須ではない。

## 決定

- `next.config.mjs` で **`output: "export"`** とし、ビルド成果物を `out/` として S3 に配置する
- データ取得は **ビルド時**（Server Components の async）に限定する
- Content 更新時は **CI を再実行**（push または Contentful Webhook）して再ビルドする

## 理由

- CloudFront + S3 との親和性が高い
- ランタイムサーバー不要で攻撃面が小さい
- App Router + RSC の開発体験を保ちつつ、旧 Nuxt 静的生成に相当する運用ができる

## 結果

- 良い: デプロイが「静的ファイル sync + invalidation」に統一される
- 悪い: **Server Actions / 動的 Route Handler / PPR / `use cache`** などランタイムサーバー前提機能は使えない
- 見送り: ISR（`revalidate`）、Middleware による動的処理、Edge Runtime 上の API

## 関連

- [architecture.md](../architecture.md)
- [0002](0002-aws-s3-cloudfront-hosting.md)
