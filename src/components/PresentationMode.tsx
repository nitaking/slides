import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';

import { pdfOptions } from '../pdf';
import styles from './PresentationMode.module.css';

const CURSOR_HIDE_DELAY = 1000;

interface Props {
  file: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  onClose: (page: number) => void;
}

/** 1 ページずつ全画面表示するプレゼンモード（オーバーレイ）。 */
export function PresentationMode({
  file,
  initialPage = 1,
  onPageChange,
  onClose,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSlots, setPageSlots] = useState<{ a: number; b: number | null }>({
    a: initialPage,
    b: null,
  });
  const [activeSlot, setActiveSlot] = useState<'a' | 'b'>('a');
  const [aspect, setAspect] = useState(16 / 9);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);
  const onPageChangeRef = useRef(onPageChange);
  onPageChangeRef.current = onPageChange;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const pageRef = useRef(page);
  pageRef.current = page;
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const activePage = activeSlot === 'a' ? pageSlots.a : (pageSlots.b ?? pageSlots.a);
  const inactiveSlot = activeSlot === 'a' ? 'b' : 'a';

  useEffect(() => {
    if (page === activePage) return;

    setPageSlots((current) => {
      if (current[inactiveSlot] === page) return current;
      return { ...current, [inactiveSlot]: page };
    });
  }, [activePage, inactiveSlot, page]);

  useEffect(() => {
    onPageChangeRef.current?.(page);
  }, [page]);

  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(numPages || 1, p + 1)),
    [numPages],
  );

  const markInteraction = useCallback(() => {
    setIsCursorVisible(true);

    if (hideControlsTimeoutRef.current !== null) {
      window.clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = window.setTimeout(() => {
      setIsCursorVisible(false);
    }, CURSOR_HIDE_DELAY);
  }, []);

  // body スクロールをロック
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;

      if (hideControlsTimeoutRef.current !== null) {
        window.clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    markInteraction();

    window.addEventListener('pointermove', markInteraction, { passive: true });
    window.addEventListener('pointerdown', markInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointermove', markInteraction);
      window.removeEventListener('pointerdown', markInteraction);
    };
  }, [markInteraction]);

  // ステージサイズ計測
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // キーボード操作
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      markInteraction();

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Home':
          setPage(1);
          break;
        case 'End':
          setPage(numPages || 1);
          break;
        case 'Escape':
          onCloseRef.current(pageRef.current);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, markInteraction, numPages]);

  // 左右半分クリックでページ送り
  const onStageClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width / 2) goPrev();
    else goNext();
  };

  // ステージに収まるページ幅を計算
  const pad = 48;
  const availW = Math.max(0, stage.w - pad);
  const availH = Math.max(0, stage.h - pad);
  const pageWidth = Math.min(availW, availH * aspect) || availW;

  const handleSlotRenderSuccess = useCallback(
    (slot: 'a' | 'b', renderedPage: number) => {
      if (renderedPage !== pageRef.current) return;
      setActiveSlot(slot);
    },
    [],
  );

  const renderPageSlot = (slot: 'a' | 'b', pageNumber: number | null) => {
    if (!pageNumber || pageWidth <= 0) return null;

    const isActive = slot === activeSlot;

    return (
      <div
        className={`${styles.pageLayer} ${isActive ? styles.pageLayerActive : styles.pageLayerHidden}`}
        aria-hidden={!isActive}
      >
        <Page
          key={`${slot}-${pageNumber}`}
          pageNumber={pageNumber}
          width={pageWidth}
          onLoadSuccess={(loadedPage) => setAspect(loadedPage.width / loadedPage.height)}
          onRenderSuccess={() => handleSlotRenderSuccess(slot, pageNumber)}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </div>
    );
  };

  return (
    <div
      className={`${styles.overlay} ${!isCursorVisible ? styles.overlayCursorHidden : ''}`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${styles.stage} ${!isCursorVisible ? styles.stageCursorHidden : ''}`}
        ref={stageRef}
        onClick={onStageClick}
      >
        <Document
          file={file}
          options={pdfOptions}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          loading={<div className={styles.message}>読み込み中…</div>}
          error={<div className={styles.message}>PDF を読み込めませんでした。</div>}
        >
          {pageWidth > 0 && (
            <div
              className={styles.pageStack}
              style={{ width: `${pageWidth}px`, height: `${pageWidth / aspect}px` }}
            >
              {renderPageSlot('a', pageSlots.a)}
              {renderPageSlot('b', pageSlots.b)}
            </div>
          )}
        </Document>
      </div>

      <div
        className={`${styles.controls} ${!isCursorVisible ? styles.controlsHidden : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.navButton}
          onClick={goPrev}
          disabled={page <= 1}
          aria-label="前のスライド"
        >
          ‹
        </button>
        <span className={styles.counter}>
          {page} / {numPages || '–'}
        </span>
        <button
          type="button"
          className={styles.navButton}
          onClick={goNext}
          disabled={numPages > 0 && page >= numPages}
          aria-label="次のスライド"
        >
          ›
        </button>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => onCloseRef.current(pageRef.current)}
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
