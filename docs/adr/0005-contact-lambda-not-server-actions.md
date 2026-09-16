# ADR 0005: 問い合わせは Lambda + API Gateway へ POST する

## 状態

Accepted

## コンテキスト

Contact ページからメール送信相当の処理が必要。Next.js 静的 export では **Server Actions や Route Handler をホスティング先で実行できない**。

Nuxt 版でも API Gateway + Lambda + SES 構成を使っていた。

## 決定

- フロントは **Client Component**（`ContactForm`）から `fetch(POST)` する
- エンドポイント URL は環境変数 **`SEND_MESSAGE_API`** をビルド時に埋め込む（[sendMessage.ts](../../src/app/sendMessage.ts)）
- バックエンド（API Gateway / Lambda / SES）は **本リポジトリ外**。フロントは JSON `{ name, email, message }` を送る
- **honeypot** フィールド `website` で簡易 bot 対策

## 理由

- 静的ホスティングと矛盾しない
- 送信・レート制限・SES 設定を Lambda 側に閉じられる
- CloudFront 経由にせず API Gateway 直 POST でも CORS を Lambda 側で制御可能

## 結果

- 良い: サイトデプロイと問い合わせ API のライフサイクルを分離
- 悪い: API URL がビルドに焼き込まれるため、URL 変更時は再ビルドが必要
- 見送り: Server Actions、フォーム専用 BFF を Next 上に置く

## 関連

- [runbook.md](../runbook.md) — 送信障害時
- [0001](0001-nextjs-static-export.md)
