# ADR 0004: shadcn/ui + Tailwind CSS を UI 基盤にする

## 状態

Accepted

## コンテキスト

ポートフォリオ UI はフォーム・ナビ・カードなど少数のパターンだが、アクセシビリティと一貫した見た目が必要。Nuxt 版からの移行で CSS 戦略も選び直す。

## 決定

- **Tailwind CSS** でスタイリング
- **shadcn/ui**（Radix ベース）を `components.json` 経由でプロジェクト内に配置（`src/components/ui/`）
- サイト固有 UI は `src/app/components/`

## 理由

- RSC と相性が良く、必要な Client 境界だけ `"use client"` にできる
- コンポーネント源码がリポジトリ内にあり、デザイン調整がしやすい
- zero-runtime（Tailwind）で静的 export バンドルと相性が良い

## 結果

- 良い: フォーム（Contact）を shadcn Form + RHF + Zod で統一
- 悪い: shadcn 更新時は手動で diff を取り込む
- 見送り: CSS Modules 単独、MUI / Chakra 等の heavier UI キット

## 関連

- [frontend.md](../frontend.md)
