/**
 * Bias Beacon Score Calculator
 * Calculates a composite bias score for judges based on multiple metrics
 * Score ranges from 0 (no bias indicators) to 100 (severe bias indicators)
 */

export class BiasScoreCalculator {
  // Weight configuration for different bias factors
  static WEIGHTS = {
    racialDisparity: 0.25,      // 25% weight
    counselDisparity: 0.20,     // 20% weight
    prisonRate: 0.15,           // 15% weight
    reversalRate: 0.15,         // 15% weight
    genderDisparity: 0.10,      // 10% weight
    seniorityAdjustment: 0.05,  // 5% weight - more cases = more reliable data
    complaintRate: 0.10         // 10% weight
  };

  // Score thresholds for color coding
  static THRESHOLDS = {
    excellent: { max: 20, color: '#A3FF05', label: 'Excellent' },    // Bright green
    low: { max: 40, color: '#9FA8FF', label: 'Low Risk' },           // Periwinkle
    moderate: { max: 60, color: '#666666', label: 'Moderate' },      // Grey
    high: { max: 80, color: '#9A031E', label: 'High Risk' },         // Brand red
    critical: { max: 100, color: '#5F0F40', label: 'Critical' }      // Deep magenta
  };

  /**
   * Calculate the composite Bias Beacon Score for a judge
   * @param {Object} judge - Judge data object
   * @returns {Object} - Score object with value, level, color, and breakdown
   */
  static calculate(judge) {
    const breakdown = {};
    let totalScore = 0;

    // 1. Racial Disparity Score (0-100 normalized)
    const racialScore = this.normalizeRacialDisparity(
      judge.bias_metrics?.sentence_disparity?.racial?.disparity_score ||
      judge.racial_disparity || 0
    );
    breakdown.racial = racialScore;
    totalScore += racialScore * this.WEIGHTS.racialDisparity;

    // 2. Counsel Representation Disparity (0-100 normalized)
    const counselScore = this.normalizeCounselDisparity(
      judge.bias_metrics?.sentence_disparity?.counsel_representation?.disparity_score ||
      judge.counsel_disparity || 0
    );
    breakdown.counsel = counselScore;
    totalScore += counselScore * this.WEIGHTS.counselDisparity;

    // 3. Prison Rate Score (compared to state average of ~28%)
    const prisonScore = this.normalizePrisonRate(
      judge.bias_metrics?.prison_rate || judge.prison_rate || 0
    );
    breakdown.prison = prisonScore;
    totalScore += prisonScore * this.WEIGHTS.prisonRate;

    // 4. Appellate Reversal Rate (0-100 normalized)
    const reversalScore = this.normalizeReversalRate(
      judge.appellate_record?.reversal_rate || judge.reversal_rate || 0
    );
    breakdown.reversal = reversalScore;
    totalScore += reversalScore * this.WEIGHTS.reversalRate;

    // 5. Gender Disparity (if available)
    const genderScore = this.normalizeGenderDisparity(
      judge.bias_metrics?.sentence_disparity?.gender?.disparity_score || 0
    );
    breakdown.gender = genderScore;
    totalScore += genderScore * this.WEIGHTS.genderDisparity;

    // 6. Seniority/Data Reliability Adjustment
    const seniorityAdjustment = this.calculateSeniorityAdjustment(judge);
    breakdown.seniority = seniorityAdjustment;
    totalScore += seniorityAdjustment * this.WEIGHTS.seniorityAdjustment;

    // 7. Complaint Rate (if available)
    const complaintScore = this.normalizeComplaintRate(
      judge.accountability_flags?.length || 0
    );
    breakdown.complaints = complaintScore;
    totalScore += complaintScore * this.WEIGHTS.complaintRate;

    // Round to one decimal place
    const finalScore = Math.min(100, Math.max(0, Math.round(totalScore * 10) / 10));

    return {
      score: finalScore,
      level: this.getLevel(finalScore),
      color: this.getColor(finalScore),
      textColor: this.getTextColor(finalScore),
      breakdown,
      riskAssessment: this.getRiskAssessment(finalScore)
    };
  }

  /**
   * Normalize racial disparity score (typically 0-20) to 0-100 scale
   */
  static normalizeRacialDisparity(score) {
    // Scores above 10 are considered very high
    return Math.min(100, (score / 15) * 100);
  }

  /**
   * Normalize counsel disparity score (typically 0-25) to 0-100 scale
   */
  static normalizeCounselDisparity(score) {
    // Scores above 15 are considered very high
    return Math.min(100, (score / 20) * 100);
  }

