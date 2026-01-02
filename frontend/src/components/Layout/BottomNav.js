import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BottomNav() {
    const { t } = useTranslation();

    return (
        <nav className="bottom-nav">
            <NavLink to="/dashboard" className="nav-item">
                <span className="nav-icon">🏠</span>
                <span className="nav-label">{t('nav.dashboard')}</span>
            </NavLink>
            <NavLink to="/risk-assessment" className="nav-item">
                <span className="nav-icon">🎯</span>
                <span className="nav-label">{t('nav.riskAssessment')}</span>
            </NavLink>
            <NavLink to="/alerts" className="nav-item">
                <span className="nav-icon">🚨</span>
                <span className="nav-label">{t('nav.alerts')}</span>
            </NavLink>
            <NavLink to="/profile" className="nav-item">
                <span className="nav-icon">👤</span>
                <span className="nav-label">{t('nav.profile')}</span>
            </NavLink>
        </nav>
    );
}

export default BottomNav;
