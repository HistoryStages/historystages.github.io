import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './download.module.css';

// One page that names every official source, instead of a button that drops the reader on
// whichever store happened to be first. The exact patch version is left to the stores: written
// down here it would go stale with the next release.
const SOURCES = [
  {
    id: 'modrinth',
    name: 'Modrinth',
    href: 'https://modrinth.com/mod/history-stages',
    text: translate({
      id: 'download.modrinth.text',
      message: 'Every loader and version, with changelogs. Works with the Modrinth App and most launchers.',
    }),
  },
  {
    id: 'curseforge',
    name: 'CurseForge',
    href: 'https://www.curseforge.com/minecraft/mc-mods/history-stages',
    text: translate({
      id: 'download.curseforge.text',
      message: 'The same files, for the CurseForge App and packs built on CurseForge.',
    }),
  },
  {
    id: 'github',
    name: 'GitHub Releases',
    href: 'https://github.com/Flix100000/History-Stages/releases',
    text: translate({
      id: 'download.github.text',
      message: 'Every release with its full notes, including older builds.',
    }),
  },
];

const LOOTR = <a href="https://modrinth.com/mod/lootr">Lootr</a>;
const FABRIC_API = <a href="https://modrinth.com/mod/fabric-api">Fabric API</a>;
const ARCHITECTURY = <a href="https://modrinth.com/mod/architectury-api">Architectury API</a>;

const LOADERS = [
  {loader: 'NeoForge', mc: '1.21.1', line: '6.2.x', needs: [LOOTR]},
  {loader: 'Forge', mc: '1.20.1', line: '6.2.x', needs: [LOOTR]},
  {loader: 'Fabric', mc: '1.21.1', line: '6.2.x', needs: [LOOTR, FABRIC_API]},
  {
    loader: 'NeoForge / Fabric',
    mc: '26.2',
    line: '6.2.x',
    beta: true,
    needs: [LOOTR, ARCHITECTURY, <>{FABRIC_API} (Fabric)</>],
  },
];

function Source({id, name, href, text}) {
  return (
    <a className={clsx(styles.source, styles[id])} href={href} target="_blank" rel="noopener noreferrer">
      <span className={styles.sourceName}>{name}</span>
      <span className={styles.sourceText}>{text}</span>
      <span className={styles.sourceCta}>
        <Translate id="download.open">Open download page ↗</Translate>
      </span>
    </a>
  );
}

export default function Download() {
  return (
    <Layout
      title={translate({id: 'download.title', message: 'Download'})}
      description={translate({
        id: 'download.description',
        message: 'The official places to download History Stages, which file you need, and what to install with it.',
      })}>
      <main className={styles.page}>
        <div className="container">
          <Heading as="h1" className={styles.title}>
            <Translate id="download.heading">Download History Stages</Translate>
          </Heading>
          <p className={styles.lead}>
            <Translate id="download.lead">
              These three pages are the only official sources. They carry the same files; pick the one
              your launcher works with.
            </Translate>
          </p>

          <div className={styles.sources}>
            {SOURCES.map((s) => (
              <Source key={s.id} {...s} />
            ))}
          </div>

          <Heading as="h2" className={styles.h2}>
            <Translate id="download.which.heading">Which file do I need?</Translate>
          </Heading>
          <p>
            <Translate id="download.which.text">
              Pick the file for your mod loader and Minecraft version. Every loader is on the same line,
              so this wiki applies to all of them.
            </Translate>
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th><Translate id="download.col.loader">Loader</Translate></th>
                <th>Minecraft</th>
                <th><Translate id="download.col.line">Version line</Translate></th>
                <th><Translate id="download.col.needs">Also install</Translate></th>
              </tr>
            </thead>
            <tbody>
              {LOADERS.map((l) => (
                <tr key={l.loader + l.mc}>
                  <td>
                    <b>{l.loader}</b>
                    {l.beta && (
                      <span className={styles.beta}>
                        <Translate id="download.beta">beta</Translate>
                      </span>
                    )}
                  </td>
                  <td>{l.mc}</td>
                  <td>{l.line}</td>
                  <td>
                    {l.needs.map((n, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {n}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.note}>
            <Translate id="download.lootr">
              Lootr is required on every loader: it gives each player their own view of a loot chest,
              which is what lets loot be filtered per player.
            </Translate>{' '}
            <Translate id="download.old">The 1.19.X builds are no longer updated.</Translate>
          </p>

          <Heading as="h2" className={styles.h2}>
            <Translate id="download.next.heading">Next steps</Translate>
          </Heading>
          <div className={styles.next}>
            <Link to="/wiki/start-here/installation">
              <span><Translate id="download.next.single">Singleplayer or your own pack</Translate></span>
              <Translate id="download.next.installation">Installation &amp; Your First Stage →</Translate>
            </Link>
            <Link to="/wiki/start-here/server-setup">
              <span><Translate id="download.next.server">On a server</Translate></span>
              <Translate id="download.next.serversetup">Putting It on a Server →</Translate>
            </Link>
            <Link to="/wiki/about/versions-and-platforms">
              <span><Translate id="download.next.diff">Loader differences</Translate></span>
              <Translate id="download.next.versions">Versions &amp; Platforms →</Translate>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
