# Requirements Document

## Introduction

スライドアーカイブサイトのデザイン品質を、Tailwind Plus「Oatmeal Marketing Kit」のデザイン原則を参考に向上させる。タイポグラフィ、カラーシステム、各コンポーネントの品質を刷新し、PDFビューアーにページアンカー機能を追加する。

## Requirements

### Requirement 1: タイポグラフィの刷新

**User Story:** As a サイト訪問者, I want 美しく統一された和欧混植フォントで表示されたコンテンツを見たい, so that プロフェッショナルな印象を受けられる

#### Acceptance Criteria

1. WHEN ページをロードする THEN サイト SHALL Gen Interface JP フォントで本文を表示する
2. WHEN 見出しを表示する THEN サイト SHALL Gen Interface JP Display を使用し letter-spacing: -0.03em で表示する
3. WHEN フォントの読み込みが失敗する THEN サイト SHALL system-ui にフォールバックする

### Requirement 2: カラーシステムの統一

**User Story:** As a サイト訪問者, I want 洗練された統一カラーパレットで表示されたサイトを見たい, so that 視覚的に心地よい体験ができる

#### Acceptance Criteria

1. WHEN ページを表示する THEN サイト SHALL oklch ベースの mist パレットでカラーを表示する
2. WHEN テキストを表示する THEN サイト SHALL mist-950 (最濃) から mist-500 (最淡) の階層的なコントラストを使用する
3. WHEN 背景を表示する THEN サイト SHALL mist-100 をメイン背景、mist-50 をサブ背景として使用する

### Requirement 3: Home ページの品質向上

**User Story:** As a サイト訪問者, I want 洗練されたヒーローセクションとカード一覧を見たい, so that サイトの第一印象が良くなる

#### Acceptance Criteria

1. WHEN Home ページを表示する THEN ヒーロー SHALL 十分な余白 (6rem top) と font-display による大きなタイトルを表示する
2. WHEN Home ページを表示する THEN ヒーロー SHALL 「Satoshi Nitawaki」の名前を Eyebrow パターンで表示する
3. WHEN カードをホバーする THEN カード SHALL shadow lift とサムネイル scale(1.02) のアニメーションを表示する
4. WHEN イベントバッジを表示する THEN バッジ SHALL pill 型 (border-radius: 9999px) で表示する

### Requirement 4: TalkDetail ページの品質向上

**User Story:** As a サイト訪問者, I want 詳細ページで統一されたデザインのヘッダーとメタ情報を見たい, so that 情報が見やすくなる

#### Acceptance Criteria

1. WHEN 詳細ページを表示する THEN タイトル SHALL font-display で表示する
2. WHEN アイコンボタンを表示する THEN ボタン SHALL border-radius: 9999px (pill) で統一する
3. WHEN メタ情報を表示する THEN イベント名/日付 SHALL Eyebrow パターン (font-weight: 500, mist-700) で表示する

### Requirement 5: PDF ビューアーのページアンカー

**User Story:** As a サイト訪問者, I want URL のハッシュで特定のスライドページに直接アクセスしたい, so that 特定ページを共有できる

#### Acceptance Criteria

1. WHEN PDF ページを表示する THEN 各ページ SHALL `id="page-{n}"` のアンカーを持つ
2. WHEN `#page-3` 付き URL でアクセスする THEN ビューア SHALL 該当ページまで自動スクロールする
3. WHEN スクロールでページが変わる THEN URL ハッシュ SHALL `history.replaceState` で更新される（戻るボタンを汚さない）
4. WHEN 固定ヘッダーがある THEN ページ SHALL `scroll-margin-top` で隠れないように調整される

### Requirement 6: フッターの品質向上

**User Story:** As a サイト訪問者, I want フッターから作者の GitHub/X にアクセスしたい, so that 作者について知れる

#### Acceptance Criteria

1. WHEN フッターを表示する THEN フッター SHALL subtle な背景帯 (mist-950/2.5%) を持つ
2. WHEN フッターを表示する THEN フッター SHALL GitHub と X の SVG アイコンリンクを表示する
3. WHEN フッターを表示する THEN コピーライト SHALL mist-500 色で表示する

### Requirement 7: グローバルスタイル調整

**User Story:** As a サイト訪問者, I want リンクやセレクションなどの細部も洗練されたデザインで表示されたい, so that サイト全体の品質が高く感じられる

#### Acceptance Criteria

1. WHEN リンクにホバーする THEN アンダーライン SHALL ホバー時のみ表示される
2. WHEN テキストを選択する THEN 選択色 SHALL accent 系カラーで表示される
