# ADR 0005: 問い合わせ Lambda POST

## 状態

Accepted

## コンテキスト

静的 export では Server Actions をホストできない。Nuxt 版と同様に API Gateway + Lambda + SES。

## 決定

`ContactForm` から `SEND_MESSAGE_API` へ POST。honeypot `website`。バックエンドはリポジトリ外。

## 理由

静的配信と両立。送信ロジックを Lambda に閉じる。

## 結果

API URL 変更時は再ビルドが必要。
