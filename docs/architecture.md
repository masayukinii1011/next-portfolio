# アプリ内部構造

Next.js App Router の **静的エクスポート** を前提に、ビルド時に Contentful から取得した HTML / JS を配信する。インフラ（S3 / CloudFront / 問い合わせ API）の全体像は README の図が正本。

## 関連ドキュメント

| 参照 | 内容 |
| --- | --- |
| [README](../README.md#アーキテクチャ) | ビルド時・閲覧時・問い合わせの Mermaid 図 |
| [content-model.md](content-model.md) | Contentful Content Type、category とルート |
| [adr.md](adr.md) | 技術選定（静的 export、AWS、CMS 等） |
| [runbook.md](runbook.md) | 環境変数、CI、障害時 |

## コードの正本

| 役割 | パス |
| --- | --- |
| CDA 取得（`getPostBySlug` 等） | [src/app/contentful.ts](../src/app/contentful.ts) |
| Entry → `Post` 変換 | [src/lib/contentful-utils.ts](../src/lib/contentful-utils.ts) |
| 問い合わせ URL（ビルド時埋め込み） | [src/app/sendMessage.ts](../src/app/sendMessage.ts) |
| 静的 export 設定 | [next.config.mjs](../next.config.mjs) |

## スタック

- Next.js 16 App Router + `output: "export"`
- React 19（View Transitions を一部 Client Component で使用）
- Contentful REST CDA — **ビルド時のみ**
- shadcn/ui + Tailwind CSS（`src/components/ui/`）
- 品質: Biome、Vitest

選定理由は [adr.md](adr.md) を参照。

## ディレクトリ

```
src/
  app/
    layout.tsx, page.tsx, sitemap.ts, robots.ts
    contentful.ts, sendMessage.ts
    components/          # Header, PostDetail, ContactForm 等
    (contents)/          # about, works, music, contact
  components/ui/       # shadcn
  lib/                 # metadata, markdown, contentful-utils, soundcloud
  data/                # music embed フォールバック
```

## ページ構成

| パス | ファイル | 内容 |
| --- | --- | --- |
| `/` | `app/page.tsx` | ヒーロー・CTA・最新 Works |
| `/about` | `app/(contents)/about/page.tsx` | プロフィール・スキル（Contentful slug `about`） |
| `/works` | `app/(contents)/works/page.tsx` | 作品一覧 |
| `/works/[slug]` | `app/(contents)/works/[slug]/page.tsx` | 作品詳細（SSG） |
| `/music` | `app/(contents)/music/page.tsx` | 音楽活動（Contentful + SoundCloud embed） |
| `/contact` | `app/(contents)/contact/page.tsx` | 説明文（Contentful）+ 問い合わせフォーム（Lambda） |

Contentful の category / slug 対応は [content-model.md](content-model.md#ルーティング)。

## ビルド時の流れ

1. 各ページの Server Component が `getPostBySlug` / `getPostsByCategorySlug` 等を呼ぶ
2. `contentful.ts` が CDA で Entry を取得し、`contentful-utils` で `Post` に変換する
3. `/works/[slug]` は `generateStaticParams` で slug 一覧から HTML を生成する
4. `next build` の成果物は `out/`（S3 sync 対象）
5. `SEND_MESSAGE_API` は Client バンドルにインライン化される

## 閲覧時

- ページ本体: CloudFront → S3 上の静的 HTML / JS
- 画像: Contentful CDN（`images.ctfassets.net`）。`next/image` は `unoptimized: true`
- 問い合わせのみ: ブラウザ → API Gateway（CloudFront 非経由）

## Client Component

静的 export では Server Actions が使えないため、インタラクションは Client に限定する。

| ファイル | 理由 |
| --- | --- |
| `ContactForm` | `fetch` POST、react-hook-form、toast |
| `MobileMenu` | `usePathname` で遷移時に Sheet を閉じる |
| `RouteTransition` | View Transitions ラッパー |
| `WorkImageMorph` | Works 一覧 → 詳細の shared element |

## ページ共通の振る舞い

- **SEO**: ページ別 `generateMetadata`（`lib/metadata.ts`）、`sitemap.ts`、`robots.ts`
- **Markdown**: `react-markdown` + `lib/markdown.ts`（Works / About 本文）
- **PostDetail**: `category === "contact"` で `ContactForm`、`music` で SoundCloud embed
