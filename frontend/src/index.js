import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import App from './App';
import store from './store/store';
import i18n from './i18n/i18n';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <I18nextProvider i18n={i18n}>
                    <App />
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#16a34a',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#dc2626',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </I18nextProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// Register service worker for PWA
serviceWorkerRegistration.register();
