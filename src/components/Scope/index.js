import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

// The line at the top of a lock page that says which kind of stage it works in. The full
// matrix lives on Global vs Individual; this is the same answer where the question comes up,
// so nobody has to go looking for the table before they know the page applies to them.
//
// A plain sentence rather than badges: a row of pills under every title was one of the
// things that made the pages look generated.
//
// global / individual: "yes", "partly" or "no". note: what "partly" leaves out.
const MATRIX = '/wiki/start-here/global-vs-individual#what-can-each-one-lock';

function Sentence({global, individual}) {
  const g = <b>global</b>;
  const i = <b>individual</b>;
  if (individual === 'no') {
    return (
      <Translate id="scope.globalOnly" values={{global: g}}>
        {'Works in {global} stages only.'}
      </Translate>
    );
  }
  if (global === 'no') {
    return (
      <Translate id="scope.individualOnly" values={{individual: i}}>
        {'Works in {individual} stages only.'}
      </Translate>
    );
  }
  if (individual === 'partly') {
    return (
      <Translate id="scope.partly" values={{global: g, individual: i}}>
        {'Works in {global} stages, and partly in {individual} stages.'}
      </Translate>
    );
  }
  return (
    <Translate id="scope.both" values={{global: g, individual: i}}>
      {'Works in {global} and {individual} stages.'}
    </Translate>
  );
}

export default function Scope({global = 'yes', individual = 'yes', note}) {
  return (
    <p className={styles.scope}>
      <Link to={MATRIX} className={styles.sentence}>
        <Sentence global={global} individual={individual} />
      </Link>
      {note && <> {note}</>}
    </p>
  );
}
