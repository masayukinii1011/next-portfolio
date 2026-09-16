# Architecture Decision Records

本プロジェクトの技術選定を 1 ファイルに記録する。実装の入口は [architecture.md](architecture.md)。

| # | タイトル | 状態 |
| --- | --- | --- |
| 0001 | 静的エクスポート | Accepted |
| 0002 | S3 + CloudFront ホスティング | Accepted |
| 0003 | Contentful REST CDA（ビルド時） | Accepted |
| 0004 | shadcn/ui + Tailwind CSS | Accepted |
| 0005 | 問い合わせ Lambda POST | Accepted |
| 0006 | Next.js 16 / React 19 | Accepted |

---

## 0001 静的エクスポート

### 状態

Accepted

### コンテキスト

個人ポートフォリオは更新頻度が低く、全ページを CDN から配信したい。Nuxt 版から Next.js App Router へ移行するにあたり、ホスティングは AWS 静的サイトを継続する。Vercel の ISR や常時 Node サーバーは必須ではない。

### 決定

- `next.config.mjs` で **`output: "export"`** とし、成果物を `out/` として配信する
- Contentful 等のデータ取得は **ビルド時**（Server Components）に限定する
- コンテンツ更新時は **CI を再実行**（`main` push または Contentful Webhook）

### 理由

- S3 + CloudFront との構成が一致する
- ランタイムサーバーが不要で運用・攻撃面が小さい
- App Router + RSC の開発体験を保ちつつ、旧 Nuxt の静的生成に相当する運用ができる

### 結果

- 良い: デプロイが「ビルド → 静的 sync → invalidation」に統一される
- 悪い: Server Actions、Route Handler、PPR、`use cache` などサーバー前提機能は使えない
- 見送り: ISR（`revalidate`）、Middleware による動的処理

---

## 0002 S3 + CloudFront ホスティング

### 状態

Accepted

### コンテキスト

msykn.com は Nuxt 版から S3 + CloudFront + Route 53 で配信してきた。Next.js 移行後も、Contentful Publish から CI 再ビルドで鮮度を担保できる見込み。

### 決定

- 静的ファイルは **S3**、配信は **CloudFront**、DNS は **Route 53**
- URL 正規化は **Lambda@Edge**（インフラは本リポジトリ外。図は [README](../README.md#閲覧時ランタイム)）
- デプロイは **[deploy.yml](../.github/workflows/deploy.yml)** — lint / test / build / S3 sync / invalidation

### 理由

- 更新頻度が低く ISR のメリットが薄い
- Webhook 連携 CI で CMS 更新に追従できる
- 既存 AWS 構成・コストを踏襲できる

### 結果

- 良い: 静的サイトと問い合わせ API（別スタック）を分離できる
- 悪い: プレビュー環境・branch deploy は自前
- 見送り: Vercel ホスティングへの移行

---

## 0003 Contentful REST CDA（ビルド時）

### 状態

Accepted

### コンテキスト

About / Works / Music / Contact の文案・メタデータ・画像参照を CMS で管理する。SSG に合わせ、取得はビルド時のみとする。Contentful は REST CDA と GraphQL Content API の両方を提供する。

### 決定

- **`contentful` npm パッケージ**（REST CDA）を使う
- クライアントと取得 API は [contentful.ts](../src/app/contentful.ts) に集約
- Entry → `Post` 型への変換は [contentful-utils.ts](../src/lib/contentful-utils.ts)
- 閲覧時リクエストでは Contentful を **呼ばない**

契約の詳細は [content-model.md](content-model.md)。

### 理由

- Entry 数が少なく、関連も浅い（Category 参照、Asset 参照程度）
- ビルド時だけなら REST + SDK で十分シンプル
- GraphQL のスキーマ・クエリ管理コストを避けられる

### 結果

- 良い: 変換とエラーハンドリングを TypeScript 側に閉じられる
- 悪い: 関連取得が増えると REST が冗長になりうる
- 見送り: GraphQL Content API、Draft Mode / Live Preview

---

## 0004 shadcn/ui + Tailwind CSS

### 状態

Accepted

### コンテキスト

フォーム・ナビ・カードなど少数の UI パターンだが、a11y と見た目の一貫性が必要。Nuxt 版から CSS 戦略を選び直す。

### 決定

- **Tailwind CSS** でスタイリング
- **shadcn/ui**（Radix ベース）を `src/components/ui/` に配置
- サイト固有 UI は `src/app/components/`

### 理由

- RSC と相性が良く、必要な箇所だけ `"use client"` にできる
- コンポーネントがリポジトリ内にあり、デザイン調整しやすい
- Tailwind は zero-runtime で静的 export と相性が良い

### 結果

- 良い: Contact フォームを shadcn Form + RHF + Zod で統一できる
- 悪い: shadcn 本体の更新は手動で取り込む
- 見送り: MUI / Chakra 等の heavier な UI キット

---

## 0005 問い合わせ Lambda POST

### 状態

Accepted

### コンテキスト

Contact ページからメール送信相当の処理が必要。静的 export では **Server Actions や Route Handler をホスティング先で実行できない**。Nuxt 版でも API Gateway + Lambda + SES を使っていた。

### 決定

- **Client Component**（`ContactForm`）から `fetch(POST)` する
- エンドポイントは環境変数 **`SEND_MESSAGE_API`** をビルド時に埋め込む（[sendMessage.ts](../src/app/sendMessage.ts)）
- ペイロードは `{ name, email, message }`。**honeypot** フィールド `website` を実装
- API Gateway / Lambda / SES は **本リポジトリ外**

### 理由

- 静的ホスティングと矛盾しない
- レート制限・SES 設定を Lambda 側に閉じられる
- サイトデプロイと問い合わせ API のライフサイクルを分離できる

### 結果

- 良い: 送信ロジックをフロントから切り離せる
- 悪い: API URL 変更時は再ビルドが必要
- 見送り: Server Actions、Next 上の BFF

---

## 0006 Next.js 16 / React 19

### 状態

Accepted

### コンテキスト

2026 時点で Next.js 15 / React 18 から Next.js 16 / React 19 へ更新した。静的 export 構成は [0001](#0001-静的エクスポート) のまま維持する。

### 決定

- **Next.js 16**、**React 19**、対応する型定義へ更新
- **Turbopack** を dev / build のデフォルトとして利用（CI 時間短縮を期待）
- **View Transitions**（React 19.2）— `RouteTransition`、`WorkImageMorph`

### 理由

- Node 20.9+ / React 19 前提の現行 LTS に合わせ、サポート窓を確保
- ポートフォリオとしてページ遷移 UX に付加価値がある

### 結果

- 良い: Works 詳細への morph など差別化 UX
- 悪い: 一部ライブラリが React 19 追従中の箇所がある
- 見送り: Cache Components / PPR / `use cache`（export 非両立）、React Compiler（ビルド時間）、Tailwind 4 / Zod 4 / Biome 2 等のメジャーアップ（別計画）
