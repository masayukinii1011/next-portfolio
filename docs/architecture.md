# アプリ内部構造

インフラ図は [README](../README.md#アーキテクチャ)。Contentful 契約は [content-model.md](content-model.md)。型変換の正本は [src/app/contentful.ts](../src/app/contentful.ts) と [src/lib/contentful-utils.ts](../src/lib/contentful-utils.ts)。

## スタック

技術選定は [adr.md](adr.md)。

- Next.js 16 App Router + `output: "export"`
- ビルド時 CDA → `out/`
- UI: shadcn/ui + Tailwind（`src/components/ui/`）

## ディレクトリ

```
src/app/           # ルート、contentful.ts、components/
src/app/(contents)/ # about, works, music, contact
src/lib/           # metadata, markdown, contentful-utils
src/data/          # music embed フォールバック
```

## ビルド時の流れ

1. Server Component が `getPostBySlug` / `getPostsByCategorySlug` を呼ぶ
2. Works 詳細は `generateStaticParams` で slug 一覧から SSG
3. `SEND_MESSAGE_API` を Client に埋め込み

## Client Component（静的 export の制約）

| ファイル | 理由 |
| --- | --- |
| `ContactForm` | API POST、RHF |
| `MobileMenu` | 遷移で Sheet を閉じる |
| `RouteTransition` / `WorkImageMorph` | View Transitions |

## その他

- SEO: ページ別 `generateMetadata`、`sitemap.ts`、`robots.ts`
- Markdown: `react-markdown`（Works / About 本文）
- `PostDetail`: `category === "contact"` でフォーム、`music` で embed
