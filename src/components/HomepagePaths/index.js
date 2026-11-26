import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

// One way in per kind of reader. The wiki is ordered by topic, which only helps someone who
// already knows the topics; a reader who arrives knowing only what they are trying to do picks
// the column that sounds like them and gets the three pages that matter for it.
const Paths = [
  {
    id: 'pack',
    title: translate({id: 'paths.pack.title', message: 'I am building a modpack'}),
    text: translate({
      id: 'paths.pack.text',
      message: 'Stages, what they lock, and the editor you build them in.',
    }),
    pages: [
      {title: translate({id: 'paths.pack.installation', message: 'Installation & Your First Stage'}), to: '/wiki/start-here/installation'},
      {title: translate({id: 'paths.pack.global-vs-individual', message: 'Global vs Individual Stages'}), to: '/wiki/start-here/global-vs-individual'},
      {title: translate({id: 'paths.pack.locking', message: 'What You Can Lock'}), to: '/wiki/locking'},
      {title: translate({id: 'paths.pack.editor', message: 'In-Game Editor'}), to: '/wiki/in-game-tools/in-game-editor'},
    ],
  },
  {
    id: 'server',
    title: translate({id: 'paths.server.title', message: 'I run a server'}),
    text: translate({
      id: 'paths.server.text',
      message: 'Getting it onto a server, the commands, and the settings files.',
    }),
    pages: [
      {title: translate({id: 'paths.server.setup', message: 'Putting It on a Server'}), to: '/wiki/start-here/server-setup'},
      {title: translate({id: 'paths.server.commands', message: 'Commands & Permissions'}), to: '/wiki/server/commands'},
      {title: translate({id: 'paths.server.config', message: 'Config Files'}), to: '/wiki/server/config-files'},
      {title: translate({id: 'paths.server.troubleshooting', message: 'Troubleshooting'}), to: '/wiki/start-here/troubleshooting'},
    ],
  },
  {
    id: 'player',
    title: translate({id: 'paths.player.title', message: 'I play a pack that uses it'}),
    text: translate({
      id: 'paths.player.text',
      message: 'How stages are researched, and the map of what comes next.',
    }),
    pages: [
      {title: translate({id: 'paths.player.pedestal', message: 'Research Pedestal'}), to: '/wiki/in-game-tools/research/pedestal'},
      {title: translate({id: 'paths.player.scrolls', message: 'Research Scrolls'}), to: '/wiki/in-game-tools/research/scrolls'},
      {title: translate({id: 'paths.player.graph', message: 'Stage Graph'}), to: '/wiki/in-game-tools/stage-graph'},
    ],
  },
  {
    id: 'addon',
    title: translate({id: 'paths.addon.title', message: 'I write scripts or an addon'}),
    text: translate({
      id: 'paths.addon.text',
      message: 'Reading and changing stages from KubeJS, CraftTweaker or another mod.',
    }),
    pages: [
      {title: translate({id: 'paths.addon.scripting', message: 'Scripting'}), to: '/wiki/server/scripting'},
      {title: translate({id: 'paths.addon.compat', message: 'Mod Compatibility'}), to: '/wiki/server/mod-compatibility'},
      {title: translate({id: 'paths.addon.api', message: 'Addon Development'}), to: '/api/addon-development'},
    ],
  },
];

export default function HomepagePaths() {
  return (
    <section className={styles.paths}>
      <div className="container">
        <Heading as="h2" className={styles.heading}>
          {translate({id: 'paths.heading', message: 'Where do you want to start?'})}
        </Heading>
        <div className={styles.grid}>
          {Paths.map((path) => (
            <div key={path.id} className={styles.path}>
              <h3 className={styles.pathTitle}>{path.title}</h3>
              <p className={styles.pathText}>{path.text}</p>
              <ul className={styles.links}>
                {path.pages.map((page) => (
                  <li key={page.to}>
                    <Link to={page.to} className={styles.link}>
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
