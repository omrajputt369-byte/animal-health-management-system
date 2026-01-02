import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './ProfilePage.css';

function ProfilePage() {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const { currentFarm } = useSelector((state) => state.farm);

    return (
        <div className="profile-page">
            <h2>{t('nav.profile')}</h2>

            <div className="card">
                <h3>User Information</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-label">{t('auth.name')}</div>
                        <div className="info-value">{user?.name}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">{t('auth.phone')}</div>
                        <div className="info-value">{user?.phone}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">{t('auth.email')}</div>
                        <div className="info-value">{user?.email || 'Not set'}</div>
                    </div>
                </div>
            </div>

            {currentFarm && (
                <div className="card mt-3">
                    <h3>Farm Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label">{t('farm.farmName')}</div>
                            <div className="info-value">{currentFarm.farmName}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">{t('farm.livestockType')}</div>
                            <div className="info-value">{currentFarm.livestockType}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">{t('farm.farmSize')}</div>
                            <div className="info-value">{currentFarm.farmSize} acres</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">{t('farm.location')}</div>
                            <div className="info-value">
                                {currentFarm.location.district}, {currentFarm.location.state}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
