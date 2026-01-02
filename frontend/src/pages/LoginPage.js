import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { login, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';
import './AuthPages.css';

function LoginPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(login(formData));

        if (login.fulfilled.match(result)) {
            toast.success('Login successful!');
            navigate('/dashboard');
        }
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
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
                    <h2 className="auth-title">{t('auth.login')}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">{t('auth.phone')}</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                placeholder={t('auth.phonePlaceholder')}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                maxLength="10"
                                pattern="[6-9][0-9]{9}"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('auth.password')}</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder={t('auth.passwordPlaceholder')}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? t('common.loading') : t('auth.loginButton')}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {t('auth.noAccount')}{' '}
                            <Link to="/register" className="auth-link">
                                {t('auth.register')}
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

export default LoginPage;
