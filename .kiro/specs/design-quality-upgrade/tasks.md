# Implementation Plan

- [x] 1. フォント導入 + カラーシステム + グローバルスタイル刷新
  - index.css で gen-interface-jp の CSS を @import
  - CSS Custom Properties のフォント変数・カラー変数を刷新
  - リンク underline を hover のみに、::selection カラー設定
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 7.1, 7.2_

- [x] 2. Home ページの品質向上
  - [x] 2.1 Hero セクションのスタイル刷新
    - パディング拡大、タイトルに font-display + tracking
    - Eyebrow パターンで名前表示を Home.tsx に追加
    - _Requirements: 3.1, 3.2_
  - [x] 2.2 TalksList カードの品質向上
    - サムネイルに ring shadow、ホバー時 shadow lift + scale
    - バッジを pill 型に、タイトルに font-display
    - _Requirements: 3.3, 3.4_

- [x] 3. TalkDetail ページの品質向上
  - アイコンボタンを pill 型に統一
  - タイトルに font-display、メタ情報に Eyebrow パターン
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 4. PDF ビューアーの微調整 + ページアンカー
  - [x] 4.1 スタイル調整
    - ページ間 gap 拡大、ring shadow、border-radius 拡大
    - _Requirements: 5.4_
  - [x] 4.2 ページアンカー機能
    - 各ページに id="page-{n}" 付与
    - 初回ロード時の hash 読み取り + scrollIntoView
    - スクロール時の history.replaceState による hash 更新
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5. フッターの品質向上
  - 背景帯追加、パディング拡大
  - GitHub / X の SVG アイコンリンク追加
  - コピーライト色の調整
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 6. ビルド検証
  - TypeScript エラーなし、Vite ビルド成功
  - _Requirements: all_
