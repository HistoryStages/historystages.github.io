import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import HomepagePopular from '@site/src/components/HomepagePopular';

// Taken over from the theme rather than wrapped, because the wording had to go: the stock
// page ends on "contact the owner of the site that linked you and let them know their link
// is broken", and here that owner is us — most dead addresses are pages the move to
// Docusaurus renamed. Sending the reader off to complain elsewhere is the one thing that
// cannot help them. GoatCounter shows 404s at a rate the site's traffic cannot explain away,
// so this page is worth more than a shrug.
export default function NotFoundContent({className}) {
  return (
    <>
      <main className={clsx('container margin-vert--xl', className)}>
        <div className="row">
          <div className="col col--6 col--offset-3">
            <Heading as="h1" className="hero__title">
              Page Not Found
            </Heading>
            <p>
              There is nothing at this address. It was most likely renamed when this wiki
              moved, or it belongs to an older version of the documentation.
            </p>
            <p>
              The search at the top of the page covers every version and is the fastest way
              back. If it turns up nothing, say so on{' '}
              <Link to="https://discord.gg/BeZzxyZ9c4">Discord</Link> — a dead link here is
              ours to fix, and worth hearing about.
            </p>
          </div>
        </div>
      </main>
      <HomepagePopular
        title="Try one of these instead"
        subtitle="The pages most readers are after."
      />
    </>
  );
}
