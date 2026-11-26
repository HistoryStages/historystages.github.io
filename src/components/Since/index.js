import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

// A small version mark at the end of a sentence, instead of opening the sentence with
// "Since 6.1.0 …": the reader learns what the thing does first and when it arrived second.
export default function Since({v}) {
  const label = translate(
    {id: 'since.title', message: 'Added in {version}'},
    {version: v},
  );
  return (
    <span className={styles.since} title={label} aria-label={label}>
      {v}+
    </span>
  );
}
