import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

// Copy trimmed from the mod's own Modrinth/CurseForge listing — the actual pitch,
// not a paraphrase of it. Screenshots are the real gallery images from there too.
const FeatureList = [
  {
    title: translate({id: 'features.research-system.title', message: 'Research System'}),
    image: 'research-pedestal.webp',
    description: translate({
      id: 'features.research-system.description',
      message:
        'Players bring Research Scrolls to a Research Pedestal and spend time researching the next era. Four pedestal tiers, placeable boosters, and a dependency system covering XP, kills, stats, and more.',
    }),
    to: '/wiki/in-game-tools/research/pedestal',
  },
  {
    title: translate({id: 'features.in-game-editor.title', message: 'In-Game Editor'}),
    image: 'in-game-editor.webp',
    description: translate({
      id: 'features.in-game-editor.description',
      message:
        'Build your entire stage setup without touching a config file — folders, drag-to-organize, per-player unlocks, and a live-preview tooltip designer, all from the pause menu.',
    }),
    to: '/wiki/in-game-tools/in-game-editor',
  },
  {
    title: translate({id: 'features.stage-graph.title', message: 'Stage Graph'}),
    image: 'stage-graph.webp',
    description: translate({
      id: 'features.stage-graph.description',
      message:
        'A progression map players open from the pause menu: nodes for stages, edges for dependencies, colour-coded Unlocked, Reachable, and Locked. Off by default — how much structure to reveal is your call.',
    }),
    to: '/wiki/in-game-tools/stage-graph',
  },
  {
    title: translate({id: 'features.the-research-record.title', message: 'The Research Record'}),
    image: 'open-scroll.webp',
    description: translate({
      id: 'features.the-research-record.description',
      message:
        'An opened scroll is a real, readable document with chapters for items, creatures, and world. Lay it on a lectern and anyone can read it — obscured mode turns locked entries into silhouettes.',
    }),
    to: '/wiki/in-game-tools/research/scrolls#the-open-scroll-document',
  },
];

// One row per feature, picture and text side by side and alternating, rather than a grid of
// cards: four boxes in a row read like a template, and the screenshots get room to be seen.
// The addon platform has its own column under "Where do you want to start?".
function Feature({title, image, description, to}) {
  const imageUrl = useBaseUrl(`/img/screenshots/${image}`);
  return (
    <div className={styles.row}>
      <Link to={to} className={styles.media}>
        <img src={imageUrl} alt="" loading="lazy" />
      </Link>
      <div className={styles.text}>
        <Heading as="h3" className={styles.title}>
          {title}
        </Heading>
        <p className={styles.description}>{description}</p>
        <Link to={to} className={styles.more}>
          {translate({id: 'features.learnMore', message: 'Learn more →'})}
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
