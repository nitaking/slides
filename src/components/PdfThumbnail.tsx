import { useState } from 'react';
import { Document, Page } from 'react-pdf';

import { asset, pdfOptions } from '../pdf';
import type { Slide } from '../data/slides';
import styles from './PdfThumbnail.module.css';

interface Props {
  slide: Slide;
  width?: number;
}

export function PdfThumbnail({ slide, width = 240 }: Props) {
  const [failed, setFailed] = useState(false);

  if (slide.thumbnail) {
    return (
      <img
        className={styles.img}
        src={asset(slide.thumbnail)}
        alt={slide.title}
        loading="lazy"
      />
    );
  }

  if (failed) {
    return <div className={styles.fallback}>PDF</div>;
  }

  return (
    <Document
      file={asset(slide.pdfPath)}
      options={pdfOptions}
      loading={<div className={styles.loading} />}
      error={<div className={styles.fallback}>PDF</div>}
      onLoadError={() => setFailed(true)}
    >
      <Page
        pageNumber={1}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}
