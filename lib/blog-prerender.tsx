import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import type { BlogBootstrapData } from './blog-client';

export const renderBlogRouteApp = (bootstrapData: BlogBootstrapData) =>
  renderToString(
    <React.StrictMode>
      <App
        initialPath={bootstrapData.path}
        initialLanguage={bootstrapData.language}
        initialBlogData={bootstrapData}
      />
    </React.StrictMode>
  );
