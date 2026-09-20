import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Copy trimmed from the mod's own Modrinth/CurseForge listing — the actual pitch,
// not a paraphrase of it. Screenshots are the real gallery images from there too.
const FeatureList = [
  {
    title: 'Research System',
    image: 'research-pedestal.webp',
    description: (
      <>
        Players bring Research Scrolls to a Research Pedestal and spend time
        researching the next era. Four pedestal tiers, placeable boosters, and a
        dependency system covering XP, kills, stats, and more.
      </>
    ),
    to: '/wiki/in-game-tools/research/pedestal',
  },
  {
    title: 'In-Game Editor',
    image: 'in-game-editor.webp',
    description: (
      <>
        Build your entire stage setup without touching a config file — folders,
        drag-to-organize, per-player unlocks, and a live-preview tooltip
        designer, all from the pause menu.
      </>
    ),
    to: '/wiki/in-game-tools/in-game-editor',
  },
  {
    title: 'Stage Graph',
    image: 'stage-graph.webp',
    description: (
      <>
        A progression map players open from the pause menu: nodes for stages,
        edges for dependencies, colour-coded Unlocked, Reachable, and Locked.
        Off by default — how much structure to reveal is your call.
      </>
    ),
    to: '/wiki/in-game-tools/stage-graph',
  },
  {
    title: 'The Research Record',
    image: 'open-scroll.webp',
    description: (
      <>
        An opened scroll is a real, readable document with chapters for items,
        creatures, and world. Lay it on a lectern and anyone can read it —
        obscured mode turns locked entries into silhouettes.
      </>
    ),
    to: '/wiki/in-game-tools/research/scrolls#the-open-scroll-document',
  },
  {
    title: 'Addon Platform',
    icon: true,
    description: (
      <>
        Other mods register their own lock categories, requirements, and editor
        tabs through mod-bus events — no fork, no mixin, same widgets the
        built-in tabs are made of.
      </>
    ),
    to: '/api/addon-development',
  },
];

function Feature({title, image, icon, description, to}) {
  const imageUrl = useBaseUrl(image ? `/img/screenshots/${image}` : '/img/icon.png');
  return (
    <Link to={to} className={styles.card}>
      <div className={styles.cardMedia}>
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          className={icon ? styles.cardIcon : styles.cardScreenshot}
        />
      </div>
      <div className={styles.cardBody}>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardDescription}>{description}</p>
        <span className={styles.cardLink}>Learn more →</span>
      </div>
    </Link>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.grid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
