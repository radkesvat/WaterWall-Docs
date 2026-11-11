import { useState, type ReactElement } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import Heading from "@theme/Heading";

import styles from "./styles.module.css";

type Copy = { id: string; message: string };
type RouteExample = {
  id: string;
  title: Copy;
  summary: Copy;
  detail: Copy;
  guide: string;
  chains: { label: Copy; nodes: string[] }[];
};

const routes: RouteExample[] = [
  {
    id: "forward",
    title: {
      id: "homepage.explorer.forward.title",
      message: "Forward a TCP port",
    },
    summary: {
      id: "homepage.explorer.forward.summary",
      message: "Two nodes. One direct connection.",
    },
    detail: {
      id: "homepage.explorer.forward.detail",
      message:
        "Accept a connection and send it to a configured service. Start with a listener and a connector, then add the layers your path needs.",
    },
    guide: "/docs/intro",
    chains: [
      {
        label: {
          id: "homepage.explorer.instance",
          message: "WaterWall instance",
        },
        nodes: ["TcpListener", "TcpConnector"],
      },
    ],
  },
  {
    id: "proxy",
    title: {
      id: "homepage.explorer.proxy.title",
      message: "Run a SOCKS5 proxy",
    },
    summary: {
      id: "homepage.explorer.proxy.summary",
      message: "A local entry point for TCP and UDP.",
    },
    detail: {
      id: "homepage.explorer.proxy.detail",
      message:
        "Let applications choose their destination through SOCKS5. The complete example enables UDP and configures the listener and connector together.",
    },
    guide: "/docs/examples/proxies/local-proxies",
    chains: [
      {
        label: {
          id: "homepage.explorer.instance",
          message: "WaterWall instance",
        },
        nodes: ["TcpUdpListener", "Socks5Server", "TcpUdpConnector"],
      },
    ],
  },
  {
    id: "quic",
    title: {
      id: "homepage.explorer.quic.title",
      message: "Carry TCP over QUIC",
    },
    summary: {
      id: "homepage.explorer.quic.summary",
      message: "A reliable, encrypted path between peers.",
    },
    detail: {
      id: "homepage.explorer.quic.detail",
      message:
        "Carry a TCP service over QUIC with TLS 1.3. Configure both peers with matching settings and a server certificate trusted by the client.",
    },
    guide: "/docs/examples/tunnels/direct-quic",
    chains: [
      {
        label: { id: "homepage.explorer.client", message: "Client" },
        nodes: ["TcpListener", "QuicClient", "UdpConnector"],
      },
      {
        label: { id: "homepage.explorer.server", message: "Server" },
        nodes: ["UdpListener", "QuicServer", "TcpConnector"],
      },
    ],
  },
];

const families = [
  {
    icon: "transport",
    number: "01",
    title: { id: "homepage.toolbox.transport.title", message: "Carry traffic" },
    description: {
      id: "homepage.toolbox.transport.description",
      message:
        "Choose how your peers connect, from plain sockets to layered transports.",
    },
    nodes: ["TcpConnector", "QuicClient", "KcpClient", "HttpClient"],
  },
  {
    icon: "shield",
    number: "02",
    title: {
      id: "homepage.toolbox.security.title",
      message: "Protect the connection",
    },
    description: {
      id: "homepage.toolbox.security.description",
      message:
        "Add encryption and authentication with nodes suited to your protocol.",
    },
    nodes: ["TlsClient", "RealityClient", "EncryptionClient"],
  },
  {
    icon: "route",
    number: "03",
    title: {
      id: "homepage.toolbox.routing.title",
      message: "Give traffic a direction",
    },
    description: {
      id: "homepage.toolbox.routing.description",
      message:
        "Select routes by rules, inspect protocol metadata, and connect branches.",
    },
    nodes: ["Router", "SniffRouter", "Bridge"],
  },
  {
    icon: "packet",
    number: "04",
    title: {
      id: "homepage.toolbox.packet.title",
      message: "Work with IP packets",
    },
    description: {
      id: "homepage.toolbox.packet.description",
      message:
        "Connect TUN interfaces, use WireGuard, or bridge packets into connection flows.",
    },
    nodes: ["TunDevice", "WireGuardDevice", "PacketsToConnection"],
  },
  {
    icon: "layers",
    number: "05",
    title: { id: "homepage.toolbox.control.title", message: "Manage the path" },
    description: {
      id: "homepage.toolbox.control.description",
      message:
        "Share transports, build reverse connections, and manage users through an API.",
    },
    nodes: ["MuxClient", "ReverseClient", "APIServer"],
  },
  {
    icon: "pulse",
    number: "06",
    title: {
      id: "homepage.toolbox.testing.title",
      message: "See how it behaves",
    },
    description: {
      id: "homepage.toolbox.testing.description",
      message:
        "Inspect payloads, test integrity, measure throughput, and simulate faults.",
    },
    nodes: ["LoggerTunnel", "TesterClient", "SpeedTestClient", "Disturber"],
  },
];

