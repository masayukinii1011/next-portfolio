# Architecture Decision Records

採用した技術判断。状態はすべて **Accepted**。内部構造は [architecture.md](architecture.md)。

## 0001 静的エクスポート

- **決定**: `output: "export"`。Contentful はビルド時のみ。更新は CI 再ビルド。
- **理由**: S3 + CloudFront 配信と一致。ランタイムサーバー不要。
- **結果**: Server Actions / Route Handler / PPR / `use cache` は不可。

## 0002 S3 + CloudFront

- **決定**: S3 + CloudFront + Route 53。GitHub Actions で build → sync → invalidation。
- **理由**: 更新頻度が低く ISR や Vercel が過剰。Nuxt 版構成を踏襲。
- **結果**: プレビュー環境は自前。問い合わせ API は別スタック。

## 0003 Contentful REST（ビルド時）

- **決定**: REST CDA + `contentful` SDK。[contentful.ts](../src/app/contentful.ts) に集約。
- **理由**: Entry 数が少なく GraphQL の管理コストが見合わない。
- **結果**: CMS が複雑化したら GraphQL を再検討。

## 0004 shadcn/ui + Tailwind

- **決定**: Tailwind + shadcn（`src/components/ui/`）。サイト UI は `src/app/components/`。
- **理由**: RSC と相性が良く、コンポーネント源码をリポジトリ内で改修できる。
- **結果**: shadcn 更新は手動取り込み。

## 0005 問い合わせ Lambda POST

- **決定**: `ContactForm` → `SEND_MESSAGE_API` へ POST。honeypot `website`。Lambda / SES はリポジトリ外。
- **理由**: 静的 export と Server Actions を両立できない。送信ロジックを Lambda に閉じる。
- **結果**: API URL 変更時は再ビルドが必要。

## 0006 Next.js 16 / React 19

- **決定**: Next 16 + React 19。Turbopack。View Transitions（`RouteTransition`, `WorkImageMorph`）。
- **見送り**: PPR / `use cache`（export 非対応）、React Compiler（ビルド時間）。
- **理由**: LTS 整合、CI 短縮の余地、遷移 UX。
- **結果**: Tailwind 4 / Zod 4 / Biome 2 等のメジャーアップは別計画。
