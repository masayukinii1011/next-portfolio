# アプリ内部構造

Next.js App Router の静的エクスポート（`output: "export"`）を前提に、ビルド時に Contentful から取得した HTML を配信する。インフラの流れは [README](../README.md#アーキテクチャ) の Mermaid 図、コンテンツ契約は [content-model.md](content-model.md)、デプロイは [runbook.md](runbook.md) を参照。

## スタック

- **Next.js 16**（App Router）+ **React 19** — RSC と SSG、`generateStaticParams` で Works 詳細を事前生成
- **Tailwind CSS** + **shadcn/ui**（`src/components/ui/`）
- **Contentful CDA**（REST、`contentful` SDK）— ビルド時のみ取得
- **Biome**（lint/format）、**Vitest**（ユニットテスト）

ランタイムで動くのはブラウザ上の Client Component と、問い合わせ POST 先の **API Gateway → Lambda → SES** のみ（本リポジトリ外）。

## アプリ層（ソース）

図は [README](../README.md#アプリ構造図) を参照。

| 層 | 役割 |
| --- | --- |
| **App Router**（`src/app/`） | ルーティング、`generateMetadata`、ページのデータ取得 |
| **Server Components** | Contentful 取得、Markdown 描画の土台、`PostDetail` 等 |
| **Client Components** | フォーム、モバイルメニュー、View Transitions ラッパー |
| **lib/** | Contentful 正規化、SEO metadata、Markdown、SoundCloud 補助 |
| **data/** | 音楽 embed のフォールバック定義 |
| **components/ui/** | shadcn 由来の UI プリミティブ |

## ディレクトリ

```
src/
  app/
    (contents)/          # 共通レイアウト付きコンテンツページ
    components/          # サイト固有 UI（Header, PostDetail, ContactForm 等）
    contentful.ts        # CDA クライアントと Post 取得 API
    sendMessage.ts       # ビルド時に埋め込む API Gateway URL
    layout.tsx, page.tsx, sitemap.ts, robots.ts
  components/ui/         # shadcn
  lib/                   # 純関数・Contentful 変換
  data/                  # music-embeds 等
  hooks/
```

## データの流れ

### ビルド時（`next build`）

1. 各 Server Component ページが `getPostBySlug` / `getPostsByCategorySlug` 等を呼ぶ
2. `contentful.ts` が CDA で Entry を取得し、`lib/contentful-utils.ts` で `Post` 型に変換
3. Works 詳細は `generateStaticParams` で slug 一覧を生成し静的 HTML を出力
4. `SEND_MESSAGE_API` が Client バンドルにインライン化される（`sendMessage.ts` 経由）
5. 成果物は `out/`（S3 sync 対象）

### 閲覧時

- HTML / JS / CSS は CloudFront → S3
- 画像 URL は Contentful CDN（`images.ctfassets.net`）を `<Image unoptimized>` で参照
- `/contact` の送信のみブラウザから API Gateway へ直接 POST

## ページと Contentful の対応

| パス | 取得方法 | 備考 |
| --- | --- | --- |
| `/` | 固定 UI + Works 最新数件 | `getLatestPostsByCategorySlug("works")` |
| `/about` | slug 固定 `about` | 1 Entry |
| `/works` | category `works` | 一覧 |
| `/works/[slug]` | slug パラメータ | SSG |
| `/music` | slug 固定 `music` | SoundCloud embed 補強あり |
| `/contact` | slug 固定 `contact` | 本文 + `ContactForm` |

## クライアント境界

| コンポーネント | 理由 |
| --- | --- |
| `ContactForm` | `fetch` POST、react-hook-form、toast |
| `MobileMenu` | `usePathname` で遷移時に Sheet を閉じる |
| `RouteTransition` / `WorkImageMorph` | View Transitions API |

静的エクスポートのため **Server Actions は使わない**（問い合わせは外部 API）。

## SEO

- ページ別 `generateMetadata`（`lib/metadata.ts`）
- `app/sitemap.ts` / `app/robots.ts`
- `app/not-found.tsx`

## 関連 ADR

- [0001](adr/0001-nextjs-static-export.md) — 静的エクスポート
- [0003](adr/0003-contentful-rest-cda.md) — Contentful REST
- [0005](adr/0005-contact-lambda-not-server-actions.md) — 問い合わせ経路
