# フロントエンド実装

UI 構成、Server / Client の切り分け、UX まわりの約定。デザイントークンは Tailwind + `globals.css`、コンポーネントは shadcn/ui ベース。

## レイアウト

- **Root** — `app/layout.tsx`: フォント（Geist local）、`Header`、`Toaster`、スキップリンク
- **Contents** — `app/(contents)/layout.tsx`: コンテンツページ共通の余白・背景

## 主要コンポーネント

| コンポーネント | 種別 | 役割 |
| --- | --- | --- |
| `Header` / `PcMenu` / `MobileMenu` | SC + CC | ナビ。Mobile のみ Client |
| `PostList` | SC | Works カード一覧 |
| `PostDetail` | SC | category に応じて Markdown / Music / Contact を分岐 |
| `PostDetailArticle` | SC | Works 詳細本文 |
| `ContactForm` | CC | Zod + RHF、API POST |
| `RouteTransition` | CC | View Transitions |
| `WorkImageMorph` | CC | Works 一覧 → 詳細の shared element |

## Markdown

- `react-markdown` + `lib/markdown.ts` の remark プラグイン
- Works 本文内リンク・コードブロックをそのまま描画

## View Transitions

React 19.2 の `<ViewTransition>` を `RouteTransition` でラップ。Works サムネイルは `WorkImageMorph` で morph（ADR [0006](adr/0006-nextjs-16-react-19.md)）。

## 画像

`next.config.mjs`:

- `output: "export"`
- `images.unoptimized: true`（静的ホスティング向け）
- `remotePatterns`: `images.ctfassets.net`

## フォーム・バリデーション

- **Zod 3** スキーマ（`ContactForm` の `formSchema`）
- shadcn `Form` コンポーネント

## テスト

- `lib/contentful-utils.test.ts` — Entry 変換・techTags 抽出・description 生成

## 品質

- **Biome** — `biome.json`（lint + format）
- CI で `npm run lint` 必須

## 拡張するとき

- 新ページ: `app/(contents)/` に route を追加し、必要なら Contentful category / slug 約定を [content-model.md](content-model.md) に追記
- 新 Client 境界: 静的 export で Server Actions が使えない点に注意（[architecture.md](architecture.md)）
