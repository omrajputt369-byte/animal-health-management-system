import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCompliance, toggleComplianceItem } from '../store/complianceSlice';
import toast from 'react-hot-toast';
import './CompliancePage.css';

function CompliancePage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { currentFarm } = useSelector((state) => state.farm);
    const { compliance, loading } = useSelector((state) => state.compliance);

    useEffect(() => {
        if (currentFarm?._id) {
            dispatch(fetchCompliance(currentFarm._id));
        }
    }, [dispatch, currentFarm]);

    const handleToggleItem = async (itemId) => {
        if (!currentFarm?._id) return;

        const result = await dispatch(toggleComplianceItem({
            farmId: currentFarm._id,
            itemId
        }));

        if (toggleComplianceItem.fulfilled.match(result)) {
            toast.success('Checklist updated!');
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            infrastructure: '🏗️',
            documentation: '📋',
            practices: '✅',
            training: '🎓',
            health: '🏥'
        };
        return icons[category] || '📌';
    };

    const getCategoryLabel = (category) => {
        const labels = {
            infrastructure: 'Infrastructure',
            documentation: 'Documentation',
            practices: 'Practices',
            training: 'Training',
            health: 'Health'
        };
        return labels[category] || category;
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    const completedCount = compliance?.checklistItems?.filter(item => item.isCompleted).length || 0;
    const totalCount = compliance?.checklistItems?.length || 0;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="compliance-page">
            <div className="page-header">
                <h2>{t('compliance.title') || 'Compliance Tracker'}</h2>
                <p>{t('compliance.subtitle') || 'Track your farm biosecurity compliance'}</p>
            </div>

            <div className="compliance-summary card">
                <div className="summary-score">
                    <div className={`score-circle score-${progressPercent >= 75 ? 'low' : progressPercent >= 50 ? 'medium' : 'high'}`}>
                        {progressPercent}%
                    </div>
                    <div className="score-label">
                        {t('dashboard.complianceScore') || 'Compliance Score'}
                    </div>
                </div>
                <div className="summary-stats">
                    <div className="stat">
                        <span className="stat-number">{completedCount}</span>
                        <span className="stat-label">{t('compliance.completed') || 'Completed'}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{totalCount - completedCount}</span>
                        <span className="stat-label">{t('compliance.remaining') || 'Remaining'}</span>
                    </div>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="checklist-section">
                <h3>{t('compliance.checklist') || 'Compliance Checklist'}</h3>

                <div className="checklist-items">
                    {compliance?.checklistItems?.map((item, index) => (
                        <div
                            key={item.itemId}
                            className={`checklist-item ${item.isCompleted ? 'completed' : ''}`}
                            onClick={() => handleToggleItem(item.itemId)}
                        >
                            <div className="item-checkbox">
                                {item.isCompleted ? '✓' : ''}
                            </div>
                            <div className="item-content">
                                <div className="item-title">
                                    {i18n.language === 'hi' && item.titleHi ? item.titleHi : item.title}
                                </div>
                                <div className="item-category">
                                    {getCategoryIcon(item.category)} {getCategoryLabel(item.category)}
                                </div>
                            </div>
                            {item.completedDate && (
                                <div className="item-date">
                                    {new Date(item.completedDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {progressPercent === 100 && (
                <div className="certification-banner">
                    <span className="banner-icon">🎉</span>
                    <div className="banner-content">
                        <h4>{t('compliance.congratulations') || 'Congratulations!'}</h4>
                        <p>{t('compliance.allComplete') || 'All compliance items completed. Your farm is ready for certification review.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompliancePage;
