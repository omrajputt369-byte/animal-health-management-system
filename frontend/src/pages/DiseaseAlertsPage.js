import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchNearbyAlerts } from '../store/alertSlice';
import './DiseaseAlertsPage.css';

function DiseaseAlertsPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { currentFarm } = useSelector((state) => state.farm);
    const { nearbyAlerts, loading } = useSelector((state) => state.alert);

    useEffect(() => {
        if (currentFarm) {
            dispatch(fetchNearbyAlerts(currentFarm._id));
        }
    }, [currentFarm, dispatch]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'danger';
            case 'high':
                return 'warning';
            case 'medium':
                return 'info';
            default:
                return 'success';
        }
    };

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return (
        <div className="alerts-page">
            <h2>{t('alerts.title')}</h2>

            {nearbyAlerts && nearbyAlerts.length > 0 ? (
                <div className="alerts-list">
                    {nearbyAlerts.map((alert) => (
                        <div key={alert._id} className={`alert-card card alert-${getSeverityColor(alert.severity)}`}>
                            <div className="alert-header">
                                <div className="alert-badge">
                                    <span className={`badge badge-${getSeverityColor(alert.severity)}`}>
                                        {alert.severity.toUpperCase()}
                                    </span>
                                </div>
                                <div className="alert-distance">
                                    {alert.distanceKm} {t('alerts.km')} {t('alerts.distance')}
                                </div>
                            </div>

                            <h3 className="alert-disease">{alert.disease}</h3>

                            <div className="alert-info">
                                <div className="info-row">
                                    <span className="info-label">{t('alerts.affectedSpecies')}:</span>
                                    <span className="info-value">{alert.affectedSpecies}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Location:</span>
                                    <span className="info-value">
                                        {alert.location.district}, {alert.location.state}
                                    </span>
                                </div>
                            </div>

                            <div className="alert-description">
                                {alert.description}
                            </div>

                            {alert.actionRequired && alert.actionRequired.length > 0 && (
                                <div className="actions-required">
                                    <h4>{t('alerts.actionRequired')}:</h4>
                                    <ul>
                                        {alert.actionRequired.map((action, index) => (
                                            <li key={index}>{action}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state card">
                    <div className="empty-icon">✅</div>
                    <h3>{t('alerts.noAlerts')}</h3>
                    <p>No active disease outbreaks detected within 50km of your farm</p>
                </div>
            )}
        </div>
    );
}

export default DiseaseAlertsPage;
