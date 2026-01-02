import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { register, clearError } from '../store/authSlice';
import { createFarm } from '../store/farmSlice';
import toast from 'react-hot-toast';
import './AuthPages.css';

function RegisterPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        phone: '',
        password: '',
        name: '',
        email: '',
        preferredLanguage: i18n.language,
    });

    const [farmData, setFarmData] = useState({
        farmName: '',
        farmSize: '',
        livestockType: 'cow',
        livestockCount: {
            cows: 0,
            buffaloes: 0,
        },
        location: {
            address: '',
            district: '',
            state: '',
            pincode: '',
            coordinates: {
                type: 'Point',
                coordinates: [0, 0], // Will be set by geolocation or manual
            },
        },
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleUserChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFarmChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setFarmData({
                ...farmData,
                location: {
                    ...farmData.location,
                    [field]: value,
                },
            });
        } else if (name.startsWith('livestockCount.')) {
            const field = name.split('.')[1];
            setFarmData({
                ...farmData,
                livestockCount: {
                    ...farmData.livestockCount,
                    [field]: parseInt(value) || 0,
                },
            });
        } else {
            setFarmData({
                ...farmData,
                [name]: value,
            });
        }
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleStep2Submit = async (e) => {
        e.preventDefault();

        // Register user
        const result = await dispatch(register(userData));

        if (register.fulfilled.match(result)) {
            // Create farm
            await dispatch(createFarm(farmData));
            toast.success('Registration successful!');
            navigate('/dashboard');
        }
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        setUserData({ ...userData, preferredLanguage: lang });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-logo">{t('app.name')}</h1>
                    <div className="language-selector">
                        <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>
                            EN
                        </button>
                        <button onClick={() => changeLanguage('hi')} className={i18n.language === 'hi' ? 'active' : ''}>
                            हिं
                        </button>
                        <button onClick={() => changeLanguage('te')} className={i18n.language === 'te' ? 'active' : ''}>
                            తె
                        </button>
                    </div>
                </div>

                <div className="auth-card">
                    <div className="stepper">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. User Details</div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Farm Setup</div>
                    </div>

                    {step === 1 && (
                        <>
                            <h2 className="auth-title">{t('auth.register')}</h2>

                            <form onSubmit={handleStep1Submit}>
                                <div className="form-group">
                                    <label className="form-label">{t('auth.name')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder={t('auth.namePlaceholder')}
                                        value={userData.name}
                                        onChange={handleUserChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('auth.phone')}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        placeholder={t('auth.phonePlaceholder')}
                                        value={userData.phone}
                                        onChange={handleUserChange}
                                        required
                                        maxLength="10"
                                        pattern="[6-9][0-9]{9}"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('auth.email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="yourname@example.com"
                                        value={userData.email}
                                        onChange={handleUserChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('auth.password')}</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-input"
                                        placeholder={t('auth.passwordPlaceholder')}
                                        value={userData.password}
                                        onChange={handleUserChange}
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-block">
                                    {t('common.next')} →
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="auth-title">Farm Setup</h2>

                            <form onSubmit={handleStep2Submit}>
                                <div className="form-group">
                                    <label className="form-label">{t('farm.farmName')}</label>
                                    <input
                                        type="text"
                                        name="farmName"
                                        className="form-input"
                                        placeholder="e.g., Rajput Cattle Farm"
                                        value={farmData.farmName}
                                        onChange={handleFarmChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('farm.farmSize')}</label>
                                    <input
                                        type="number"
                                        name="farmSize"
                                        className="form-input"
                                        placeholder="5"
                                        value={farmData.farmSize}
                                        onChange={handleFarmChange}
                                        required
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('farm.livestockType')}</label>
                                    <select
                                        name="livestockType"
                                        className="form-select"
                                        value={farmData.livestockType}
                                        onChange={handleFarmChange}
                                        required
                                    >
                                        <option value="cow">{t('farm.cow')}</option>
                                        <option value="buffalo">{t('farm.buffalo')}</option>
                                        <option value="both">{t('farm.both')}</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('farm.address')}</label>
                                    <input
                                        type="text"
                                        name="location.address"
                                        className="form-input"
                                        placeholder="Village, Taluka"
                                        value={farmData.location.address}
                                        onChange={handleFarmChange}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">{t('farm.district')}</label>
                                        <input
                                            type="text"
                                            name="location.district"
                                            className="form-input"
                                            placeholder="Pune"
                                            value={farmData.location.district}
                                            onChange={handleFarmChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('farm.state')}</label>
                                        <input
                                            type="text"
                                            name="location.state"
                                            className="form-input"
                                            placeholder="Maharashtra"
                                            value={farmData.location.state}
                                            onChange={handleFarmChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                                        ← {t('assessment.previous')}
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? t('common.loading') : t('auth.registerButton')}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    <div className="auth-footer">
                        <p>
                            {t('auth.haveAccount')}{' '}
                            <Link to="/login" className="auth-link">
                                {t('auth.login')}
                            </Link>
                        </p>
                    </div>
                </div>

                <Link to="/" className="back-home">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}

export default RegisterPage;
