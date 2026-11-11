import type { ReactElement, ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import HomepageContent from "@site/src/components/HomepageContent";

import styles from "./index.module.css";

function HeroStat({ value, label }: { value: string; label: ReactNode }): ReactElement {
  return (
    <div className={styles.heroStat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function HomepageHeader(): ReactElement {
  return (
    <header className={styles.hero}>
      <div className={styles.heroOverlay} />
      <div className={clsx("container", styles.heroInner)}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            {translate({
              id: "homepage.hero.eyebrow",
              message: "Chain-based tunneling framework",
            })}
          </span>
          <Heading as="h1" className={styles.heroTitle}>
            WaterWall
          </Heading>
          <p className={styles.heroLead}>
            {translate({
              id: "homepage.hero.lead",
              message:
                "Compose listeners, transport layers, packet transforms, and protocol adapters into reliable network paths.",
            })}
          </p>
          <div className={styles.heroActions}>
            <Link className={clsx("button button--lg", styles.primaryButton)} to="/docs/intro">
              {translate({
                id: "homepage.hero.primaryCta",
                message: "Read the docs",
              })}
            </Link>
            <Link
              className={clsx("button button--lg", styles.secondaryButton)}
              to="/docs/noderefs/all-nodes"
            >
              {translate({
                id: "homepage.hero.secondaryCta",
                message: "Explore nodes",
              })}
            </Link>
          </div>
        </div>
        <div className={styles.heroStats} aria-label="WaterWall highlights">
          <HeroStat
            value="80+"
            label={translate({
              id: "homepage.hero.stat.nodes",
              message: "documented nodes",
            })}
          />
          <HeroStat
            value="L3/L4"
            label={translate({
              id: "homepage.hero.stat.layers",
              message: "packet and stream paths",
            })}
          />
          <HeroStat
            value="JSON"
            label={translate({
              id: "homepage.hero.stat.config",
              message: "configuration-first",
            })}
          />
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactElement {
  const pageTitle = translate({
    id: "homepage.meta.title",
    message: "WaterWall | Modular tunneling documentation",
  });
  const pageDescription = translate({
    id: "homepage.meta.description",
    message:
      "WaterWall documentation for building modular, chain-based network tunnels with stream and packet nodes.",
  });

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <HomepageHeader />
      <HomepageContent />
    </Layout>
  );
}
