### 1. Nuxt.js から Next.js への移行
Nuxt.js で構築していたポートフォリオサイトを、Next.js の App Router を用いてリプレイスしました。
旧ポートフォリオのリポジトリは[こちら](https://github.com/masayukinii1011/nuxt-portfolio)

### 2. 構成技術と選定理由
#### 2-1. Next.js
React フレームワークとして Next.js を選定した基準は以下の通りです。
1. React Server Component が利用できること -> 新しいコンポーネントの仕組みを体験したかったため
2. SSG（静的サイト生成）に対応していること -> 記事数が少なく更新頻度も低いポートフォリオに適しているため

Remix や Astro などと比較した結果、上記の条件を満たす Next.js を選択しました。

#### 2-2. shadcn/ui
shadcn/ui を選んだ理由は以下です。
1. React Server Component に対応していること
2. zero runtime で動作すること

Chakra UI や Radix UI と比較した結果、現時点で最も多くの GitHub star を集めている shadcn/ui を採用しました。

#### 2-3. Tailwind CSS
shadcn/ui のコンポーネントが Tailwind CSS ベースであるため採用しました。
また、これまで Tailwind CSS を使用したことがなかったため、実際に試してみたい意図もありました。

#### 2-4. Route 53 + S3 + CloudFront + Lambda@Edge
旧ポートフォリオから使用している構成です。
Vercel の導入も検討しましたが、記事の更新頻度が低く ISR のメリットが少ないため、その代わり記事更新時に自動でビルドが走るよう CI/CD を組みました。
さらに、Lambda@Edge で URL の正規化処理も行い、URL 管理を最適化しました。

#### 2-5. Lambda + API Gateway + SES
旧ポートフォリオから使用している構成です。
コンタクトフォームの入力を SES に連携し、メール送信を行っています。

#### 2-6. Contentful + Github Actions
旧ポートフォリオから使用している技術です。
Contentful の記事に更新があると Webhook を飛ばし、GitHub Actions でビルドが走るようにしました。

### 3. 使用した感想
#### 3-1. Next.js
SSG でビルドする場合でも、App Router を用いることで以下の利点が得られると感じました。
- getServerSideProps や getStaticProps を使用せず、Server Component 内で直接 `fetch` を用いてデータフェッチが可能で、データ取得の管理がシンプルです。
- Server Component にデータフェッチやビジネスロジックを集約し、クライアントコンポーネントには必要なデータのみを渡すことでコードを簡潔に保てます。
- ページの一部のみを SSG で生成し、他の部分をクライアントでレンダリングするなど細かな制御が可能です。
- キャッシュを活用して、リアルタイム性が求められるページと静的にキャッシュするページを柔軟に管理できます。

#### 3-2. shadcn/ui
コンポーネントコードがプロジェクト内に直接配置されるため、node_modules から import する形式に比べてカスタマイズが容易でした。

#### 3-3. Tailwind CSS
- 予め定義されたユーティリティクラスが充実しているため、通常のCSSを書かなくてもほぼ済みました。特に今回記述したいスタイルはシンプルなものに限られていたため、すべてを global.css にまとめることができました。
- 必要に応じてユーティリティクラスを追加できるため、プロジェクトに合わせた柔軟なスタイリングができる点も便利でした。
- しかし、今回のようなリプレイスの場合、リプレイス元のスタイルをそのまま使用した方が効率的だったかもしれません。
- Tailwind の知識への依存度が高く、仮に廃れた場合、再リプレイスが大変になりそうな感触も受けました。

### 4. 工夫した点
##### 4-1. その1
Moblie 版のヘッダーメニューです。[該当箇所](https://github.com/masayukinii1011/next-portfolio/blob/main/src/app/components/MobileMenu.tsx)
画面遷移時に Sheet コンポーネントが閉じて欲しかったのですが、そのままでは開きっぱなしです。
Server Component では画面遷移判定を取得することができなかったので、Client Component にして、`usePathname` で path の変更を検知するようにしました。

##### 4-1. その2
コンタクトフォームです。[該当箇所](https://github.com/masayukinii1011/next-portfolio/blob/main/src/app/components/ContactForm.tsx)
`useForm` が Server Component で使えなかったので、Client Component にしました。
この際、onSubmit を Server Action として扱おうとも思いましたが、SSG では Server Action が使えない (仕組みを考えれば当たり前ですが...) ので、Client Action としました。
