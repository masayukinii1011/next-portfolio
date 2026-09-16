# コンテンツモデル（Contentful）

ビルド時のみ CDA 取得。Publish → Webhook → CI 再ビルド。

## Content Type

**`category`** — `title`, `slug`（`works` / `about` / `music` / `contact`）, 任意 `id`（ソート）

**Blog Post**（`CTF_BLOG_POST_TYPE_ID`）— アプリが使うフィールド:

| フィールド | 用途 |
| --- | --- |
| `slug`, `title`, `body` | ルート・表示 |
| `publishDate` | Works 並び |
| `category` | Reference → category |
| `image`, `githubUrl`, `demoUrl` | ヒーロー / リンク |
| `techTags`, `embedUrls` | Works タグ / Music embed（任意） |

`Post` 型と変換ロジックは [contentful.ts](../src/app/contentful.ts)、[contentful-utils.ts](../src/lib/contentful-utils.ts)。`techTags` 空時は本文 `## 技術スタック` から最大 6 件抽出。

## ルーティング

| category.slug | パス |
| --- | --- |
| `works` | `/works`, `/works/[slug]` |
| `about` / `music` / `contact` | 各固定ページ（Entry slug も `about` 等） |

`contact` ページだけ `PostDetail` が `ContactForm` を載せる。
