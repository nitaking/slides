# slides

nitaking（Satoshi Nitawaki）の登壇・勉強会スライドのアーカイブサイトです。
PDF をそのまま [react-pdf](https://github.com/wojtekmaj/react-pdf) でブラウザ表示します。

公開先: https://nitaking.github.io/slides/

## 技術スタック

- Vite + React + TypeScript
- react-router-dom（一覧 → ビューア遷移）
- react-pdf（PDF レンダリング）
- GitHub Pages（GitHub Actions で自動デプロイ）

## ディレクトリ構成

```
.
├── public/
│   └── pdfs/                  # 公開する PDF 資産
│       └── 20220408_react-native-tips.pdf
├── src/
│   ├── data/slides.ts         # スライドのメタデータ（タイトル/日付/タグ/PDFパス）
│   ├── components/
│   │   └── PdfThumbnail.tsx   # 一覧のサムネイル（PDF 1ページ目を描画）
│   ├── pages/
│   │   ├── SlideListPage.tsx  # 一覧画面（タグ絞り込み付き）
│   │   └── SlideViewerPage.tsx# ビューア画面（ページ送り）
│   ├── pdf.ts                 # pdfjs worker / asset パス解決
│   ├── App.tsx
│   └── main.tsx
├── react-native-tips/         # Slidev ソース（PDF の元データ）
└── slidev/                    # Slidev スターターのソース
```

## 開発

```bash
npm install
npm run dev      # http://localhost:5173/slides/
npm run build    # 型チェック + 本番ビルド (dist/)
npm run preview  # ビルド成果物をローカル確認
```

## スライドの追加方法

1. Slidev 等で作成した PDF を `public/pdfs/` に置く
   （命名規則: `YYYYMMDD_<slug>.pdf`）
2. `src/data/slides.ts` の `slides` 配列の **先頭** にメタデータを追記する

```ts
{
  id: 'my-talk',                 // URL に使うスラッグ（一意）
  title: 'タイトル',
  date: '2026-06-25',            // YYYY-MM-DD
  event: 'イベント名',           // 任意
  tags: ['React', '勉強会'],
  pdf: 'pdfs/20260625_my-talk.pdf',
  // thumbnail: 'thumbnails/xxx.png', // 任意。未指定なら PDF 1ページ目を表示
  // links: [{ label: 'イベントページ', url: 'https://...' }],
}
```

3. `main` ブランチに push すると GitHub Actions が自動でビルド & デプロイします
   （`Settings > Pages > Source` を **GitHub Actions** に設定しておくこと）。
   手動デプロイする場合は `npm run deploy`（gh-pages）も利用できます。

## スライド作成時に参考になるもの

- https://github.com/loftkun/slidev-example
  - https://qiita.com/loftkun/items/2fbeddc9449eb5d85dfd
  - https://loftkun-slidev-example.netlify.app/
