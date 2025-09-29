---
layout: default
title: Bias Calculation Methodology - Bias Beacon
permalink: /bias-beacon/methodology/
---

<div class="bias-beacon-container">
  <h1>🧮 Bias Calculation Methodology</h1>
  
  <div class="methodology-hero">
    <div class="hero-content">
      <h2>Understanding Our Bias Metrics</h2>
      <p>Transparent, data-driven analysis of judicial bias patterns using established statistical methodologies and peer-reviewed research.</p>
    </div>
  </div>

  <div class="methodology-sections">
    
    <!-- Racial Disparity Calculation -->
    <section class="methodology-section" id="racial-disparity">
      <h2>📊 Racial Disparity Score</h2>
      
      <div class="methodology-overview">
        <h3>Definition</h3>
        <p>The Racial Disparity Score measures sentencing disparities between racial groups appearing before each judge, controlling for offense severity, criminal history, and other legal factors.</p>
      </div>
      
      <div class="calculation-formula">
        <h3>🔢 Calculation Formula</h3>
        <div class="formula-box">
          <div class="formula">
            <strong>Racial Disparity Score = Σ(|White_Avg - Minority_Avg| / Population_Weight) / Case_Count</strong>
          </div>
          
          <div class="formula-breakdown">
            <h4>Where:</h4>
            <ul>
              <li><strong>White_Avg</strong> = Average sentence length for white defendants</li>
              <li><strong>Minority_Avg</strong> = Average sentence length for minority defendants (by category)</li>
              <li><strong>Population_Weight</strong> = Statistical weight based on sample size and population demographics</li>
              <li><strong>Case_Count</strong> = Total number of comparable cases (same offense class/criminal history)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="methodology-details">
        <h3>📋 Detailed Methodology</h3>
        
        <div class="detail-section">
          <h4>1. Data Collection & Standardization</h4>
          <ul>
            <li><strong>Source Data:</strong> Oregon Judicial Department case records, ORS sentencing guidelines</li>
            <li><strong>Case Matching:</strong> Only cases with identical offense severity levels (Measure 11, Class A/B/C felonies)</li>
            <li><strong>Temporal Scope:</strong> Rolling 5-year analysis window to ensure statistical significance</li>
            <li><strong>Minimum Threshold:</strong> Minimum 50 cases per demographic category for inclusion</li>
          </ul>
        </div>
        
        <div class="detail-section">
          <h4>2. Controlled Variables</h4>
          <ul>
            <li><strong>Criminal History Score:</strong> Oregon Criminal History Scale (ORS 137.082)</li>
            <li><strong>Offense Severity:</strong> Crime Seriousness Scale rank</li>
            <li><strong>Departure Factors:</strong> Documented aggravating/mitigating circumstances</li>
            <li><strong>Plea vs. Trial:</strong> Mode of conviction (guilty plea, bench trial, jury trial)</li>
            <li><strong>Representation Type:</strong> Self-represented, court-appointed, retained counsel</li>
          </ul>
        </div>
        
        <div class="detail-section">
          <h4>3. Statistical Analysis</h4>
          <ul>
            <li><strong>Regression Analysis:</strong> Multiple linear regression controlling for legal factors</li>
            <li><strong>Effect Size:</strong> Cohen's d calculation for practical significance</li>
            <li><strong>Confidence Intervals:</strong> 95% CI for all disparity measurements</li>
            <li><strong>Statistical Significance:</strong> p-value threshold of 0.05 with Bonferroni correction</li>
          </ul>
        </div>
        
        <div class="scoring-scale">
          <h4>4. Disparity Score Interpretation</h4>
          <div class="scale-grid">
            <div class="scale-item excellent">
              <div class="scale-value">0.0 - 0.5</div>
              <div class="scale-label">Excellent</div>
              <div class="scale-description">No statistically significant racial disparities detected</div>
            </div>
            <div class="scale-item low">
              <div class="scale-value">0.6 - 1.0</div>
              <div class="scale-label">Low Risk</div>
              <div class="scale-description">Minor disparities within statistical margin of error</div>
            </div>
            <div class="scale-item moderate">
              <div class="scale-value">1.1 - 2.0</div>
              <div class="scale-label">Moderate Risk</div>
              <div class="scale-description">Statistically significant but small effect size disparities</div>
            </div>
            <div class="scale-item high">
              <div class="scale-value">2.1 - 3.0</div>
              <div class="scale-label">High Risk</div>
              <div class="scale-description">Substantial disparities requiring attention</div>
            </div>
            <div class="scale-item critical">
              <div class="scale-value">3.1+</div>
              <div class="scale-label">Critical</div>
              <div class="scale-description">Large, systematic disparities indicating potential bias</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Counsel Representation Disparity -->
    <section class="methodology-section" id="counsel-disparity">
      <h2>⚖️ Counsel Representation Disparity Score</h2>
      
      <div class="methodology-overview">
        <h3>Definition</h3>
        <p>Measures sentencing disparities based on type of legal representation (self-represented, court-appointed, or retained counsel), controlling for case complexity and defendant characteristics.</p>
      </div>
      
      <div class="calculation-formula">
        <h3>🔢 Calculation Formula</h3>
        <div class="formula-box">
          <div class="formula">
            <strong>Counsel Disparity = Σ(|Self_Rep_Avg - Retained_Avg| + |Appointed_Avg - Retained_Avg|) / 2</strong>
          </div>
          
          <div class="formula-breakdown">
            <h4>Where:</h4>
            <ul>
              <li><strong>Self_Rep_Avg</strong> = Average sentence for self-represented defendants</li>
              <li><strong>Appointed_Avg</strong> = Average sentence for court-appointed counsel cases</li>
              <li><strong>Retained_Avg</strong> = Average sentence for retained counsel cases (baseline)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Prison Rate Calculation -->
    <section class="methodology-section" id="prison-rate">
      <h2>🏛️ Prison Rate Methodology</h2>
      
      <div class="methodology-overview">
        <h3>Definition</h3>
        <p>Percentage of cases resulting in prison sentences (versus probation, community service, or other alternatives), compared to state and county averages for similar offenses.</p>
      </div>
      
      <div class="calculation-formula">
        <h3>🔢 Calculation Formula</h3>
        <div class="formula-box">
          <div class="formula">
            <strong>Prison Rate = (Prison_Sentences / Total_Sentences) × 100</strong>
          </div>
          
          <div class="formula-breakdown">
            <h4>Adjusted for:</h4>
            <ul>
              <li><strong>Offense Severity:</strong> Separate rates by felony class</li>
              <li><strong>Criminal History:</strong> Prior conviction adjustments</li>
              <li><strong>Regional Baselines:</strong> Comparison to county/state averages</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Reversal Rate Methodology -->
    <section class="methodology-section" id="reversal-rate">
      <h2>📋 Appellate Reversal Rate</h2>
      
      <div class="methodology-overview">
        <h3>Definition</h3>
        <p>Percentage of appealed cases that result in reversal, remand, or significant modification by appellate courts, indicating potential procedural errors or bias.</p>
      </div>
      
      <div class="calculation-formula">
        <h3>🔢 Calculation Formula</h3>
        <div class="formula-box">
          <div class="formula">
            <strong>Reversal Rate = ((Reversals + Remands + Modifications) / Total_Appeals) × 100</strong>
          </div>
          
          <div class="reversal-categories">
            <h4>Reversal Categories:</h4>
            <ul>
              <li><strong>Full Reversal:</strong> Complete overturning of decision</li>
              <li><strong>Remand:</strong> Sent back for re-hearing or re-sentencing</li>
              <li><strong>Modification:</strong> Partial change to sentence or ruling</li>
              <li><strong>Procedural Error:</strong> Reversals due to procedural mistakes</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Data Sources & Validation -->
    <section class="methodology-section" id="data-sources">
      <h2>📚 Data Sources & Validation</h2>
      
      <div class="data-source">
        <h3>Primary Data Sources</h3>
        <ul>
          <li><strong>Oregon Judicial Department:</strong> Case management system records</li>
          <li><strong>Oregon Court of Appeals:</strong> Appellate case decisions and outcomes</li>
          <li><strong>Oregon Criminal Justice Commission:</strong> Sentencing guidelines and statistics</li>
          <li><strong>Oregon State Police:</strong> Arrest and citation data (for context)</li>
          <li><strong>U.S. Census Bureau:</strong> Demographic and population data</li>
        </ul>
      </div>
      
      <div class="validation-process">
        <h3>🔍 Validation Process</h3>
        <div class="validation-steps">
          <div class="validation-step">
            <h4>1. Data Quality Assurance</h4>
            <ul>
              <li>Automated data validation scripts</li>
              <li>Manual review of statistical outliers</li>
              <li>Cross-referencing with multiple data sources</li>
            </ul>
          </div>
          
          <div class="validation-step">
            <h4>2. Statistical Verification</h4>
            <ul>
              <li>Independent replication of calculations</li>
              <li>Peer review by criminal justice statisticians</li>
              <li>Sensitivity analysis for methodological assumptions</li>
            </ul>
          </div>
          
          <div class="validation-step">
            <h4>3. Temporal Consistency</h4>
            <ul>
              <li>Rolling window analysis to detect trends</li>
              <li>Stability testing across multiple time periods</li>
              <li>Adjustment for changes in law or procedure</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Limitations & Caveats -->
    <section class="methodology-section" id="limitations">
      <h2>⚠️ Limitations & Important Caveats</h2>
      
      <div class="limitation-grid">
        <div class="limitation-item">
          <h3>📊 Statistical Limitations</h3>
          <ul>
            <li>Small sample sizes may reduce statistical power in rural counties</li>
            <li>Confidence intervals widen for judges with fewer cases</li>
            <li>Correlation does not establish causation of bias</li>
          </ul>
        </div>
        
        <div class="limitation-item">
          <h3>🔍 Data Limitations</h3>
          <ul>
            <li>Some relevant factors may not be captured in court records</li>
            <li>Prosecutorial discretion affects case composition</li>
            <li>Plea bargain details may not be fully documented</li>
          </ul>
        </div>
        
        <div class="limitation-item">
          <h3>⚖️ Legal Context</h3>
          <ul>
            <li>Judicial discretion is legitimate within legal bounds</li>
            <li>Different judicial philosophies may produce varying patterns</li>
            <li>External factors (law changes, caseload pressure) affect outcomes</li>
          </ul>
        </div>
      </div>
      
      <div class="disclaimer">
        <h3>🚨 Important Disclaimer</h3>
        <p class="disclaimer-text">
          <strong>These metrics are analytical tools designed to identify patterns that warrant further investigation, not definitive proof of bias.</strong> 
          Statistical disparities can result from many factors beyond judicial bias, including prosecutorial practices, defense quality, 
          case complexity variations, and unmeasured legal factors. Users should consider these metrics as starting points for deeper 
          analysis rather than conclusive evidence of discriminatory behavior.
        </p>
      </div>
    </section>
    
    <!-- Research References -->
    <section class="methodology-section" id="references">
      <h2>📖 Research References & Standards</h2>
      
      <div class="references-grid">
        <div class="reference-category">
          <h3>Methodological Standards</h3>
          <ul>
            <li>American Statistical Association Guidelines for Statistical Evidence</li>
            <li>National Academy of Sciences Committee on Law and Justice Standards</li>
            <li>Administrative Office of U.S. Courts Statistical Methodology</li>
          </ul>
        </div>
        
        <div class="reference-category">
          <h3>Peer-Reviewed Research</h3>
          <ul>
            <li>Mustard, D.B. (2001). "Racial, Ethnic, and Gender Disparities in Sentencing"</li>
            <li>Ulmer, J.T. & Johnson, B. (2004). "Sentencing in Context: A Multilevel Analysis"</li>
            <li>Spohn, C. (2013). "The Effects of the Offender's Race, Ethnicity, and Sex on Sentencing"</li>
          </ul>
        </div>
        
        <div class="reference-category">
          <h3>Legal Standards</h3>
          <ul>
            <li>Oregon Revised Statutes Chapter 137 (Sentencing Guidelines)</li>
            <li>Oregon Criminal Justice Commission Administrative Rules</li>
            <li>Federal Guidelines for Bias-Free Analysis (DOJ 2021)</li>
          </ul>
        </div>
      </div>
    </section>
    
  </div>
