# ADR 0003: Contentful REST CDA をビルド時のみ使う

## 状態

Accepted

## コンテキスト

About / Works / Music / Contact の文案・メタデータ・画像参照を CMS で管理する。取得タイミングは SSG に合わせビルド時のみとする。

Contentful は REST CDA と GraphQL Content API の両方を提供する。

## 決定

- **`contentful` npm パッケージ**（REST CDA）を使う
- クライアントは [src/app/contentful.ts](../../src/app/contentful.ts) に集約
- Entry → アプリ型への変換は [src/lib/contentful-utils.ts](../../src/lib/contentful-utils.ts)
- 閲覧時リクエストでは Contentful を **呼ばない**

## 理由

- Entry 数が少なく、ネストも浅い（Category 参照、Asset 参照程度）
- ビルド時だけなら REST + SDK で十分シンプル
- GraphQL のスキーマ生成・クエリ管理コストを避けられる

## 結果

- 良い: 型変換とエラーハンドリングを TypeScript 側に閉じられる
- 悪い: 複雑な関連取得が増えたときクエリが冗長になりうる
- 見送り: GraphQL Content API、Live Preview / Draft Mode

CMS 構成が複雑化した場合は GraphQL 移行を新 ADR で検討する。

## 関連

- [content-model.md](../content-model.md)
