import { pdfjs } from 'react-pdf';

// react-pdf v9 / pdfjs-dist v4 系のワーカー設定。
// Vite が同梱の worker を解決できるよう import.meta.url 経由で指定する。
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// PDF の読み込みオプション（日本語フォント表示のための CMap / 標準フォント）。
// バージョンずれを防ぐため pdfjs.version を URL に埋め込む。
export const pdfOptions = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
