# ADR 0001: 静的エクスポート

## 状態

Accepted

## コンテキスト

更新頻度が低い個人サイトを CDN 配信したい。AWS 静的ホスティングを継続する。

## 決定

`output: "export"`。データはビルド時のみ取得。Content 更新は CI 再ビルド。

## 理由

S3 + CloudFront と一致。ランタイムサーバー不要。

## 結果

Server Actions / Route Handler / PPR / `use cache` は使えない。