function Icon({ kind }: { kind: string }): ReactElement {
  const paths: Record<string, ReactElement> = {
    transport: (
      <>
        <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    route: (
      <>
        <path d="M5 12h7m0 0V5h7m-7 7v7h7" />
        <circle cx="4" cy="12" r="2" />
        <circle cx="20" cy="5" r="2" />
        <circle cx="20" cy="19" r="2" />
      </>
    ),
    packet: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    layers: (
      <>
        <path d="M3 5h5l4 7 4-7h5M3 19h5l4-7 4 7h5M3 12h18" />
      </>
    ),
    pulse: (
      <>
        <path d="M2 12h5l3-8 4 16 3-8h5" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  );
}

function Arrow(): ReactElement {
  return (
    <span className={styles.linkArrow} aria-hidden="true">
      ↗
    </span>
  );
}

function RouteExplorer(): ReactElement {
  const [selected, setSelected] = useState(0);
  const route = routes[selected];

  return (
    <section className={styles.section} aria-labelledby="explorer-title">
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>
            <Translate id="homepage.explorer.kicker">
              Explore the possibilities
            </Translate>
          </span>
          <Heading as="h2" id="explorer-title" className={styles.sectionTitle}>
            <Translate id="homepage.explorer.title">
              Start simple. Build the path you need.
            </Translate>
          </Heading>
          <p className={styles.lead}>
            <Translate id="homepage.explorer.lead">
              Each node does one job. Connect them in JSON to turn a small
              configuration into a working network path.
            </Translate>
          </p>
        </div>
        <div className={styles.explorer}>
          <div
            className={styles.routeChoices}
            role="group"
            aria-label={translate({
              id: "homepage.explorer.choose",
              message: "Choose a chain example",
            })}
          >
            {routes.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={clsx(
                  styles.routeChoice,
                  selected === index && styles.routeChoiceActive,
                )}
                aria-pressed={selected === index}
                aria-controls="route-preview"
                onClick={() => setSelected(index)}
              >
                <span className={styles.choiceNumber} aria-hidden="true">
                  0{index + 1}
                </span>
                <span>
                  <strong>{translate(item.title)}</strong>
                  <span className={styles.choiceSummary}>
                    {translate(item.summary)}
                  </span>
                </span>
                <span className={styles.choiceArrow} aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
          <div
            id="route-preview"
            className={styles.routePreview}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className={styles.previewTop}>
              <span className={styles.previewDot} />
              <span>
                <Translate id="homepage.explorer.preview">
                  Chain preview
                </Translate>
              </span>
              <span className={styles.previewFormat}>JSON</span>
            </div>
            <div className={styles.diagram}>
              {route.chains.map((chain, index) => (
                <div className={styles.chainGroup} key={chain.label.id}>
                  {index > 0 && (
                    <div className={styles.carrier}>
                      <span aria-hidden="true">↓</span>{" "}
                      <Translate id="homepage.explorer.carrier">
                        QUIC over UDP
                      </Translate>
                    </div>
                  )}
                  <span className={styles.chainLabel}>
                    {translate(chain.label)}
                  </span>
                  <ol className={styles.chain} dir="ltr">
                    {chain.nodes.map((node, nodeIndex) => (
                      <li key={node}>
                        <Link
                          to={`/docs/noderefs/${node}`}
                          className={styles.node}
                        >
                          <span className={styles.nodeDot} />
                          {node}
                        </Link>
                        {nodeIndex < chain.nodes.length - 1 && (
                          <span className={styles.nodeArrow} aria-hidden="true" />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className={styles.previewDescription}>
              <p>{translate(route.detail)}</p>
              <Link to={route.guide} className={styles.textLink}>
                <Translate id="homepage.explorer.guide">
                  See the complete configuration
                </Translate>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
        <p className={styles.explorerNote}>
          <Translate id="homepage.explorer.note">
            Select a node to explore its settings. Arrows show the outgoing
            path; replies travel back through the chain.
          </Translate>
        </p>
        <div className={styles.platformStrip}>
          <span className={styles.platformLabel}>
            <Translate id="homepage.platforms.label">Build targets</Translate>
          </span>
          <div className={styles.platforms} dir="ltr">
            {["Linux", "Windows", "macOS", "Android", "iOS"].map((platform) => (
              <span key={platform}>{platform}</span>
            ))}
          </div>
          <Link
            to="/docs/devguides/part6-build-test-review"
            className={styles.textLink}
          >
            <Translate id="homepage.platforms.guide">
              Build from source
            </Translate>
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Toolbox(): ReactElement {
  return (
    <section
      className={clsx(styles.section, styles.toolboxSection)}
      aria-labelledby="toolbox-title"
    >
      <div className="container">
        <div className={styles.splitHeading}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>
              <Translate id="homepage.toolbox.kicker">
                Inside the toolbox
              </Translate>
            </span>
            <Heading as="h2" id="toolbox-title" className={styles.sectionTitle}>
              <Translate id="homepage.toolbox.title">
                The pieces for your next connection.
              </Translate>
            </Heading>
            <p className={styles.lead}>
              <Translate id="homepage.toolbox.lead">
                Explore the node families, then choose compatible layers for the
                traffic you want to carry.
              </Translate>
            </p>
          </div>
          <Link to="/docs/noderefs/all-nodes" className={styles.textLink}>
            <Translate id="homepage.toolbox.all">
              Browse all 80+ nodes
            </Translate>
            <Arrow />
          </Link>
        </div>
        <div className={styles.toolboxGrid}>
          {families.map((family) => (
            <article key={family.number} className={styles.toolboxCard}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>
                  <Icon kind={family.icon} />
                </span>
                <span className={styles.cardNumber} aria-hidden="true">
                  {family.number}
                </span>
              </div>
              <Heading as="h3" className={styles.cardTitle}>
                {translate(family.title)}
              </Heading>
              <p className={styles.cardDescription}>
                {translate(family.description)}
              </p>
              <div className={styles.nodeLinks}>
                {family.nodes.map((node) => (
                  <Link key={node} to={`/docs/noderefs/${node}`} dir="ltr">
                    {node}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
        <Link
          className={styles.layerGuide}
          to="/docs/getting-started/tutorial-part4"
        >
          <span>
            <Translate id="homepage.toolbox.layerGuide">
              Not sure which nodes fit together? Start with the node selection
              guide.
            </Translate>
          </span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

function ProjectShowcase(): ReactElement {
  return (
    <section className={styles.section} aria-labelledby="community-title">
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>
            <Translate id="homepage.community.kicker">
              Built with WaterWall
            </Translate>
          </span>
          <Heading as="h2" id="community-title" className={styles.sectionTitle}>
            <Translate id="homepage.community.title">
              From core to client.
            </Translate>
          </Heading>
          <p className={styles.lead}>
            <Translate id="homepage.community.lead">
              Meet the clients, panels, and tools bringing WaterWall into
              everyday use.
            </Translate>
          </p>
        </div>
        <article className={styles.projectCard}>
          <div className={styles.projectVisual} aria-hidden="true">
            <div className={styles.projectOrbit} />
            <div className={styles.projectMark}>
              <span>SRP</span>
              <small>VPN CONNECT</small>
            </div>
            <div className={styles.projectPlatforms} dir="ltr">
              <span>Android</span>
              <span>iOS</span>
            </div>
          </div>
          <div className={styles.projectContent}>
            <span className={styles.projectStatus}>
              <span />
              <Translate id="homepage.community.status">
                Usable · Actively developed
              </Translate>
            </span>
            <Heading as="h3" className={styles.projectTitle}>
              SRP VPN Connect
            </Heading>
            <p className={styles.projectDescription}>
              <Translate id="homepage.community.description">
                A VPN client for Android and iOS with WaterWall support. Build
                and manage client-side chains from the app, with an iOS beta
                available through TestFlight.
              </Translate>
            </p>
            <div className={styles.projectActions}>
              <Link
                to="https://github.com/bigmoveus/SRP-VPN-Connect"
                className={styles.actionButton}
              >
                <Translate id="homepage.community.projectLink">
                  Explore the project
                </Translate>
                <Arrow />
              </Link>
              <Link
                to="https://testflight.apple.com/join/A1tAaYW4"
                className={styles.textLink}
              >
                <Translate id="homepage.community.testflight">
                  Try the iOS beta
                </Translate>
                <Arrow />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function GettingStarted(): ReactElement {
  const links = [
    {
      number: "01",
      to: "/docs/getting-started/installation",
      title: {
        id: "homepage.start.install.title",
        message: "Get up and running",
      },
      description: {
        id: "homepage.start.install.description",
        message: "Download WaterWall and run your first configuration.",
      },
    },
    {
      number: "02",
      to: "/docs/examples/tunnels/overview",
      title: {
        id: "homepage.start.examples.title",
        message: "Find a working example",
      },
      description: {
        id: "homepage.start.examples.description",
        message: "Start from a documented topology and adapt it to your setup.",
      },
    },
    {
      number: "03",
      to: "/docs/devguides/doc1",
      title: {
        id: "homepage.start.develop.title",
        message: "Build on the core",
      },
      description: {
        id: "homepage.start.develop.description",
        message: "Explore the architecture and learn how to develop a node.",
      },
    },
  ];
  return (
    <section
      className={clsx(styles.section, styles.startSection)}
      aria-labelledby="start-title"
    >
      <div className="container">
        <div className={styles.splitHeading}>
          <div>
            <span className={styles.kicker}>
              <Translate id="homepage.start.kicker">Your next step</Translate>
            </span>
            <Heading as="h2" id="start-title" className={styles.sectionTitle}>
              <Translate id="homepage.start.title">
                Make your first connection.
              </Translate>
            </Heading>
          </div>
          <Link
            to="https://github.com/radkesvat/WaterWall"
            className={styles.textLink}
          >
            <Translate id="homepage.start.source">Explore the source</Translate>
            <Arrow />
          </Link>
        </div>
        <div className={styles.startGrid}>
          {links.map((item) => (
            <Link key={item.number} to={item.to} className={styles.startCard}>
              <span className={styles.startNumber}>{item.number}</span>
              <Heading as="h3">{translate(item.title)}</Heading>
              <p>{translate(item.description)}</p>
              <Arrow />
            </Link>
          ))}
        </div>
        <div className={styles.colophon}>
          <span>
            <Translate id="homepage.start.footnote">
              A C core. JSON-defined paths. Open source under MPL 2.0.
            </Translate>
          </span>
          <Link to="https://radkesvat-support.vercel.app/">
            <Translate id="homepage.start.support">
              Support development
            </Translate>
            <span aria-hidden="true"> ♡</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomepageContent(): ReactElement {
  return (
    <main className={styles.main}>
      <RouteExplorer />
      <Toolbox />
      <ProjectShowcase />
      <GettingStarted />
    </main>
  );
}