  /**
   * Normalize prison rate against state average
   * State average is ~28%, so we measure deviation from this
   */
  static normalizePrisonRate(rate) {
    const stateAverage = 28;
    const deviation = rate - stateAverage;

    if (deviation <= 0) return 0; // Below or at average is good

    // Each 5% above average adds 20 points (max 100 at 25% above average)
    return Math.min(100, (deviation / 25) * 100);
  }

  /**
   * Normalize appellate reversal rate
   * Average is ~12%, so measure deviation
   */
  static normalizeReversalRate(rate) {
    const stateAverage = 12;
    const deviation = rate - stateAverage;

    if (deviation <= 0) return 0;

    // Each 5% above average adds 25 points
    return Math.min(100, (deviation / 20) * 100);
  }

  /**
   * Normalize gender disparity (0-10 scale to 0-100)
   */
  static normalizeGenderDisparity(score) {
    return Math.min(100, (score / 10) * 100);
  }

  /**
   * Calculate seniority adjustment
   * More years = more data = more reliable conclusions
   */
  static calculateSeniorityAdjustment(judge) {
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(judge.tenure_start) || currentYear;
    const yearsOnBench = currentYear - startYear;

    // Less than 2 years: score may be less reliable, but we don't penalize
    // This factor is about data reliability, not bias
    return 0; // Neutral contribution
  }

  /**
   * Normalize complaint/accountability flag rate
   */
  static normalizeComplaintRate(flagCount) {
    // Each flag adds 25 points
    return Math.min(100, flagCount * 25);
  }

  /**
   * Get the risk level based on score
   */
  static getLevel(score) {
    if (score <= this.THRESHOLDS.excellent.max) return 'excellent';
    if (score <= this.THRESHOLDS.low.max) return 'low';
    if (score <= this.THRESHOLDS.moderate.max) return 'moderate';
    if (score <= this.THRESHOLDS.high.max) return 'high';
    return 'critical';
  }

  /**
   * Get color for score
   */
  static getColor(score) {
    const level = this.getLevel(score);
    return this.THRESHOLDS[level].color;
  }

  /**
   * Get text color for readability (white or black depending on background)
   */
  static getTextColor(score) {
    const level = this.getLevel(score);
    // Use white text for darker backgrounds
    return ['moderate', 'high', 'critical'].includes(level) ? '#FFFFFF' : '#0B0F12';
  }

  /**
   * Get human-readable risk assessment
   */
  static getRiskAssessment(score) {
    if (score <= 20) {
      return 'Minimal bias indicators detected. This judge shows equitable treatment patterns.';
    }
    if (score <= 40) {
      return 'Low bias indicators. Some metrics slightly elevated but within acceptable ranges.';
    }
    if (score <= 60) {
      return 'Moderate bias indicators present. Notable disparities in some metrics warrant attention.';
    }
    if (score <= 80) {
      return 'High bias indicators detected. Significant disparities across multiple metrics require review.';
    }
    return 'Critical bias levels. Severe disparities and accountability concerns require immediate attention.';
  }

  /**
   * Get abbreviated level label
   */
  static getLevelLabel(score) {
    const level = this.getLevel(score);
    return this.THRESHOLDS[level].label;
  }

  /**
   * Sort judges by bias score (highest first by default)
   * @param {Array} judges - Array of judge objects
   * @param {boolean} ascending - If true, sort lowest first
   */
  static sortByBiasScore(judges, ascending = false) {
    return judges.slice().sort((a, b) => {
      const scoreA = this.calculate(a).score;
      const scoreB = this.calculate(b).score;
      return ascending ? scoreA - scoreB : scoreB - scoreA;
    });
  }

  /**
   * Filter judges by bias level
   * @param {Array} judges - Array of judge objects
   * @param {string} level - Level to filter by
   */
  static filterByLevel(judges, level) {
    return judges.filter(judge => {
      const result = this.calculate(judge);
      return result.level === level;
    });
  }

  /**
   * Get statistics for a group of judges
   */
  static getGroupStatistics(judges) {
    if (!judges.length) return null;

    const scores = judges.map(j => this.calculate(j).score);
    const sorted = scores.slice().sort((a, b) => a - b);

    return {
      count: judges.length,
      average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
      median: sorted[Math.floor(sorted.length / 2)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      distribution: {
        excellent: judges.filter(j => this.calculate(j).level === 'excellent').length,
        low: judges.filter(j => this.calculate(j).level === 'low').length,
        moderate: judges.filter(j => this.calculate(j).level === 'moderate').length,
        high: judges.filter(j => this.calculate(j).level === 'high').length,
        critical: judges.filter(j => this.calculate(j).level === 'critical').length
      }
    };
  }
}

// Export for use in other modules
export default BiasScoreCalculator;
