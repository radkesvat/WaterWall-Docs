import React, {type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocsAssistant from '@site/src/components/DocsAssistant';

export default function Root({children}: {children: ReactNode}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const endpoint = siteConfig.customFields?.assistantApiUrl;

  return (
    <>
      {children}
      {typeof endpoint === 'string' && endpoint.trim() && (
        <DocsAssistant endpoint={endpoint.trim()} />
      )}
    </>
  );
}
