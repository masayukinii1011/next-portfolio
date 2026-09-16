# ADR 0004: shadcn/ui + Tailwind

## 状態

Accepted

## コンテキスト

少数画面だがフォーム・ナビの a11y と一貫性が必要。

## 決定

Tailwind + shadcn（`src/components/ui/`）。サイト UI は `src/app/components/`。

## 理由

RSC と相性が良く、源码をリポジトリ内で改修できる。

## 結果

shadcn 更新は手動取り込み。
