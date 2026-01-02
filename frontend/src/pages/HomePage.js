import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HomePage.css';

function HomePage() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="container">
                    <h1 className="logo">{t('app.name')}</h1>
                    <nav className="home-nav">
                        {/* Language Selector */}
                        <div className="language-selector">
                            <button
                                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                                onClick={() => changeLanguage('en')}
                            >
                                English
                            </button>
                            <button
                                className={`lang-btn ${i18n.language === 'hi' ? 'active' : ''}`}
                                onClick={() => changeLanguage('hi')}
                            >
                                हिंदी
                            </button>
                        </div>
                        <Link to="/login" className="btn btn-outline">
                            {t('auth.login')}
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            {t('auth.register')}
                        </Link>
                    </nav>
                </div>
            </header>

            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h2 className="hero-title">{t('app.tagline')}</h2>
                        <p className="hero-subtitle">
                            {t('home.subtitle')}
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                {t('home.getStarted')}
                            </Link>
                            <Link to="/login" className="btn btn-secondary btn-lg">
                                {t('auth.login')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <h3 className="section-title">{t('home.features')}</h3>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h4>{t('home.feature1Title')}</h4>
                            <p>{t('home.feature1Desc')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚨</div>
                            <h4>{t('home.feature2Title')}</h4>
                            <p>{t('home.feature2Desc')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h4>{t('home.feature3Title')}</h4>
                            <p>{t('home.feature3Desc')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📝</div>
                            <h4>{t('home.feature4Title')}</h4>
                            <p>{t('home.feature4Desc')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h4>{t('home.feature5Title')}</h4>
                            <p>{t('home.feature5Desc')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎓</div>
                            <h4>{t('home.feature6Title')}</h4>
                            <p>{t('home.feature6Desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <div className="container">
                    <p>{t('home.footer')}</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
