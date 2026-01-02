import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { submitAssessment, setQuestionnaire, addResponse, clearResponses } from '../store/assessmentSlice';
import questionnaire from '../data/questionnaire.json';
import toast from 'react-hot-toast';
import './RiskAssessmentPage.css';

function RiskAssessmentPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentFarm } = useSelector((state) => state.farm);
    const { currentAssessment, responses, loading } = useSelector((state) => state.assessment);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        dispatch(setQuestionnaire(questionnaire));
    }, [dispatch]);

    const currentQ = questionnaire[currentQuestion];
    const totalQuestions = questionnaire.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    const handleAnswer = (answer, riskLevel) => {
        const response = {
            questionId: currentQ.questionId,
            question: currentQ.question,
            answer,
            riskLevel,
        };

        dispatch(addResponse(response));

        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!currentFarm) {
            toast.error('No farm selected');
            return;
        }

        const result = await dispatch(submitAssessment({
            farmId: currentFarm._id,
            responses,
        }));

        if (submitAssessment.fulfilled.match(result)) {
            setShowResults(true);
            toast.success('Assessment completed!');
        }
    };

    const handleRestart = () => {
        dispatch(clearResponses());
        setCurrentQuestion(0);
        setShowResults(false);
    };

    if (showResults && currentAssessment) {
        const getRiskColor = (score) => {
            if (score >= 75) return 'critical';
            if (score >= 50) return 'high';
            if (score >= 25) return 'medium';
            return 'low';
        };

        return (
            <div className="assessment-results">
                <h2>{t('assessment.results')}</h2>

                <div className="result-card">
                    <div className="result-header">
                        <div className="result-score">
                            <div className={`score-circle score-${getRiskColor(currentAssessment.overallRiskScore)}`}>
                                {currentAssessment.overallRiskScore}
                            </div>
                            <div className="result-label">
                                {t('assessment.riskScore')}
                                <div className={`risk-badge badge-${getRiskColor(currentAssessment.overallRiskScore)}`}>
                                    {t(`assessment.${currentAssessment.riskCategory}`)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="recommendations">
                        <h3>{t('assessment.recommendations')}</h3>
                        {currentAssessment.recommendations.map((rec, index) => (
                            <div key={index} className={`rec-item rec-${rec.priority}`}>
                                <div className="rec-priority">
                                    <span className={`badge badge-${rec.priority === 'immediate' ? 'danger' : rec.priority === 'high' ? 'warning' : 'info'}`}>
                                        {t(`assessment.${rec.priority}`)}
                                    </span>
                                </div>
                                <div className="rec-text">{rec.recommendation}</div>
                            </div>
                        ))}
                    </div>

                    <div className="result-actions">
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                            {t('nav.dashboard')}
                        </button>
                        <button onClick={handleRestart} className="btn btn-secondary">
                            Take Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentQ) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return (
        <div className="assessment-page">
            <div className="assessment-header">
                <h2>{t('assessment.title')}</h2>
                <div className="question-progress">
                    {t('assessment.question')} {currentQuestion + 1} {t('assessment.of')} {totalQuestions}
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="question-card card">
                <div className="question-text">
                    {i18n.language === 'hi' && currentQ.questionHi ? currentQ.questionHi : currentQ.questionEn}
                </div>

                {currentQ.type === 'boolean' && (
                    <div className="answer-buttons">
                        <button
                            onClick={() => handleAnswer('yes', currentQ.riskMapping.yes)}
                            className="btn btn-primary btn-lg"
                        >
                            {t('assessment.yes')}
                        </button>
                        <button
                            onClick={() => handleAnswer('no', currentQ.riskMapping.no)}
                            className="btn btn-secondary btn-lg"
                        >
                            {t('assessment.no')}
                        </button>
                    </div>
                )}

                {currentQ.type === 'choice' && (
                    <div className="answer-choices">
                        {currentQ.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option.value, currentQ.riskMapping[option.value])}
                                className="choice-button"
                            >
                                {i18n.language === 'hi' && option.labelHi ? option.labelHi : option.labelEn}
                            </button>
                        ))}
                    </div>
                )}

                {currentQuestion > 0 && (
                    <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="btn btn-outline mt-2">
                        ← {t('assessment.previous')}
                    </button>
                )}
            </div>
        </div>
    );
}

export default RiskAssessmentPage;
