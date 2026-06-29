# Feature Design

## Overview

既存の CSS Modules + CSS Custom Properties アーキテクチャを維持しつつ、Oatmeal Marketing Kit のデザイン原則（タイポグラフィ階層、oklch カラー、pill バッジ、subtle shadow + ring、一貫したスペーシング）を適用する。

フォントは Gen Interface JP（Inter + Noto Sans JP のハイブリッド和欧混植フォント、SIL OFL 1.1）を npm パッケージとして導入済み。

## Architecture

変更対象は CSS とごく一部の TSX のみ。新規コンポーネントの追加はなし。

```
src/
├── index.css                    ← カラーパレット + フォント + グローバルスタイル
├── pages/
│   ├── Home.tsx                 ← Eyebrow (名前表示) 追加
│   ├── Home.module.css          ← Hero スタイル刷新
│   ├── TalkDetail.tsx           ← (変更なし)
│   └── TalkDetail.module.css    ← pill ボタン、font-display
├── components/
│   ├── TalksList.tsx            ← (変更なし)
│   ├── TalksList.module.css     ← カード shadow/ring、pill バッジ
│   ├── PdfScrollViewer.tsx      ← ページアンカー ID + hash 連動
│   ├── PdfScrollViewer.module.css ← gap 拡大、ring shadow
│   ├── Footer.tsx               ← ソーシャルリンク追加
│   └── Footer.module.css        ← 背景帯、パディング
index.html                       ← Gen Interface JP CSS import
```

## Design Tokens (CSS Custom Properties)

```css
/* フォント */
--font-sans: 'Gen Interface JP', system-ui, sans-serif;
--font-display: 'Gen Interface JP Display', 'Gen Interface JP', sans-serif;

/* カラー (oklch mist パレット) */
--color-text:             oklch(14.8% 0.004 228.8);   /* mist-950 */
--color-text-light:       oklch(45% 0.017 213.2);     /* mist-600 */
--color-text-lighter:     oklch(56% 0.021 213.5);     /* mist-500 */
--color-background:       oklch(96.3% 0.002 197.1);   /* mist-100 */
--color-background-light: oklch(98.7% 0.002 197.1);   /* mist-50 */
--color-border:           oklch(92.5% 0.005 214.3);   /* mist-200 */
--color-badge:            oklch(92.5% 0.005 214.3);   /* mist-200 */
--color-accent:           #ff6b35;                     /* 維持 */
```

## Components

### フォント読み込み (index.html)
- gen-interface-jp npm パッケージの CSS を `src/index.css` で `@import` する
- Display 版と Regular 版の両方を読み込む

### ページアンカー (PdfScrollViewer.tsx)
- 各ページ div に `id="page-{n}"` を付与
- `useEffect` で初回ロード時に `location.hash` を読み取り `scrollIntoView({ behavior: 'smooth' })`
- `onPageChange` コールバック内で `history.replaceState(null, '', \`#page-\${page}\`)` を実行
- `.pageWrap` に `scroll-margin-top: 4rem` を設定（固定ヘッダー分）

### フッター (Footer.tsx)
- GitHub / X の SVG アイコンを inline で追加
- リンク先: `https://github.com/nitaking`, `https://x.com/nitaking`

## Testing Strategy

- ビルドエラーなし: `npm run build`
- 目視確認: dev server で Home + TalkDetail の両ページ
- レスポンシブ: 600px 以下でカードが縦並び、レイアウト崩れなし
- ページアンカー: `/slide/react-native-tips/#page-3` でダイレクトアクセス確認
