import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

// The line at the top of a lock page that says which kind of stage it works in. The full
// matrix lives on Global vs Individual; this is the same answer where the question comes up,
// so nobody has to go looking for the table before they know the page applies to them.
//
// global / individual: "yes", "partly" or "no". note: what "partly" leaves out.
const STATE = {
  yes: {mark: '✓', className: styles.yes},
  partly: {mark: '◐', className: styles.partly},
  no: {mark: '✕', className: styles.no},
};

function Badge({label, state}) {
  const s = STATE[state] ?? STATE.yes;
  return (
    <span className={clsx(styles.badge, s.className)}>
      <span aria-hidden="true">{s.mark}</span> {label}
    </span>
  );
}

export default function Scope({global = 'yes', individual = 'yes', note}) {
  return (
    <div className={styles.scope}>
      <Link
        to="/wiki/start-here/global-vs-individual#what-can-each-one-lock"
        className={styles.label}>
        {translate({id: 'scope.worksIn', message: 'Works in'})}
      </Link>
      <Badge label={translate({id: 'scope.global', message: 'Global stages'})} state={global} />
      <Badge
        label={translate({id: 'scope.individual', message: 'Individual stages'})}
        state={individual}
      />
      {note && <span className={styles.note}>{note}</span>}
    </div>
  );
}
