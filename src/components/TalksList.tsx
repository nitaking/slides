import { Link } from 'react-router-dom';

import { PdfThumbnail } from './PdfThumbnail';
import { sortedSlides } from '../data/slides';
import { formatDate } from '../utils/date';
import styles from './TalksList.module.css';

export function TalksList() {
  const slides = sortedSlides();

  return (
    <div className={styles.container}>
      <div className={styles.talksList}>
        {slides.map((slide) => (
          <Link
            key={slide.slug}
            to={`/slide/${slide.slug}/`}
            className={styles.talkCard}
          >
            <div className={styles.thumbnail}>
              <PdfThumbnail slide={slide} width={240} />
            </div>
            <div className={styles.talkContent}>
              <div className={styles.talkMeta}>
                {slide.slidevUrl && (
                  <span className={styles.interactiveBadge}>Interactive</span>
                )}
                {slide.event && (
                  <span className={styles.event}>{slide.event}</span>
                )}
                <span className={styles.date}>{formatDate(slide.date)}</span>
              </div>
              <h2 className={styles.talkTitle}>{slide.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {slides.length === 0 && (
        <div className={styles.empty}>
          <h3>まだスライドがありません</h3>
          <p>登壇・勉強会のスライドを順次追加していきます。</p>
        </div>
      )}
    </div>
  );
}
