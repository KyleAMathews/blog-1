import React from 'react';
import DocumentTitle from 'react-document-title';
import last from 'lodash/last';

import { prefixLink } from 'gatsby-helpers';
import { config } from 'config';
import piwikConfig from 'piwik';

import { TypographyStyle } from 'src/util/typography';
import generateMetaTags from 'src/util/generateMetaTags';


const now = new Date();
const buster = now.getTime();

export default function HTML(props) {
  const buildMode = Boolean(props.body);

  const post = props.routes ? last(props.routes).page : null;
  const path = props.location ? props.location.pathname : null;
  const metaTags = generateMetaTags(post, config, path);

  const title = DocumentTitle.rewind() || config.blogTitle;
  const piwikSetup = buildPiwikSetup(config, piwikConfig);
  const piwikNoScript = buildPiwikNoScript(path, config.domain, piwikConfig);
  const js = getJS(buildMode, config.noProductionJavascript);
  const css = getCSS(buildMode);

  const { favicon } = config;

  return <html lang="en">
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="initial-scale=1.0" />
      {metaTags}
      <link rel="shortcut icon" href={favicon} />
      <TypographyStyle />
      {css}
    </head>
    <body className="landing-page">
      <div id="react-mount" dangerouslySetInnerHTML={{ __html: props.body }} />
      {js}
      {piwikSetup}
      {piwikNoScript}
    </body>
  </html>;
}

HTML.propTypes = {
  body: React.PropTypes.string,
  location: React.PropTypes.object,
  routes: React.PropTypes.array,
};

function buildPiwikSetup({ domainCDN }, { domain, siteId, site }) {
  const js = `
    window._paq = window._paq || [];
    window._paq.push(['setTrackerUrl', '${domain}/piwik.php']);
    window._paq.push(['setSiteId', '${siteId}']);
    window._paq.push(['setCookieDomain', '${site}']);
    window._paq.push(['setDomains', ['${site}']]);
    window._paq.push(['enableLinkTracking']);
    window._paq.push(['trackPageView']);
    window._paq.push(['enableHeartBeatTimer']);

    window.start = new Date();

    // add tag
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.defer=true; g.async=true;
    g.src='${domainCDN}/js/piwik/2.15.0/piwik.min.js';
    s.parentNode.insertBefore(g,s);
  `;

  return <script
    type="text/javascript"
    dangerouslySetInnerHTML={{ __html: js }}
  />;
}

buildPiwikSetup.propTypes = {
  domainCDN: React.PropTypes.string,
  domainPiwik: React.PropTypes.string,
};


function buildPiwikNoScript(path, blogDomain, { domain }) {
  const encodedPath = encodeURIComponent(blogDomain + path);

  return <noscript>
    <img
      src={`${domain}/piwik.php?idsite=3&rec=1&url=${encodedPath}`}
      style={{ border: 0 }}
      alt="tracker"
    />
  </noscript>;
}

function getJS(buildMode, noProductionJavascript) {
  const bundle = <script async defer src={prefixLink(`/bundle.js?t=${buster}`)} />;

  if (buildMode && noProductionJavascript) {
    return null;
  }

  return bundle;
}

function getCSS(buildMode) {
  const stylesheet =
    <link rel="stylesheet" href={prefixLink(`/styles.css?t=${buster}`)} />;

  if (buildMode) {
    return stylesheet;
  }

  return null;
}
