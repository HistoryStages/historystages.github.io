import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageHero from '@site/src/components/HomepageHero';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePopular from '@site/src/components/HomepagePopular';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    // No title prop on purpose: the front page is called what the site is called. Both
    // this and the description were still the template's placeholders, which is what a
    // link preview in Discord was showing.
    <Layout
      description={`${siteConfig.tagline}. Stages, locks, research and the in-game editor, for every version.`}>
      <HomepageHero />
      <main>
        <HomepagePopular />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
