import { Footer } from '../components/Footer';
import { TalksList } from '../components/TalksList';
import styles from './Home.module.css';

export function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Satoshi Nitawaki</p>
        <h1 className={styles.title}>slides</h1>
      </header>

      <section className={styles.talks}>
        <div className={styles.sectionContainer}>
          <TalksList />
        </div>
      </section>

      <Footer />
    </div>
  );
}
