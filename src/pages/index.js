import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import HomepageHero from '@site/src/components/HomepageHero';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePopular from '@site/src/components/HomepagePopular';
import HomepageTrailer from '@site/src/components/HomepageTrailer';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    // No title prop on purpose: the front page is called what the site is called. Both
    // this and the description were still the template's placeholders, which is what a
    // link preview in Discord was showing.
    <Layout
      description={translate(
        {
          id: 'homepage.description',
          message: '{tagline}. Stages, locks, research and the in-game editor, for every version.',
        },
        {tagline: translate({id: 'homepage.tagline', message: siteConfig.tagline})},
      )}>
      <HomepageHero />
      <main>
        <HomepagePopular />
        <HomepageTrailer />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
