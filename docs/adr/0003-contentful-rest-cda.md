# ADR 0003: Contentful REST（ビルド時）

## 状態

Accepted

## コンテキスト

文案・Works を CMS 化。SSG に合わせ取得はビルド時のみ。

## 決定

REST CDA + `contentful` SDK。[contentful.ts](../../src/app/contentful.ts) に集約。

## 理由

Entry 数が少なく GraphQL の管理コストが見合わない。

## 結果

CMS が複雑化したら GraphQL 移行を再検討。
