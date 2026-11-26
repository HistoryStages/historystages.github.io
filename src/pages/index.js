import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import HomepageHero from '@site/src/components/HomepageHero';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePaths from '@site/src/components/HomepagePaths';
import HomepageTrailer from '@site/src/components/HomepageTrailer';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    // No title prop on purpose: the front page is called what the site is called. Both
    // this and the description were still the template's placeholders, which is what a
    // link preview in Discord was showing.
    <Layout
      wrapperClassName="homepage-scene"
      description={translate(
        {
          id: 'homepage.description',
          message: '{tagline}. Stages, locks, research and the in-game editor, for every version.',
        },
        {tagline: translate({id: 'homepage.tagline', message: siteConfig.tagline})},
      )}>
      <HomepageHero />
      <main>
        {/* The popular-pages list still serves the 404 page; on the front page the paths by
            reader replace it, since both were columns of the same few links. */}
        <HomepagePaths />
        <HomepageFeatures />
        <HomepageTrailer />
      </main>
    </Layout>
  );
}
