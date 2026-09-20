import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Chosen from what GoatCounter actually recorded, not from what we would like people to
// read: installation, global vs individual, the config files and the API pages are the
// ones visitors keep landing on. The traffic splits into setting-up and building-against,
// so the list carries both paths — plus the pages each of those questions leads to next.
const PopularPages = [
  {
    section: 'Start here',
    title: 'Installation & Your First Stage',
    to: '/wiki/start-here/installation',
  },
  {
    section: 'Start here',
    title: 'Global vs Individual Stages',
    to: '/wiki/start-here/global-vs-individual',
  },
  {
    section: 'Start here',
    title: 'Where Stage Files Live',
    to: '/wiki/start-here/where-stage-files-live',
  },
  {
    section: 'Locking',
    title: 'Recipes',
    to: '/wiki/locking/items-and-recipes/recipes',
  },
  {
    section: 'Server',
    title: 'Config Files',
    to: '/wiki/server/config-files',
  },
  {
    section: 'Server',
    title: 'Commands & Permissions',
    to: '/wiki/server/commands',
  },
  {
    section: 'Server',
    title: 'Mod Compatibility',
    to: '/wiki/server/mod-compatibility',
  },
  {
    section: 'API',
    title: 'Addon Development',
    to: '/api/addon-development',
  },
];

// The 404 page shows the same list under its own wording, which is why the copy is a prop:
// a dead end needs to say "try one of these", the front page does not.
export default function HomepagePopular({
  title = 'Popular pages',
  subtitle = 'Where most readers go first — setting a pack up, and building against it.',
}) {
  return (
    <section className={styles.popular}>
      <div className="container">
        <Heading as="h2" className={styles.heading}>
          {title}
        </Heading>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.list}>
          {PopularPages.map((page) => (
            <Link key={page.to} to={page.to} className={styles.item}>
              <span className={styles.itemText}>
                <span className={styles.itemSection}>{page.section}</span>
                <span className={styles.itemTitle}>{page.title}</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
