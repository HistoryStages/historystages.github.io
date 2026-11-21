import Footer from '@theme-original/DocItem/Footer';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

// Wraps the stock doc footer (tags, edit link, last updated) with a line saying where to go
// when the page is the problem. The edit link above it only helps people who already think of
// themselves as contributors; most readers need to be told that asking is fine.
export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <div className={styles.pageHelp}>
        <Translate id="doc.help.question">Something wrong or missing here?</Translate>{' '}
        <Link to="https://discord.gg/BeZzxyZ9c4">
          <Translate id="doc.help.discord">Ask on Discord</Translate>
        </Link>{' '}
        ·{' '}
        <Link to="https://github.com/Flix100000/History-Stages/issues">
          <Translate id="doc.help.issue">Open an issue</Translate>
        </Link>
      </div>
    </>
  );
}
