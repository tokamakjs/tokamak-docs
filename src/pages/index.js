import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';


export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="A semi-opinionated React framework.">
      <main
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '1rem',
          margin: 'auto'
        }}>
        <div style={{
          marginTop: '4rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <img height="54px" style={{ marginBottom: '2rem' }} src={'/tokamakjs/img/logo.svg'} />
          <h1 style={{ textAlign: 'center'}}>A semi-opinionated React framework</h1>
          <code style={{ textAlign: 'center'}} >$ npm i -g @tokamakjs/cli<br/>$ tok new your-project-name</code>
        </div>
        <div style={{ display: 'block', textAlign: 'center', marginTop: '2rem', width: '100%'}}>
          <Link to="docs/introduction">Check the documentation</Link>
        </div>
      </main>
    </Layout>
  );
}
