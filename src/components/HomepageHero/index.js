import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Ornamental corner bracket, echoing the frame PixlStudios already drew for the mod's own
// Modrinth/CurseForge gallery cards (a dark red field, double gold lines cornering it) —
// reused branding rather than an invented motif.
function CornerBracket({className}) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M4 24 V10 a6 6 0 0 1 6-6 H24" stroke="currentColor" strokeWidth="2" />
      <path d="M4 32 V10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M32 4 H10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export default function HomepageHero() {
  const {siteConfig} = useDocusaurusContext();
  const iconUrl = useBaseUrl('/img/icon.png');
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.glow} />
      <CornerBracket className={clsx(styles.bracket, styles.bracketTL)} />
      <CornerBracket className={clsx(styles.bracket, styles.bracketTR)} />
      <CornerBracket className={clsx(styles.bracket, styles.bracketBL)} />
      <CornerBracket className={clsx(styles.bracket, styles.bracketBR)} />
      <div className={clsx('container', styles.heroContent)}>
        <div className={styles.iconWrap}>
          <img src={iconUrl} alt="" width="96" height="96" className={styles.heroIcon} />
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          History Stages
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          {/* Points at the wiki's own landing page rather than straight at the install steps:
              someone arriving here has to be told what a stage is before being told where to
              drop the jar. "Start Here" is what the sidebar calls that section too, so the
              button and the page it opens agree on their name. */}
          <Link className={clsx('button button--lg', styles.heroButton)} to="/wiki/">
            Start Here
          </Link>
        </div>
      </div>
    </header>
  );
}
