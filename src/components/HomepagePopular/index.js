import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Chosen from what GoatCounter actually recorded, not from what we would like people to
// read: installation, global vs individual, the config files and the API pages are the ones
// visitors keep landing on. The traffic splits into setting-up and building-against, so both
// paths are here — plus the pages each of those questions leads to next.
//
// Plain text links in columns, deliberately not cards. Boxed rows sat directly above the
// feature grid and read as more of the same grid, which cost the cards their job; nothing
// about a column of links can be mistaken for a screenshot card.
const PopularGroups = [
  {
    section: 'Start here',
    pages: [
      {title: 'Installation & Your First Stage', to: '/wiki/start-here/installation'},
      {title: 'Global vs Individual Stages', to: '/wiki/start-here/global-vs-individual'},
      {title: 'Where Stage Files Live', to: '/wiki/start-here/where-stage-files-live'},
    ],
  },
  {
    section: 'Locking',
    pages: [
      {title: 'Recipes', to: '/wiki/locking/items-and-recipes/recipes'},
      {title: 'Items, Tags & Mods', to: '/wiki/locking/items-and-recipes/items-tags-mods'},
    ],
  },
  {
    section: 'Server',
    pages: [
      {title: 'Config Files', to: '/wiki/server/config-files'},
      {title: 'Commands & Permissions', to: '/wiki/server/commands'},
      {title: 'Mod Compatibility', to: '/wiki/server/mod-compatibility'},
    ],
  },
  {
    section: 'API',
    pages: [
      {title: 'Addon Development', to: '/api/addon-development'},
      {title: 'API Overview', to: '/api/'},
    ],
  },
];

// The 404 page shows the same list under its own wording, which is why the copy is a prop:
// a dead end needs to say "try one of these", the front page does not. There it is also the
// last thing before the footer, where the front page has the feature cards to follow —
// hence `last`, which pays for the bottom margin the cards otherwise bring.
export default function HomepagePopular({
  title = 'Popular pages',
  subtitle = 'Where most readers go first.',
  last = false,
}) {
  return (
    <section className={clsx(styles.popular, last && styles.popularLast)}>
      <div className="container">
        <div className={styles.block}>
          <div className={styles.header}>
            <Heading as="h2" className={styles.heading}>
              {title}
            </Heading>
            <span className={styles.subtitle}>{subtitle}</span>
          </div>
          <div className={styles.columns}>
            {PopularGroups.map((group) => (
              <div key={group.section} className={styles.column}>
                <h3 className={styles.columnTitle}>{group.section}</h3>
                {group.pages.map((page) => (
                  <Link key={page.to} to={page.to} className={styles.pageLink}>
                    {page.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
