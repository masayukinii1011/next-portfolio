# ADR 0006: Next.js 16 / React 19 へ更新する

## 状態

Accepted

## コンテキスト

2026 時点で Next.js 15 / React 18 から、Next.js 16 / React 19 へメジャー更新した。静的 export 構成は維持する。

## 決定

- **Next.js 16**、**React 19**、対応する型定義へ更新
- **Turbopack** を dev / build のデフォルトとして利用（CI 時間短縮を期待）
- **View Transitions**（React 19.2）でページ遷移 UX を改善（`RouteTransition`、`WorkImageMorph`）

## 採用しなかった v16 機能

| 機能 | 理由 |
| --- | --- |
| Cache Components / `use cache` / PPR | `output: "export"` と非両立 |
| React Compiler | ビルド時間増。UX は View Transitions で代替 |

## 依存関係方針

- Next / React / 型定義は v16 移行に合わせて更新
- Radix、react-hook-form、contentful 等は **同一メジャー内** の互換パッチ
- Tailwind 4、Zod 4、Biome 2 など破壊的メジャーは **別 ADR / 移行計画** を立ててから

## 理由

- 現行 LTS（Node 20.9+）とサポート窓に合わせる
- Turbopack 本番ビルドで CI を短縮できる可能性
- ポートフォリオとして遷移アニメーションの付加価値が大きい

## 結果

- 良い: Works 詳細への morph など差別化 UX
- 悪い: React 19 前提 API にエコシステム依存が追従中の箇所がある
- 見送り: React Compiler 有効化

## 関連

- [frontend.md](../frontend.md)
- [0001](0001-nextjs-static-export.md)
