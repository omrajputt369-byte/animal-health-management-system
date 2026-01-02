/**
 * Risk Calculator Service
 * Calculates biosecurity risk scores and generates recommendations
 */

// Risk scoring weights for different categories
const RISK_WEIGHTS = {
    infrastructure: 0.3,
    practices: 0.4,
    monitoring: 0.2,
    compliance: 0.1
};

/**
 * Calculate overall risk score from questionnaire responses
 * @param {Array} responses - Array of questionnaire responses
 * @returns {Number} Risk score (0-100, higher is riskier)
 */
exports.calculateRiskScore = (responses) => {
    if (!responses || responses.length === 0) {
        return 0;
    }

    let totalScore = 0;
    let totalWeight = 0;

    responses.forEach(response => {
        const { riskLevel } = response;

        // Convert risk level to numeric score
        let riskValue = 0;
        switch (riskLevel) {
            case 'low':
                riskValue = 10;
                break;
            case 'medium':
                riskValue = 40;
                break;
            case 'high':
                riskValue = 70;
                break;
            case 'critical':
                riskValue = 95;
                break;
            default:
                riskValue = 0;
        }

        totalScore += riskValue;
        totalWeight += 1;
    });

    // Calculate average
    const averageScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

    return Math.min(100, Math.max(0, averageScore));
};

/**
 * Generate recommendations based on responses and overall score
 * @param {Array} responses - Array of questionnaire responses
 * @param {Number} overallScore - Overall risk score
 * @returns {Array} Array of recommendations
 */
exports.generateRecommendations = (responses, overallScore) => {
    const recommendations = [];

    // Analyze each response and generate specific recommendations
    responses.forEach(response => {
        const { questionId, question, answer, riskLevel } = response;

        // Only generate recommendations for medium, high, and critical risks
        if (riskLevel === 'medium' || riskLevel === 'high' || riskLevel === 'critical') {
            const recommendation = generateSpecificRecommendation(questionId, question, answer, riskLevel);
            if (recommendation) {
                recommendations.push(recommendation);
            }
        }
    });

    // Add general recommendations based on overall score
    if (overallScore >= 75) {
        recommendations.push({
            priority: 'immediate',
            category: 'general',
            recommendation: 'संपर्क करें तुरंत पशु चिकित्सक / Contact veterinarian immediately for comprehensive biosecurity audit'
        });
    } else if (overallScore >= 50) {
        recommendations.push({
            priority: 'high',
            category: 'general',
            recommendation: 'Schedule biosecurity training within 2 weeks / 2 सप्ताह में जैव सुरक्षा प्रशिक्षण लें'
        });
    }

    // Sort by priority
    const priorityOrder = { immediate: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recommendations.slice(0, 10); // Return top 10 recommendations
};

/**
 * Generate specific recommendation based on question
 * @param {String} questionId - Question ID
 * @param {String} question - Question text
 * @param {Mixed} answer - User's answer
 * @param {String} riskLevel - Risk level for this response
 * @returns {Object} Recommendation object
 */
function generateSpecificRecommendation(questionId, question, answer, riskLevel) {
    // Recommendation templates based on common biosecurity issues
    const templates = {
        'disinfection': {
            priority: 'immediate',
            category: 'infrastructure',
            recommendation: 'Install disinfection footbath at farm entrance / प्रवेश द्वार पर कीटाणुशोधन फुटबाथ स्थापित करें'
        },
        'quarantine': {
            priority: 'high',
            category: 'infrastructure',
            recommendation: 'Set up separate quarantine area for new cattle / नए पशुओं के लिए अलग क्वारंटाइन क्षेत्र बनाएं'
        },
        'visitor': {
            priority: 'high',
            category: 'practices',
            recommendation: 'Implement strict visitor log and biosecurity protocol / आगंतुक लॉग और जैव सुरक्षा प्रोटोकॉल लागू करें'
        },
        'vaccination': {
            priority: 'immediate',
            category: 'monitoring',
            recommendation: 'Update vaccination schedule immediately / टीकाकरण कार्यक्रम तुरंत अपडेट करें'
        },
        'waste': {
            priority: 'high',
            category: 'practices',
            recommendation: 'Improve waste disposal system to prevent contamination / संदूषण रोकने के लिए अपशिष्ट निपटान प्रणाली में सुधार करें'
        },
        'monitoring': {
            priority: 'medium',
            category: 'monitoring',
            recommendation: 'Implement daily health monitoring and record keeping / दैनिक स्वास्थ्य निगरानी और रिकॉर्ड रखना शुरू करें'
        },
        'birdproofing': {
            priority: 'high',
            category: 'infrastructure',
            recommendation: 'Install bird-proof netting to prevent wild bird contact / जंगली पक्षी संपर्क रोकने के लिए पक्षी-प्रूफ जाली लगाएं'
        }
    };

    // Match question to template (simple keyword matching)
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('disinfect') || lowerQuestion.includes('कीटाणुशोधन')) {
        return templates.disinfection;
    } else if (lowerQuestion.includes('quarantine') || lowerQuestion.includes('क्वारंटाइन')) {
        return templates.quarantine;
    } else if (lowerQuestion.includes('visitor') || lowerQuestion.includes('आगंतुक')) {
        return templates.visitor;
    } else if (lowerQuestion.includes('vaccination') || lowerQuestion.includes('टीकाकरण')) {
        return templates.vaccination;
    } else if (lowerQuestion.includes('waste') || lowerQuestion.includes('अपशिष्ट')) {
        return templates.waste;
    } else if (lowerQuestion.includes('monitor') || lowerQuestion.includes('निगरानी')) {
        return templates.monitoring;
    } else if (lowerQuestion.includes('bird') && lowerQuestion.includes('proof')) {
        return templates.birdproofing;
    }

    // Generic recommendation based on risk level
    return {
        priority: riskLevel === 'critical' ? 'immediate' : riskLevel === 'high' ? 'high' : 'medium',
        category: 'general',
        recommendation: `Address issue: ${question.substring(0, 100)}...`
    };
}
