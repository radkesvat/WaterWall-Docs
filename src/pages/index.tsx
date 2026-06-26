import type { ReactElement, ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

type LocalizedText = {
  id: string;
  message: string;
};

type Feature = {
  accent: string;
  title: LocalizedText;
  description: LocalizedText;
};

type DocsLink = {
  to: string;
  label: LocalizedText;
  description: LocalizedText;
};

const features: Feature[] = [
  {
    accent: "Chain",
    title: {
      id: "homepage.feature.chain.title",
      message: "Composable tunnel chains",
    },
    description: {
      id: "homepage.feature.chain.description",
      message:
        "Build network paths from small nodes: listeners, protocol transforms, encryption, multiplexing, packet bridges, and connectors.",
    },
  },
  {
    accent: "Runtime",
    title: {
      id: "homepage.feature.runtime.title",
      message: "High-throughput runtime",
    },
    description: {
      id: "homepage.feature.runtime.description",
      message:
        "WaterWall is designed around asynchronous I/O, worker threads, buffer pools, and low-copy packet movement.",
    },
  },
  {
    accent: "Packet",
    title: {
      id: "homepage.feature.packet.title",
      message: "Stream and packet workflows",
    },
    description: {
      id: "homepage.feature.packet.description",
      message:
        "Use ordinary TCP/UDP flows, raw packet pipelines, TUN devices, WireGuard edges, or bridge between models when a route needs it.",
    },
  },
];

const documentationLinks: DocsLink[] = [
  {
    to: "/docs/intro",
    label: {
      id: "homepage.docs.intro.title",
      message: "Project introduction",
    },
    description: {
      id: "homepage.docs.intro.description",
      message:
        "Understand the node model, tunnel composition, and the shape of a WaterWall configuration.",
    },
  },
  {
    to: "/docs/getting-started/tutorial-part1",
    label: {
      id: "homepage.docs.tutorial.title",
      message: "Getting started",
    },
    description: {
      id: "homepage.docs.tutorial.description",
      message:
        "Walk through the first working configuration and learn how the core JSON files fit together.",
    },
  },
  {
    to: "/docs/noderefs/all-nodes",
    label: {
      id: "homepage.docs.nodes.title",
      message: "Node reference",
    },
    description: {
      id: "homepage.docs.nodes.description",
      message:
        "Browse the available listeners, connectors, protocol nodes, packet nodes, and test utilities.",
    },
  },
];

const flowSteps = ["TcpListener", "MuxClient", "VlessClient", "TlsClient", "TcpConnector"];

function t(text: LocalizedText): string {
  return translate(text);
}

function FeatureCard({ accent, title, description }: Feature): ReactElement {
  return (
    <article className={styles.featureCard}>
      <span className={styles.featureAccent}>{accent}</span>
      <Heading as="h3" className={styles.cardTitle}>
        {t(title)}
      </Heading>
      <p className={styles.cardText}>{t(description)}</p>
    </article>
  );
}

function DocsCard({ to, label, description }: DocsLink): ReactElement {
  return (
    <Link className={styles.docsCard} to={to}>
      <span className={styles.docsCardLabel}>{t(label)}</span>
      <span className={styles.docsCardText}>{t(description)}</span>
    </Link>
  );
}

function HeroStat({ value, label }: { value: string; label: ReactNode }): ReactElement {
  return (
    <div className={styles.heroStat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ChainPreview(): ReactElement {
  return (
    <div className={styles.chainPreview}>
      <span className={styles.previewLabel}>
        {translate({
          id: "homepage.flow.chain.label",
          message: "Client tunnel chain",
        })}
      </span>
      <div className={styles.chainSteps}>
        {flowSteps.map((step, index) => (
          <span className={styles.chainStep} key={step}>
            {step}
            {index < flowSteps.length - 1 && <b>→</b>}
          </span>
        ))}
      </div>
    </div>
  );
}

function RouterPreview(): ReactElement {
  const routerImage = useBaseUrl("/img/router-node-preview.png");

  return (
    <div className={styles.routerPreview}>
      <img
        className={styles.routerImage}
        src={routerImage}
        alt={translate({
          id: "homepage.flow.router.imageAlt",
          message: "Router node branching traffic by rules",
        })}
        loading="lazy"
      />
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
            value="50+"
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
  const { siteConfig } = useDocusaurusContext();
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
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>
                {translate({
                  id: "homepage.features.kicker",
                  message: "Why it feels different",
                })}
              </span>
              <Heading as="h2" className={styles.sectionTitle}>
                {translate({
                  id: "homepage.features.title",
                  message: "A network toolkit built around composition.",
                })}
              </Heading>
              <p className={styles.sectionLead}>
                {translate({
                  id: "homepage.features.lead",
                  message:
                    "Instead of one fixed proxy shape, WaterWall lets each route describe the exact chain it needs.",
                })}
              </p>
            </div>
            <div className={styles.featureGrid}>
              {features.map((feature) => (
                <FeatureCard key={feature.title.id} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.flowSection)}>
          <div className="container">
            <div className={styles.flowLayout}>
              <div>
                <span className={styles.sectionKicker}>
                  {translate({
                    id: "homepage.flow.kicker",
                    message: "The mental model",
                  })}
                </span>
                <Heading as="h2" className={styles.sectionTitle}>
                  {translate({
                    id: "homepage.flow.title",
                    message: "Describe the path, then let each node do one job.",
                  })}
                </Heading>
                <p className={styles.sectionLead}>
                  {translate({
                    id: "homepage.flow.lead",
                    message:
                      "A route can stay linear, or hand traffic to Router so rules choose different branches by domain, protocol, identity, port, or source.",
                  })}
                </p>
              </div>
              <div className={styles.flowPreview} aria-label={`${siteConfig.title} route examples`}>
                <ChainPreview />
                <RouterPreview />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>
                {translate({
                  id: "homepage.docs.kicker",
                  message: "Documentation",
                })}
              </span>
              <Heading as="h2" className={styles.sectionTitle}>
                {translate({
                  id: "homepage.docs.title",
                  message: "Start from the shape you need to build.",
                })}
              </Heading>
            </div>
            <div className={styles.docsGrid}>
              {documentationLinks.map((item) => (
                <DocsCard key={item.to} {...item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
