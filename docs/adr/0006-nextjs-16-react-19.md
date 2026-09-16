# ADR 0006: Next.js 16 / React 19

## 状態

Accepted

## コンテキスト

2026 に v15/v18 から更新。静的 export は維持。

## 決定

Next 16 + React 19。Turbopack を dev/build に使用。View Transitions（`RouteTransition`, `WorkImageMorph`）。

## 見送り

PPR / `use cache`（export 非対応）、React Compiler（ビルド時間）。

## 理由

LTS 整合、CI 短縮の余地、ポートフォリオ UX。

## 結果

Tailwind 4 / Zod 4 / Biome 2 等のメジャーアップは別計画。
