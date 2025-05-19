import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';
import { setLocale } from 'yup';
import moment from 'moment';
import 'moment/dist/locale/nl';
import { nl } from 'yup-locales';

setupIonicReact();

setLocale(nl);
moment().locale('nl');

createInertiaApp({
    title: (title) => `${title} - Playmix`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx');
        let filePath = `./Pages/${name}.tsx`;

        if (pages[filePath] === undefined) {
            if (pages[`./Pages/${name}/index.tsx`] !== undefined) {
                filePath = `./Pages/${name}/index.tsx`;
            } else {
                console.error(`Page ${name} not found`);
                pages['./Pages/Errors/Render.tsx'];
            }
        }

        return resolvePageComponent(filePath, pages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
