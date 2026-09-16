# コンテンツモデル（Contentful）

サイトの文言・作品・画像の正本は Contentful。アプリ側の型の正本は [src/app/contentful.ts](../src/app/contentful.ts)、Entry → `Post` への変換は [src/lib/contentful-utils.ts](../src/lib/contentful-utils.ts)。

## 前提

- **ビルド時取得のみ** — 閲覧者リクエストでは Contentful を呼ばない（ADR [0003](adr/0003-contentful-rest-cda.md)）
- 1 つの **Blog Post 相当 Content Type**（環境変数 `CTF_BLOG_POST_TYPE_ID`）で About / Works / Music / Contact を兼ねる
- **Category** は別 Content Type（`content_type: "category"` 固定）

## Content Type

### `category`

| フィールド（アプリが参照） | 型 | 用途 |
| --- | --- | --- |
| `title` | Symbol | 表示名 |
| `slug` | Symbol | `works` / `about` / `music` / `contact` 等 |
| `id` | Number（任意） | 一覧ソート（`order: fields.id`） |

### Blog Post（`CTF_BLOG_POST_TYPE_ID`）

アプリが読むフィールド:

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `slug` | Symbol | URL 識別子（Works）または固定 slug（`about` 等） |
| `title` | Symbol | ページタイトル |
| `body` | Text | Markdown 本文 |
| `publishDate` | Date | 並び順（Works 一覧） |
| `githubUrl` | Symbol | リポジトリリンク |
| `demoUrl` | Symbol | デモリンク |
| `category` | Reference → category | ルーティング・UI 分岐 |
| `image` | Asset | ヒーロー / OGP 用 |
| `techTags` | Array of Symbol（任意） | Works カード用タグ |
| `embedUrls` | Array of Symbol（任意） | Music ページの SoundCloud 等 URL |

## アプリ内型 `Post`

```ts
// src/app/contentful.ts（要約）
Post = {
  slug, title, body, publishDate,
  githubUrl, demoUrl,
  category: { slug, title },
  image: { title, url },
  techTags: string[],
  embedUrls: string[],
}
```

- `image.url` は CDA の `//images...` を `https:` 付きに正規化
- `techTags` が空のとき、本文の `## 技術スタック` セクションから最大 6 件を抽出（`extractTechTagsFromBody`）

## Category slug と UI

| `category.slug` | ルート | 特殊 UI |
| --- | --- | --- |
| `works` | `/works`, `/works/[slug]` | 一覧・詳細・View Transition morph |
| `about` | `/about` | プロフィール記事 |
| `music` | `/music` | embed + `enrichMusicEmbeds` |
| `contact` | `/contact` | Markdown 説明 + `ContactForm` |

`PostDetail` は `category === "contact"` のときフォームを差し込む。

## 固定 slug（シングルページ）

| slug | ページ |
| --- | --- |
| `about` | `/about` |
| `music` | `/music` |
| `contact` | `/contact` |

Works は `category.slug === "works"` の Entry から `generateStaticParams` でパスを生成。

## 更新から公開まで

1. Contentful で Entry を Publish
2. Webhook → GitHub `repository_dispatch` → CI が `next build` → S3 → CloudFront invalidation

手順詳細は [runbook.md](runbook.md)。

## v1 でやらないこと

- プレビュー API / Draft Mode
- 多言語ロケール
- Contentful GraphQL（必要になったら ADR を追加して移行検討）
- サイト内検索・タグフィルタ UI
