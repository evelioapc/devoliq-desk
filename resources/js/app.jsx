import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { initI18n } from '@/lib/i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Devoliq Desk';

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.jsx`,
      import.meta.glob('./pages/**/*.jsx')
    ),
  setup({ el, App, props }) {
    const locale = props.initialPage.props?.locale
      ?? props.initialPage.props?.auth?.user?.locale
      ?? 'es';
    initI18n(locale);
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
    showSpinner: true,
  },
});
