import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { readBlogBootstrapData } from './lib/blog-client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const bootstrapData = readBlogBootstrapData(document);
const app = (
  <React.StrictMode>
    <App
      initialPath={bootstrapData?.path}
      initialLanguage={bootstrapData?.language}
      initialBlogData={bootstrapData}
    />
  </React.StrictMode>
);

if (bootstrapData && rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}
