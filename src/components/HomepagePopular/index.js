import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {translate} from '@docusaurus/Translate';
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
    section: translate({id: 'popular.section.start-here', message: 'Start here'}),
    pages: [
      {title: translate({id: 'popular.page.wiki.start-here.installation', message: 'Installation & Your First Stage'}), to: '/wiki/start-here/installation'},
      {title: translate({id: 'popular.page.wiki.start-here.global-vs-individual', message: 'Global vs Individual Stages'}), to: '/wiki/start-here/global-vs-individual'},
      {title: translate({id: 'popular.page.wiki.start-here.where-stage-files-live', message: 'Where Stage Files Live'}), to: '/wiki/start-here/where-stage-files-live'},
    ],
  },
  {
    section: translate({id: 'popular.section.locking', message: 'Locking'}),
    pages: [
      {title: translate({id: 'popular.page.wiki.locking.items-and-recipes.recipes', message: 'Recipes'}), to: '/wiki/locking/items-and-recipes/recipes'},
      {title: translate({id: 'popular.page.wiki.locking.items-and-recipes.items-tags-mods', message: 'Items, Tags & Mods'}), to: '/wiki/locking/items-and-recipes/items-tags-mods'},
    ],
  },
  {
    section: translate({id: 'popular.section.server', message: 'Server'}),
    pages: [
      {title: translate({id: 'popular.page.wiki.server.config-files', message: 'Config Files'}), to: '/wiki/server/config-files'},
      {title: translate({id: 'popular.page.wiki.server.commands', message: 'Commands & Permissions'}), to: '/wiki/server/commands'},
      {title: translate({id: 'popular.page.wiki.server.mod-compatibility', message: 'Mod Compatibility'}), to: '/wiki/server/mod-compatibility'},
    ],
  },
  {
    section: translate({id: 'popular.section.api', message: 'API'}),
    pages: [
      {title: translate({id: 'popular.page.api.addon-development', message: 'Addon Development'}), to: '/api/addon-development'},
      {title: translate({id: 'popular.page.api', message: 'API Overview'}), to: '/api/'},
    ],
  },
];

// The 404 page shows the same list under its own wording, which is why the copy is a prop:
// a dead end needs to say "try one of these", the front page does not. There it is also the
// last thing before the footer, where the front page has the feature cards to follow —
// hence `last`, which pays for the bottom margin the cards otherwise bring.
export default function HomepagePopular({
  title = translate({id: 'popular.title', message: 'Popular pages'}),
  subtitle = translate({id: 'popular.subtitle', message: 'Where most readers go first.'}),
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
