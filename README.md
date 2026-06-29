# slides

登壇・勉強会スライドのアーカイブサイト。PDF を [react-pdf](https://github.com/wojtekmaj/react-pdf) でブラウザ表示し、Slidev デッキは Vercel でインタラクティブ版を個別デプロイ。

https://nitaking.github.io/slides/

## Tech Stack

- Vite + React + TypeScript
- react-pdf — PDF レンダリング（スクロールビューア + プレゼンモード）
- react-router-dom — `HashRouter`（GitHub Pages 対応）
- Gen Interface JP + oklch カラーパレット
- GitHub Pages — GitHub Actions で自動デプロイ
- Vercel — Slidev デッキの個別デプロイ

## Directory Structure

```
src/
├── data/slides.ts             # スライドメタデータ
├── components/
│   ├── PdfThumbnail.tsx       # PDF 1ページ目サムネイル
│   ├── PdfScrollViewer.tsx    # スクロール式 PDF ビューア
│   ├── PresentationMode.tsx   # フルスクリーン表示
│   └── TalksList.tsx          # カード一覧
├── pages/
│   ├── Home.tsx               # 一覧ページ
│   └── TalkDetail.tsx         # 詳細 / ビューアページ
└── pdf.ts                     # pdfjs worker / asset パス解決

public/slides/                 # PDF ファイル
public/thumbnails/             # サムネイル画像

decks/                         # Slidev デッキ（pnpm workspace）
├── react-native-tips/         # → react-native-tips.vercel.app
└── slidev-starter/            # 新規デッキ用テンプレート
```

## Development

```bash
npm install
npm run dev        # http://localhost:5173/slides/
npm run build      # 型チェック + 本番ビルド
npm run preview    # ビルド成果物をローカル確認
```

## Adding a Slide

### PDF のみ

1. PDF を `public/slides/` に配置（命名: `YYYYMMDD_<slug>.pdf`）
2. `src/data/slides.ts` の `slides` 配列先頭に追加:

```ts
{
  slug: 'my-talk',
  title: 'タイトル',
  event: 'イベント名',
  date: '2026-06-29',
  pdfPath: 'slides/20260629_my-talk.pdf',
  // thumbnail: 'thumbnails/20260629_my-talk.png',
}
```

3. `main` に push → GitHub Actions が自動デプロイ

### Slidev デッキ付き

1. `script/deck.sh new my-talk` でテンプレートから作成
2. `decks/my-talk/slides.md` を編集
3. Vercel でプロジェクトを作成（Root Directory: `decks/my-talk`）
4. `slides.ts` に `slidevUrl` を追加:

```ts
{
  slug: 'my-talk',
  // ...
  slidevUrl: 'https://my-talk.vercel.app',
}
```

## Deck Management

```bash
script/deck.sh list                    # デッキ一覧
script/deck.sh new <name>             # テンプレートから作成
script/deck.sh dev <name>             # Slidev 開発サーバー
script/deck.sh build <name>           # 本番ビルド
script/deck.sh export <name>          # PDF エクスポート → public/slides/
script/deck.sh deploy <name>          # Vercel デプロイ

# mise でも利用可能
mise run slidev:dev react-native-tips
```

## Deploy

- **アーカイブサイト**: `Settings > Pages > Source` を GitHub Actions に設定。`main` push で自動デプロイ
- **Slidev デッキ**: Vercel で各デッキを個別プロジェクトとしてデプロイ（Root Directory を `decks/<name>` に指定）
