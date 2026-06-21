import { useCallback, useEffect, useState } from 'react';
import {
  Link,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Footer } from '../components/Footer';
import { PdfScrollViewer } from '../components/PdfScrollViewer';
import { PresentationMode } from '../components/PresentationMode';
import { findSlide } from '../data/slides';
import { asset } from '../pdf';
import { formatDate } from '../utils/date';
import styles from './TalkDetail.module.css';

function getPageFromSearchParams(searchParams: URLSearchParams) {
  const value = searchParams.get('page');
  if (!value) return undefined;

  const page = parseInt(value, 10);
  return Number.isNaN(page) || page < 1 ? undefined : page;
}

export function TalkDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const slide = id ? findSlide(id) : undefined;
  const [page, setPage] = useState<number | undefined>(() =>
    getPageFromSearchParams(searchParams),
  );
  const [presentation, setPresentation] = useState(
    () => searchParams.get('preview') === '1',
  );
  const [displayPage, setDisplayPage] = useState(() =>
    getPageFromSearchParams(searchParams) ?? 1,
  );
  const currentPage = page ?? 1;

  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    setPage(getPageFromSearchParams(searchParams));
    setPresentation(searchParams.get('preview') === '1');
    setDisplayPage(getPageFromSearchParams(searchParams) ?? 1);
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (update: (nextParams: URLSearchParams) => void) => {
      const nextParams = new URLSearchParams(searchParams);
      update(nextParams);
      const nextSearch = nextParams.toString();
      const nextPath = `/slide/${id}${nextSearch ? `?${nextSearch}` : ''}`;
      const nextHash = `#${nextPath}`;

      if (window.location.hash !== nextHash) {
        const nextUrl = new URL(window.location.href);
        nextUrl.hash = nextPath;
        window.history.replaceState(window.history.state, '', nextUrl);
      }

      setPage(getPageFromSearchParams(nextParams));
      setPresentation(nextParams.get('preview') === '1');
      setDisplayPage(getPageFromSearchParams(nextParams) ?? 1);
    },
    [id, searchParams],
  );

  const openPresentation = useCallback(() => {
    updateSearchParams((nextParams) => {
      nextParams.set('preview', '1');
      nextParams.set('page', String(currentPage));
    });
  }, [currentPage, updateSearchParams]);

  useEffect(() => {
    if (presentation) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || !event.metaKey) return;

      event.preventDefault();
      openPresentation();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openPresentation, presentation]);

  if (!slide) {
    return (
      <div className={styles.notFound}>
        <p>スライドが見つかりませんでした。</p>
        <Link to="/">← 一覧へ戻る</Link>
      </div>
    );
  }

  const fileUrl = asset(slide.pdfPath);

  return (
    <div className={styles.container}>
      <div className={styles.fixedHeader}>
        <Link to="/" className={styles.backLink} aria-label="一覧へ戻る">
          ←
        </Link>
        <div className={styles.headerActions}>
          {numPages > 0 && (
            <div className={styles.pageIndicator}>
              <span>{displayPage}</span>
              <span className={styles.pageIndicatorDot}>・</span>
              <span>{numPages}</span>
            </div>
          )}
          <a
            href={fileUrl}
            download
            className={styles.iconButton}
            aria-label="PDF をダウンロード"
            title="PDF をダウンロード"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={styles.iconGlyph}
            >
              <path
                d="M12 4v10m0 0 4-4m-4 4-4-4M5 18h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      <main className={styles.main}>
        <header className={styles.head}>
          <div className={styles.meta}>
            {slide.event && <span className={styles.event}>{slide.event}</span>}
            <span className={styles.date}>{formatDate(slide.date)}</span>
          </div>
          <h1 className={styles.title}>
            {slide.title}
            <button
              type="button"
              className={styles.presentButton}
              onClick={openPresentation}
              aria-label="プレゼンモードで表示"
              title="プレゼンモードで表示"
            >
              ⛶
            </button>
          </h1>
          {slide.description && (
            <p className={styles.description}>{slide.description}</p>
          )}
        </header>

        <PdfScrollViewer
          file={fileUrl}
          page={page}
          onLoad={setNumPages}
          onPageChange={(nextPage) => {
            updateSearchParams((nextParams) => {
              nextParams.set('page', String(nextPage));
            });
          }}
        />
      </main>

      <Footer />

      {presentation && (
        <PresentationMode
          file={fileUrl}
          initialPage={currentPage}
          onPageChange={(nextPage) => {
            updateSearchParams((nextParams) => {
              nextParams.set('page', String(nextPage));
              nextParams.set('preview', '1');
            });
          }}
          onClose={(nextPage) => {
            updateSearchParams((nextParams) => {
              nextParams.set('page', String(nextPage));
              nextParams.delete('preview');
            });
          }}
        />
      )}
    </div>
  );
}
