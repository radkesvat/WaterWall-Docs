import React, {useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocsAssistant from '@site/src/components/DocsAssistant';
import styles from '@site/src/components/DocsAssistant/styles.module.css';

export default function Root({children}: {children: ReactNode}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const endpoint = siteConfig.customFields?.assistantApiUrl;
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <>
      <div id="waterwall-docs-content" className={`${styles.docs} ${assistantOpen ? styles.docsWithAssistant : ''}`}>{children}</div>
      {typeof endpoint === 'string' && endpoint.trim() && (
        <DocsAssistant endpoint={endpoint.trim()} open={assistantOpen} onOpenChange={setAssistantOpen} />
      )}
    </>
  );
}
