import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';

import { pdfOptions } from '../pdf';
import styles from './PdfScrollViewer.module.css';

const INITIAL_VISIBLE_PAGES = 3;
const VISIBLE_PAGE_CHUNK = 4;
const PAGE_TRACK_OFFSET = 100;

interface Props {
  file: string;
  page?: number;
  onLoad?: (numPages: number) => void;
  onPageChange?: (page: number) => void;
}

export function PdfScrollViewer({ file, page, onLoad, onPageChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingScrollPageRef = useRef<number | null>(null);
  const currentPageRef = useRef(1);
  const [numPages, setNumPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState(INITIAL_VISIBLE_PAGES);
  const [width, setWidth] = useState(900);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(Math.min(el.clientWidth, 900));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleLoad = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
      pageRefs.current = new Array(n).fill(null);

      if (page === undefined) {
        currentPageRef.current = 1;
        pendingScrollPageRef.current = null;
        setVisiblePages(Math.min(n, INITIAL_VISIBLE_PAGES));
      } else {
        const initialPage = Math.min(n, Math.max(page, 1));
        currentPageRef.current = initialPage;
        pendingScrollPageRef.current = initialPage;
        setVisiblePages(
          Math.min(n, Math.max(INITIAL_VISIBLE_PAGES, initialPage)),
        );
      }

      onLoad?.(n);
    },
    [onLoad, page],
  );

  const handlePageRender = useCallback((pageNum: number) => {
    const target = pendingScrollPageRef.current;
    if (target === null || pageNum !== target) return;
    pendingScrollPageRef.current = null;
    const el = pageRefs.current[target - 1];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'instant' });
      }, 50);
    }
  }, []);

  useEffect(() => {
    if (page === undefined || numPages === 0) return;

    const nextPage = Math.min(numPages, Math.max(page, 1));

    if (nextPage === currentPageRef.current && pendingScrollPageRef.current === null) {
      return;
    }

    pendingScrollPageRef.current = nextPage;
    currentPageRef.current = nextPage;
    setVisiblePages((current) => Math.min(numPages, Math.max(current, nextPage)));

    const el = pageRefs.current[nextPage - 1];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'instant' });
      }, 50);
    }
  }, [numPages, page]);

  useEffect(() => {
    if (numPages === 0) return;

    let frameId = 0;

    const syncCurrentPage = () => {
      frameId = 0;

      // page prop に追従するスクロール中は、監視側で現在ページを巻き戻さない。
      if (pendingScrollPageRef.current !== null) return;

      const anchor = window.scrollY + PAGE_TRACK_OFFSET;
      let nextPage = currentPageRef.current;

      for (let i = 0; i < visiblePages; i += 1) {
        const el = pageRefs.current[i];
        if (!el) continue;

        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;

        if (anchor >= top && anchor < bottom) {
          nextPage = i + 1;
          break;
        }

        if (anchor >= top) {
          nextPage = i + 1;
        }
      }

      if (nextPage === currentPageRef.current) return;

      currentPageRef.current = nextPage;
      onPageChange?.(nextPage);
    };

    const requestSync = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(syncCurrentPage);
    };

    requestSync();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
    };
  }, [numPages, onPageChange, visiblePages]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || visiblePages >= numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisiblePages((current) =>
          Math.min(numPages, current + VISIBLE_PAGE_CHUNK),
        );
      },
      { rootMargin: '1200px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numPages, visiblePages]);

  return (
    <div className={styles.viewer} ref={containerRef}>
      <Document
        file={file}
        options={pdfOptions}
        onLoadSuccess={handleLoad}
        loading={<div className={styles.message}>読み込み中…</div>}
        error={<div className={styles.message}>PDF を読み込めませんでした。</div>}
      >
        {Array.from({ length: visiblePages }, (_, i) => (
          <div
            key={`page_${i + 1}`}
            className={styles.pageWrap}
            id={`page-${i + 1}`}
            data-page={i + 1}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
          >
            <Page
              pageNumber={i + 1}
              width={width}
              loading={<div className={styles.pageSkeleton} />}
              onRenderSuccess={() => handlePageRender(i + 1)}
            />
          </div>
        ))}
        {visiblePages < numPages && (
          <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
        )}
      </Document>
    </div>
  );
}
