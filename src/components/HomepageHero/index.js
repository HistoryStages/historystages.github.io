import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

// A scene from the trailer behind the trailer's own wordmark: the library with the golden
// pedestal, softened so the text in front of it stays the thing you read.
export default function HomepageHero() {
  const wordmark = useBaseUrl('/img/wordmark.png');
  const background = useBaseUrl('/img/hero-library.webp');
  return (
    <header
      className={clsx('hero', styles.heroBanner)}
      style={{'--hero-image': `url(${background})`}}>
      <div className={clsx('container', styles.heroContent)}>
        <Heading as="h1" className={styles.heroTitle}>
          <img src={wordmark} alt="History Stages" className={styles.wordmark} />
        </Heading>
        <p className={styles.claim}>
          <Translate id="homepage.hero.claim">Your pack. Your history.</Translate>
        </p>
        <p className={styles.heroSubtitle}>
          {translate({
            id: 'homepage.hero.subtitle',
            message:
              'Progression for modpacks: hold items, recipes, places and mobs back until players research their way to them.',
          })}
        </p>
        <div className={styles.buttons}>
          {/* Points at the wiki's own landing page rather than straight at the install steps:
              someone arriving here has to be told what a stage is before being told where to
              drop the jar. "Start Here" is what the sidebar calls that section too, so the
              button and the page it opens agree on their name. */}
          <Link className={clsx('button button--lg', styles.heroButton)} to="/wiki/">
            <Translate id="homepage.hero.start">Start Here</Translate>
          </Link>
          <Link
            className={clsx('button button--lg', styles.heroButtonOutline)}
            to="/download">
            <Translate id="homepage.hero.download">Download</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}
