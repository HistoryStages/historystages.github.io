import {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const VIDEO_ID = 'IOS8yzhGZ3A';

// The player only loads once someone clicks. An iframe straight in the page would hand every
// visitor to YouTube on arrival, cookies and all, just for scrolling past it. Until then it is
// our own cover image, and the nocookie domain keeps it quiet after the click as well.
export default function HomepageTrailer() {
  const [playing, setPlaying] = useState(false);
  const coverUrl = useBaseUrl('/img/trailer-cover.png');
  return (
    <section className={styles.trailer}>
      <div className="container">
        <div className={styles.header}>
          <Heading as="h2" className={styles.heading}>
            Official trailer
          </Heading>
          <span className={styles.subtitle}>Three minutes of what the mod can do.</span>
        </div>
        <div className={styles.frame}>
          {playing ? (
            <iframe
              className={styles.player}
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title="History Stages – Official Trailer"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              // YouTube refuses to play (error 153) when the embed arrives without a referrer.
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button type="button" className={styles.cover} onClick={() => setPlaying(true)}>
              <img src={coverUrl} alt="" width="1280" height="720" loading="lazy" />
              <span className={styles.play} aria-hidden="true" />
              <span className={styles.coverLabel}>Play trailer (loads YouTube)</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
