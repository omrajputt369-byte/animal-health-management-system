import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/authSlice';
import toast from 'react-hot-toast';

function Header() {
    const { user } = useSelector((state) => state.auth);
    const { currentFarm } = useSelector((state) => state.farm);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container header-container">
                <div className="header-left">
                    <h1 className="header-logo">{t('app.name')}</h1>
                    {currentFarm && (
                        <span className="farm-name">{currentFarm.farmName}</span>
                    )}
                </div>
                <div className="header-right">
                    <span className="user-name">{user?.name}</span>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                        {t('nav.logout')}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