</div>

<style>
/* Methodology Page Specific Styles */
.methodology-hero {
  background: linear-gradient(135deg, var(--black) 0%, var(--dark-purple) 50%, var(--bright-magenta) 100%);
  color: var(--white);
  padding: 3rem 2rem;
  margin: 2rem 0;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(251, 5, 255, 0.3);
}

.methodology-hero h2 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: var(--bright-green);
}

.methodology-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin: 2rem 0;
}

.methodology-section {
  background: var(--white);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid var(--light-grey);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.methodology-section h2 {
  color: var(--black);
  border-bottom: 3px solid var(--bright-magenta);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.formula-box {
  background: var(--light-grey);
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid var(--black);
  margin: 1rem 0;
}

.formula {
  font-size: 1.2rem;
  text-align: center;
  padding: 1rem;
  background: var(--black);
  color: var(--white);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.scale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.scale-item {
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 2px solid;
}

.scale-item.excellent {
  background: var(--bright-green);
  color: var(--black);
  border-color: var(--black);
}

.scale-item.low {
  background: var(--light-grey);
  color: var(--black);
  border-color: var(--black);
}

.scale-item.moderate {
  background: var(--black);
  color: var(--white);
  border-color: var(--light-grey);
}

.scale-item.high {
  background: var(--dark-purple);
  color: var(--white);
  border-color: var(--bright-magenta);
}

.scale-item.critical {
  background: var(--bright-magenta);
  color: var(--white);
  border-color: var(--dark-purple);
}

.scale-value {
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.scale-label {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.scale-description {
  font-size: 0.9rem;
  line-height: 1.4;
}

.limitation-grid, .references-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 1rem 0;
}

.limitation-item, .reference-category {
  background: var(--light-grey);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--black);
}

.limitation-item h3, .reference-category h3 {
  color: var(--black);
  margin-bottom: 1rem;
}

.disclaimer {
  background: var(--bright-magenta);
  color: var(--white);
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid var(--dark-purple);
  margin: 2rem 0;
  text-align: center;
}

.disclaimer-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.validation-steps {
  display: grid;
  gap: 1.5rem;
  margin: 1rem 0;
}

.validation-step {
  background: var(--light-grey);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--bright-magenta);
}

.validation-step h4 {
  color: var(--black);
  margin-bottom: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .scale-grid, .limitation-grid, .references-grid {
    grid-template-columns: 1fr;
  }
  
  .methodology-hero h2 {
    font-size: 1.8rem;
  }
  
  .formula {
    font-size: 1rem;
  }
}
</style>