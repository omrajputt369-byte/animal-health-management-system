import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchFarms } from '../store/farmSlice';
import { fetchNearbyAlerts } from '../store/alertSlice';
import './DashboardPage.css';

function DashboardPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { currentFarm } = useSelector((state) => state.farm);
    const { nearbyAlerts } = useSelector((state) => state.alert);

    useEffect(() => {
        dispatch(fetchFarms());
    }, [dispatch]);

    useEffect(() => {
        if (currentFarm) {
            dispatch(fetchNearbyAlerts(currentFarm._id));
        }
    }, [currentFarm, dispatch]);

    const getRiskColor = (score) => {
        if (score >= 75) return 'success';
        if (score >= 50) return 'warning';
        return 'danger';
    };

    return (
        <div className="dashboard-page">
            <div className="welcome-section">
                <h2>{t('dashboard.welcome')}, {user?.name}!</h2>
                {currentFarm && (
                    <p className="farm-subtitle">{currentFarm.farmName}</p>
                )}
            </div>

            {currentFarm ? (
                <>
                    {/* Score Cards */}
                    <div className="score-cards">
                        <div className="score-card">
                            <div className="score-label">{t('dashboard.biosecurityScore')}</div>
                            <div className={`score-value score-${getRiskColor(currentFarm.biosecurityScore || 0)}`}>
                                {currentFarm.biosecurityScore || 0}
                                <span className="score-unit">/100</span>
                            </div>
                            <div className="score-ring" style={{ '--score': currentFarm.biosecurityScore || 0 }}></div>
                        </div>

                        <div className="score-card">
                            <div className="score-label">{t('dashboard.complianceScore')}</div>
                            <div className={`score-value score-${getRiskColor(currentFarm.complianceScore || 0)}`}>
                                {currentFarm.complianceScore || 0}
                                <span className="score-unit">/100</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Alerts */}
                    {nearbyAlerts && nearbyAlerts.length > 0 && (
                        <div className="alert-section card">
                            <div className="section-header">
                                <h3>{t('dashboard.activeAlerts')}</h3>
                                <Link to="/alerts" className="view-all">{t('common.view')}</Link>
                            </div>
                            {nearbyAlerts.slice(0, 2).map((alert) => (
                                <div key={alert._id} className={`alert-item alert-${alert.severity}`}>
                                    <div className="alert-icon">🚨</div>
                                    <div className="alert-content">
                                        <div className="alert-title">{alert.disease}</div>
                                        <div className="alert-meta">
                                            {alert.distanceKm} km away • {alert.severity} {t('alerts.severity')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3>{t('dashboard.quickActions')}</h3>
                        <div className="action-grid">
                            <Link to="/risk-assessment" className="action-card">
                                <div className="action-icon">🎯</div>
                                <div className="action-label">{t('dashboard.takeAssessment')}</div>
                            </Link>
                            <Link to="/alerts" className="action-card">
                                <div className="action-icon">🚨</div>
                                <div className="action-label">{t('dashboard.viewAlerts')}</div>
                            </Link>
                            <Link to="/compliance" className="action-card">
                                <div className="action-icon">📋</div>
                                <div className="action-label">{t('dashboard.compliance') || 'Compliance'}</div>
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty-state card">
                    <div className="empty-icon">🏭</div>
                    <h3>No Farm Setup</h3>
                    <p>Please set up your farm to start using the portal</p>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
