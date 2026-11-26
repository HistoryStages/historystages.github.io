import {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// Screenshots that belong together, shown one at a time with a strip of thumbnails to switch
// between them. A stack of five full-width pictures pushed the text they illustrate a whole
// screen down; this takes the room of one. Click the large picture to enlarge it (medium-zoom
// picks up every image inside the page body).
function Thumb({item, active, onClick}) {
  const url = useBaseUrl(item.src);
  return (
    <button
      type="button"
      className={active ? `${styles.thumb} ${styles.active}` : styles.thumb}
      onClick={onClick}
      aria-label={item.alt}
      title={item.alt}>
      <img src={url} alt="" loading="lazy" className="no-zoom" />
    </button>
  );
}

export default function Gallery({items = []}) {
  const [index, setIndex] = useState(0);
  const current = items[index] ?? items[0];
  const url = useBaseUrl(current?.src ?? '');
  if (!current) {
    return null;
  }
  return (
    <figure className={styles.gallery}>
      <div className={styles.stage}>
        <img key={current.src} src={url} alt={current.alt} />
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.counter}>
          {index + 1} / {items.length}
        </span>
        {current.alt}
      </figcaption>
      <div className={styles.thumbs}>
        {items.map((it, i) => (
          <Thumb key={it.src} item={it} active={i === index} onClick={() => setIndex(i)} />
        ))}
      </div>
    </figure>
  );
}
