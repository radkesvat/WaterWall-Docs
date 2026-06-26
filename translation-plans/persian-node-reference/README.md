# Persian Node Reference Translation Plans

These files are work orders for translating the completed English WaterWall node reference into Persian.

Each `plan_XX_*.md` file is standalone. If a user says `please read and do plan_07_packet_discovery_and_icmp.md`, the agent should have enough context inside that one file to perform the requested translation safely.

General intent:

- Source of truth: English docs in `WaterWall/WaterWall-Docs/docs/02-noderefs/`.
- Target locale: Persian docs in `WaterWall/WaterWall-Docs/i18n/fa/docusaurus-plugin-content-docs/current/02-noderefs/`.
- Replace existing Persian pages when they exist.
- Create missing Persian pages when they do not exist.
- Keep node filenames and node names in the exact current WaterWall convention, such as `TcpListener.mdx`, `PacketsToStream.mdx`, and `AuthenticationClient.mdx`.
- Do not resurrect old aliases such as `packet-as-data`, `data-as-packet`, `PacketAsData`, or `DataAsPacket`, except where the English source explicitly mentions them as legacy names.

Recommended execution order is numeric, but plans are independent enough to be run separately.

