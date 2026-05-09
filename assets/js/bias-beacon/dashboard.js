// Bias Beacon Dashboard JavaScript
// Real-time data visualization and dashboard functionality

class BiasBeaconDashboard {
    constructor() {
        this.oregonData = null;
        this.charts = {};
        this.initialize();
    }
    
    async initialize() {
        await this.loadOregonData();
        this.loadJudgeDatabase();
        this.setupEventListeners();
        this.setupJudgeSelection();
        this.renderCharts();
        this.startRealTimeUpdates();
    }
    
    selectJudgeForAnalysis(judgeId) {
        if (!judgeId) {
            this.hideJudgeAnalysis();
            return;
        }
        
        const judge = this.judgeDatabase.find(j => j.id === judgeId);
        if (!judge) {
            console.error('Judge not found:', judgeId);
            return;
        }
        
        this.displayJudgeAnalysis(judge);
    }
    
    displayJudgeAnalysis(judge) {
        const container = document.getElementById('selected-judge-dashboard');
        if (!container) return;
        
        // Get judge data - either from DOM element or sample data
        const judgeData = this.getJudgeAnalysisData(judge);
        
        const analysisHTML = `
            <div class="judge-dashboard-analysis">
                <div class="analysis-header">
                    <h4>${judgeData.name}</h4>
                    <div class="judge-meta">
                        <span class="county">${judgeData.county.charAt(0).toUpperCase() + judgeData.county.slice(1)} County</span>
                        <span class="risk-badge ${judge.risk}">${judge.risk.toUpperCase()}</span>
                    </div>
                </div>
                
                <div class="analysis-metrics">
                    <div class="metric-grid">
                        <div class="dashboard-metric">
                            <div class="metric-value">${judgeData.prisonRate}%</div>
                            <div class="metric-label">Prison Rate</div>
                            <div class="metric-comparison">${this.getComparisonText(judgeData.prisonRate, 28.4, 'prison rate')}</div>
                        </div>
                        
                        <div class="dashboard-metric">
                            <div class="metric-value">${judgeData.reversalRate}%</div>
                            <div class="metric-label">Reversal Rate</div>
                            <div class="metric-comparison">${this.getComparisonText(judgeData.reversalRate, 14.2, 'reversal rate')}</div>
                        </div>
                        
                        <div class="dashboard-metric">
                            <div class="metric-value">${judgeData.appeals}</div>
                            <div class="metric-label">2024 Appeals</div>
                            <div class="metric-comparison">${judgeData.reversals} reversals</div>
                        </div>
                        
                        <div class="dashboard-metric">
                            <div class="metric-value">${judgeData.caseload || 'N/A'}</div>
                            <div class="metric-label">2024 Caseload</div>
                            <div class="metric-comparison">Total cases</div>
                        </div>
                    </div>
                </div>
                
                <div class="analysis-charts">
                    <div class="chart-section">
                        <h5>📊 Representation Type Breakdown</h5>
                        <div id="judge-representation-chart" class="mini-chart">
                            ${this.generateRepresentationChart(judgeData)}
                        </div>
                    </div>
                    
                    <div class="chart-section">
                        <h5>⚖️ Bias Risk Assessment</h5>
                        <div class="risk-assessment">
                            ${this.generateRiskAssessment(judge, judgeData)}
                        </div>
                    </div>
                </div>
                
                <div class="analysis-actions">
                    <button onclick="window.open('/bias-beacon/judges/#${judge.id}', '_blank')" class="view-full-profile">View Full Profile</button>
                    <button onclick="dashboardInstance.addToComparison('${judge.id}')" class="add-to-compare">Add to Comparison</button>
                </div>
            </div>
        `;
        
        container.innerHTML = analysisHTML;
        container.style.display = 'block';
        
        // Scroll to analysis
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    getJudgeAnalysisData(judge) {
        // Try to get data from judge.data (sample data) or extract from DOM
        if (judge.data) {
            return judge.data;
        }
        
        // Extract from DOM element if available
        if (judge.element) {
            return this.extractJudgeDataFromElement(judge.element);
        }
        
        // Default fallback data
        return {
            name: judge.name,
            county: judge.county,
            prisonRate: 25.0,
            appeals: 15,
            reversals: 3,
            reversalRate: 20.0,
            caseload: 500
        };
    }
    
    extractJudgeDataFromElement(element) {
        // Extract data from the judge card DOM element
        const name = element.querySelector('h3')?.textContent || 'Unknown Judge';
        const prisonRate = this.extractMetricFromElement(element, 'Prison Rate:');
        const appeals = this.extractAppealsFromElement(element);
        
        return {
            name: name,
            county: element.dataset.county,
            prisonRate: prisonRate,
            appeals: appeals.total,
            reversals: appeals.reversals,
            reversalRate: appeals.reversalRate,
            caseload: this.extractCaseloadFromElement(element)
        };
    }
    
    extractMetricFromElement(element, label) {
        const metrics = element.querySelectorAll('.metric');
        for (let metric of metrics) {
            const labelEl = metric.querySelector('.metric-label');
            if (labelEl && labelEl.textContent === label) {
                const valueEl = metric.querySelector('.metric-value');
                return valueEl ? parseFloat(valueEl.textContent) : 0;
            }
        }
        return 0;
    }
    
    extractAppealsFromElement(element) {
        const appealsSection = element.querySelector('.appellate-record');
        if (!appealsSection) return { total: 0, reversals: 0, reversalRate: 0 };
        
        const appealsText = appealsSection.querySelector('.appeals-count')?.textContent || '0 appeals';
        const reversalText = appealsSection.querySelector('.reversal-rate')?.textContent || '0% reversed';
        
        const total = parseInt(appealsText.match(/\d+/) || [0])[0];
        const reversalRate = parseFloat(reversalText.match(/[\d.]+/) || [0])[0];
        const reversals = Math.round((total * reversalRate) / 100);
        
        return { total, reversals, reversalRate };
    }
    
    extractCaseloadFromElement(element) {
        const details = element.querySelectorAll('p');
        for (let detail of details) {
            if (detail.textContent.includes('2024 Caseload:')) {
                const match = detail.textContent.match(/([\d,]+)\s+cases/);
                return match ? parseInt(match[1].replace(/,/g, '')) : 0;
            }
        }
        return 0;
    }
    
    getComparisonText(value, average, metric) {
        const diff = value - average;
        const percentage = Math.abs((diff / average) * 100).toFixed(1);
        
        if (Math.abs(diff) < 1) {
            return 'Near average';
        } else if (diff > 0) {
            return `${percentage}% above avg`;
        } else {
            return `${percentage}% below avg`;
        }
    }
    
    generateRepresentationChart(judgeData) {
        // Simple representation chart using CSS bars
        const repData = judgeData.representation || {
            selfRep: 30,
            courtAppointed: 55,
            retained: 15
        };
        
        return `
            <div class="rep-chart-bars">
                <div class="rep-bar">
                    <span class="rep-label">Self-Represented</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${repData.selfRep}%"></div>
                        <span class="bar-value">${repData.selfRep}%</span>
                    </div>
                </div>
                <div class="rep-bar">
                    <span class="rep-label">Court-Appointed</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${repData.courtAppointed}%"></div>
                        <span class="bar-value">${repData.courtAppointed}%</span>
                    </div>
                </div>
                <div class="rep-bar">
                    <span class="rep-label">Retained Counsel</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${repData.retained}%"></div>
                        <span class="bar-value">${repData.retained}%</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateRiskAssessment(judge, judgeData) {
        const riskFactors = [];
        
        if (judgeData.reversalRate > 20) {
            riskFactors.push('High reversal rate');
        }
        
        if (judgeData.prisonRate > 35) {
            riskFactors.push('Above-average prison sentences');
        }
        
        if (judge.risk === 'critical') {
            riskFactors.push('Critical accountability flags');
        }
        
        if (riskFactors.length === 0) {
            riskFactors.push('No significant risk factors identified');
        }
        
        return `
            <div class="risk-factors">
                ${riskFactors.map(factor => `
                    <div class="risk-factor ${judge.risk}">
                        ${judge.risk === 'critical' || judge.risk === 'high' ? '⚠️' : '✓'} ${factor}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    hideJudgeAnalysis() {
        const container = document.getElementById('selected-judge-dashboard');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    addToComparison(judgeId) {
        // Navigate to judges page with this judge selected for comparison
        window.location.href = `/bias-beacon/judges/?compare=${judgeId}`;
    }
    
    initializeCaseTypeAnalysis() {
        this.updateCaseTypeAnalysis('all');
    }
    
    updateCaseTypeAnalysis(caseType) {
        const resultsContainer = document.getElementById('case-type-results');
        if (!resultsContainer) return;
        
        // Generate case type specific analysis
        const analysisData = this.getCaseTypeData(caseType);
        
        // Update visualizations
        this.updateCaseTypeVisualizations(analysisData);
    }
    
    getCaseTypeData(caseType) {
        // Sample data - in real implementation, this would come from the data source
        const caseTypeData = {
            all: {
                prisonRateVariation: [25, 30, 35, 28, 32],
                sentenceDisparities: [8.2, 12.4, 15.1, 6.8, 9.3],
                representationImpact: [18.5, 22.1, 28.7]
            },
            felony: {
                prisonRateVariation: [45, 52, 48, 44, 49],
                sentenceDisparities: [15.2, 18.9, 22.1, 12.4, 16.8],
                representationImpact: [28.4, 34.2, 42.1]
            },
            misdemeanor: {
                prisonRateVariation: [12, 18, 15, 14, 16],
                sentenceDisparities: [4.2, 6.8, 8.1, 3.9, 5.5],
                representationImpact: [8.7, 12.3, 15.9]
            },
            drug: {
                prisonRateVariation: [38, 42, 45, 35, 40],
                sentenceDisparities: [12.8, 16.4, 19.2, 11.1, 14.5],
                representationImpact: [22.1, 27.8, 33.5]
            }
        };
        
        return caseTypeData[caseType] || caseTypeData.all;
    }
    
    updateCaseTypeVisualizations(data) {
        // Update prison rate variation
        const prisonRateEl = document.getElementById('prison-rate-variation');
        if (prisonRateEl) {
            prisonRateEl.innerHTML = this.generateMiniBarChart(data.prisonRateVariation, 'Prison Rate (%)');
        }
        
        // Update sentence disparities
        const sentenceEl = document.getElementById('sentence-disparities');
        if (sentenceEl) {
            sentenceEl.innerHTML = this.generateMiniBarChart(data.sentenceDisparities, 'Disparity Score');
        }
        
        // Update representation impact
        const repEl = document.getElementById('representation-impact');
        if (repEl) {
            repEl.innerHTML = this.generateMiniBarChart(data.representationImpact, 'Impact Score');
        }
    }
    
    generateMiniBarChart(data, label) {
        const max = Math.max(...data);
        const bars = data.map((value, index) => {
            const height = (value / max) * 100;
            return `
                <div class="mini-bar" style="height: ${height}%" title="${label}: ${value}">
                    <span class="bar-value">${value}</span>
                </div>
            `;
        }).join('');
        
        return `
            <div class="mini-chart-container">
                <div class="mini-bars">
                    ${bars}
                </div>
                <div class="chart-label">${label}</div>
            </div>
        `;
    }
    
    loadJudgeDatabase() {
        // Extract judge data from the DOM or data attributes
        this.judgeDatabase = [];
        
        // Load from embedded data or DOM elements
        const judgeCards = document.querySelectorAll('.judge-card');
        judgeCards.forEach(card => {
            const judgeData = {
                id: card.dataset.id,
                name: card.dataset.name,
                county: card.dataset.county,
                risk: card.dataset.risk,
                department: card.dataset.department,
                element: card
            };
            this.judgeDatabase.push(judgeData);
        });
        
        // If no DOM elements, use the sample data
        if (this.judgeDatabase.length === 0) {
            this.judgeDatabase = this.oregonData.judges.map((judge, index) => ({
                id: `judge_${index}`,
                name: judge.name,
                county: judge.county.toLowerCase(),
                risk: this.determineRiskLevel(judge),
                department: 'criminal',
                data: judge
            }));
        }
        
        console.log(`Loaded ${this.judgeDatabase.length} judges into dashboard`);
    }
    
    determineRiskLevel(judge) {
        if (judge.reversalRate > 25) return 'critical';
        if (judge.reversalRate > 20) return 'high';
        if (judge.reversalRate > 15) return 'moderate';
        if (judge.reversalRate > 10) return 'low';
        return 'excellent';
    }
    
    async loadOregonData() {
        // In a real implementation, this would fetch from Oregon Judicial Department APIs
        // For now, we'll use representative data structures
        this.oregonData = {
            counties: [
                { name: 'Multnomah', prisonRate: 32.4, counselDisparity: 18.2, racialDisparity: 12.1, unrepresented: 78.3, judges: 47, riskLevel: 'critical' },
                { name: 'Washington', prisonRate: 29.1, counselDisparity: 8.3, racialDisparity: 2.4, unrepresented: 67.9, judges: 23, riskLevel: 'moderate' },
                { name: 'Lane', prisonRate: 24.3, counselDisparity: 1.8, racialDisparity: -1.1, unrepresented: 64.2, judges: 15, riskLevel: 'excellent' },
                { name: 'Marion', prisonRate: 31.8, counselDisparity: 12.4, racialDisparity: 8.7, unrepresented: 71.8, judges: 14, riskLevel: 'high' },
                { name: 'Jackson', prisonRate: 28.9, counselDisparity: 6.2, racialDisparity: 4.1, unrepresented: 69.4, judges: 12, riskLevel: 'moderate' },
                { name: 'Deschutes', prisonRate: 22.1, counselDisparity: 2.8, racialDisparity: 0.9, unrepresented: 62.1, judges: 11, riskLevel: 'low' },
                { name: 'Clackamas', prisonRate: 26.7, counselDisparity: 3.1, racialDisparity: 1.2, unrepresented: 65.4, judges: 18, riskLevel: 'low' },
                { name: 'Benton', prisonRate: 19.4, counselDisparity: 1.2, racialDisparity: -0.3, unrepresented: 58.9, judges: 8, riskLevel: 'excellent' }
            ],
            judges: [
                { name: 'Judge Kathleen Dailey', county: 'Multnomah', prisonRate: 42.1, appeals: 89, reversals: 21, reversalRate: 23.6 },
                { name: 'Judge Benjamin Souede', county: 'Multnomah', prisonRate: 41.7, appeals: 127, reversals: 34, reversalRate: 26.8 },
                { name: 'Judge Michael Chen', county: 'Washington', prisonRate: 28.4, appeals: 23, reversals: 3, reversalRate: 13.0 },
                { name: 'Judge Charles Bailey', county: 'Washington', prisonRate: 26.8, appeals: 34, reversals: 4, reversalRate: 11.8 },
                { name: 'Judge Debra Vogt', county: 'Lane', prisonRate: 22.1, appeals: 28, reversals: 2, reversalRate: 7.1 }
            ],
            crisisTrends: [
                { month: 'Jan 2024', unrepresentedRate: 68.2 },
                { month: 'Feb 2024', unrepresentedRate: 69.1 },
                { month: 'Mar 2024', unrepresentedRate: 70.3 },
                { month: 'Apr 2024', unrepresentedRate: 71.8 },
                { month: 'May 2024', unrepresentedRate: 72.1 },
                { month: 'Jun 2024', unrepresentedRate: 72.9 },
                { month: 'Jul 2024', unrepresentedRate: 72.1 },
                { month: 'Aug 2024', unrepresentedRate: 74.2 }
            ]
        };
    }
    
    setupEventListeners() {
        // County card interactions
        document.querySelectorAll('.county-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const county = e.currentTarget.getAttribute('data-county');
                this.showCountyDetails(county);
            });
        });
        
        // Filter controls
        const filters = ['date-range', 'case-types', 'county-group'];
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });
        
        // Real-time toggle
        const realtimeToggle = document.getElementById('realtime-toggle');
        if (realtimeToggle) {
            realtimeToggle.addEventListener('change', (e) => {
                this.toggleRealTimeUpdates(e.target.checked);
            });
        }
        
        // Judge selection event listeners
        const judgeSelect = document.getElementById('dashboard-judge-select');
        if (judgeSelect) {
            judgeSelect.addEventListener('change', (e) => {
                this.selectJudgeForAnalysis(e.target.value);
            });
        }
        
        // Dashboard filter event listeners
        const countyFilter = document.getElementById('dashboard-county-filter');
        const riskFilter = document.getElementById('dashboard-risk-filter');
        
        if (countyFilter) {
            countyFilter.addEventListener('change', () => this.updateJudgeDropdown());
        }
        
        if (riskFilter) {
            riskFilter.addEventListener('change', () => this.updateJudgeDropdown());
        }
        
        // Case type analysis
        const caseTypeFilter = document.getElementById('case-type-filter');
        if (caseTypeFilter) {
            caseTypeFilter.addEventListener('change', (e) => {
                this.updateCaseTypeAnalysis(e.target.value);
            });
        }
    }
    
    setupJudgeSelection() {
        this.populateJudgeDropdown();
        this.initializeCaseTypeAnalysis();
    }
    
    populateJudgeDropdown() {
        const judgeSelect = document.getElementById('dashboard-judge-select');
        if (!judgeSelect || this.judgeDatabase.length === 0) return;
        
        // Clear existing options except the first one
        while (judgeSelect.children.length > 1) {
            judgeSelect.removeChild(judgeSelect.lastChild);
        }
        
        // Get filtered judges based on county and risk filters
        const filteredJudges = this.getFilteredJudges();
        
        // Add judge options
        filteredJudges.forEach(judge => {
            const option = document.createElement('option');
            option.value = judge.id;
            option.textContent = `${judge.name} (${judge.county.charAt(0).toUpperCase() + judge.county.slice(1)} County)`;
            judgeSelect.appendChild(option);
        });
        
        console.log(`Populated dropdown with ${filteredJudges.length} judges`);
    }
    
    getFilteredJudges() {
        const countyFilter = document.getElementById('dashboard-county-filter')?.value;
        const riskFilter = document.getElementById('dashboard-risk-filter')?.value;
        
        return this.judgeDatabase.filter(judge => {
            const countyMatch = !countyFilter || judge.county === countyFilter;
            const riskMatch = !riskFilter || judge.risk === riskFilter;
            return countyMatch && riskMatch;
        });
    }
    
    updateJudgeDropdown() {
        this.populateJudgeDropdown();
        
        // Clear current selection if it doesn't match filters
        const judgeSelect = document.getElementById('dashboard-judge-select');
        if (judgeSelect && judgeSelect.value) {
            const selectedJudge = this.judgeDatabase.find(j => j.id === judgeSelect.value);
            const filteredJudges = this.getFilteredJudges();
            
            if (selectedJudge && !filteredJudges.includes(selectedJudge)) {
                judgeSelect.value = '';
                this.hideJudgeAnalysis();
            }
        }
    }
    
    renderCharts() {
        this.renderPrisonRatesChart();
        this.renderCounselDisparityChart();
        this.renderAppealsChart();
        this.renderCrisisTrendsChart();
    }
    
    renderPrisonRatesChart() {
        const canvas = document.getElementById('prisonRatesCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const counties = this.oregonData.counties.slice(0, 8); // Show top 8 counties
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart dimensions
        const chartWidth = canvas.width - 100;
        const chartHeight = canvas.height - 100;
        const barWidth = chartWidth / counties.length;
        const maxRate = Math.max(...counties.map(c => c.prisonRate));
        
        // Draw bars
        counties.forEach((county, index) => {
            const barHeight = (county.prisonRate / maxRate) * chartHeight;
            const x = 50 + index * barWidth;
            const y = canvas.height - 50 - barHeight;
            
            // Color based on risk level
            let color = '#27ae60'; // green
            if (county.riskLevel === 'critical') color = '#e74c3c'; // red
            else if (county.riskLevel === 'high') color = '#e67e22'; // orange
            else if (county.riskLevel === 'moderate') color = '#f39c12'; // yellow
            
            ctx.fillStyle = color;
            ctx.fillRect(x + 10, y, barWidth - 20, barHeight);
            
            // County name
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(county.name, x + barWidth/2, canvas.height - 25);
            
            // Prison rate label
            ctx.fillText(`${county.prisonRate}%`, x + barWidth/2, y - 5);
        });
        
        // Chart title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Prison Rates by County (%)', canvas.width/2, 25);
        
        // Y-axis labels
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = canvas.height - 50 - (i * chartHeight / 5);
            const rate = (i * maxRate / 5).toFixed(1);
            ctx.fillText(rate + '%', 45, y + 3);
        }
    }
    
    renderCounselDisparityChart() {
        const canvas = document.getElementById('counselDisparityCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const counties = this.oregonData.counties.slice(0, 8);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart setup
        const chartWidth = canvas.width - 100;
        const chartHeight = canvas.height - 100;
        const barWidth = chartWidth / counties.length;
        const maxDisparity = Math.max(...counties.map(c => c.counselDisparity));
        
        counties.forEach((county, index) => {
            const barHeight = (county.counselDisparity / maxDisparity) * chartHeight;
            const x = 50 + index * barWidth;
            const y = canvas.height - 50 - barHeight;
            
            // Color gradient based on disparity level
            let color = '#27ae60';
            if (county.counselDisparity > 15) color = '#e74c3c';
            else if (county.counselDisparity > 10) color = '#e67e22';
            else if (county.counselDisparity > 5) color = '#f39c12';
            
            ctx.fillStyle = color;
            ctx.fillRect(x + 10, y, barWidth - 20, barHeight);
            
            // Labels
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(county.name, x + barWidth/2, canvas.height - 25);
            ctx.fillText(county.counselDisparity.toFixed(1), x + barWidth/2, y - 5);
        });
        
        // Title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Counsel Representation Disparity by County', canvas.width/2, 25);
    }
    
    renderAppealsChart() {
        const canvas = document.getElementById('appealsCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const judges = this.oregonData.judges;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Scatter plot of appeals vs reversal rate
        const chartWidth = canvas.width - 120;
        const chartHeight = canvas.height - 100;
        const maxAppeals = Math.max(...judges.map(j => j.appeals));
        const maxReversalRate = Math.max(...judges.map(j => j.reversalRate));
        
        judges.forEach(judge => {
            const x = 60 + (judge.appeals / maxAppeals) * chartWidth;
            const y = canvas.height - 50 - (judge.reversalRate / maxReversalRate) * chartHeight;
            
            // Color by reversal rate
            let color = '#27ae60';
            if (judge.reversalRate > 20) color = '#e74c3c';
            else if (judge.reversalRate > 15) color = '#e67e22';
            else if (judge.reversalRate > 10) color = '#f39c12';
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Judge name (abbreviated)
            ctx.fillStyle = '#2c3e50';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const shortName = judge.name.split(' ').pop(); // Last name only
            ctx.fillText(shortName, x, y + 20);
        });
        
        // Axes and labels
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, canvas.height - 50);
        ctx.lineTo(canvas.width - 60, canvas.height - 50);
        ctx.moveTo(60, 50);
        ctx.lineTo(60, canvas.height - 50);
        ctx.stroke();
        
        // Title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Appeals vs Reversal Rates by Judge', canvas.width/2, 25);
        
        // Axis labels
        ctx.font = '12px Arial';
        ctx.fillText('Number of Appeals', canvas.width/2, canvas.height - 10);
        ctx.save();
        ctx.translate(20, canvas.height/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('Reversal Rate (%)', 0, 0);
        ctx.restore();
    }
    
    renderCrisisTrendsChart() {
        const canvas = document.getElementById('crisisTrendsCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const trends = this.oregonData.crisisTrends;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const chartWidth = canvas.width - 120;
        const chartHeight = canvas.height - 100;
        const pointSpacing = chartWidth / (trends.length - 1);
        const minRate = Math.min(...trends.map(t => t.unrepresentedRate));
        const maxRate = Math.max(...trends.map(t => t.unrepresentedRate));
        const rateRange = maxRate - minRate;
        
        // Draw trend line
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        trends.forEach((trend, index) => {
            const x = 60 + index * pointSpacing;
            const y = canvas.height - 50 - ((trend.unrepresentedRate - minRate) / rateRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Data points
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Month labels
            ctx.fillStyle = '#2c3e50';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(trend.month.split(' ')[0], x, canvas.height - 25);
            
            // Rate labels
            ctx.fillText(`${trend.unrepresentedRate}%`, x, y - 10);
        });
        
        ctx.stroke();
        
        // Title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Unrepresented Persons Crisis Trend (2024)', canvas.width/2, 25);
        
        // Critical threshold line
        const criticalY = canvas.height - 50 - ((70 - minRate) / rateRange) * chartHeight;
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(60, criticalY);
        ctx.lineTo(canvas.width - 60, criticalY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#e67e22';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Crisis Threshold (70%)', 70, criticalY - 5);
    }
    
    showCountyDetails(countyName) {
        const county = this.oregonData.counties.find(c => 
            c.name.toLowerCase() === countyName.toLowerCase()
        );
        
        if (!county) return;
        
        const modal = document.createElement('div');
        modal.className = 'county-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${county.name} County Detailed Analysis</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="county-detail-stats">
                        <div class="detail-stat">
                            <label>Prison Rate:</label>
                            <span class="stat-value ${this.getRiskClass(county.prisonRate, 'prison')}">${county.prisonRate}%</span>
                        </div>
                        <div class="detail-stat">
                            <label>Counsel Disparity:</label>
                            <span class="stat-value ${this.getRiskClass(county.counselDisparity, 'counsel')}">${county.counselDisparity}</span>
                        </div>
                        <div class="detail-stat">
                            <label>Racial Disparity:</label>
                            <span class="stat-value ${this.getRiskClass(county.racialDisparity, 'racial')}">${county.racialDisparity}</span>
                        </div>
                        <div class="detail-stat">
                            <label>Unrepresented Rate:</label>
                            <span class="stat-value ${this.getRiskClass(county.unrepresented, 'unrepresented')}">${county.unrepresented}%</span>
                        </div>
                        <div class="detail-stat">
                            <label>Active Judges:</label>
                            <span class="stat-value">${county.judges}</span>
                        </div>
                        <div class="detail-stat">
                            <label>Risk Assessment:</label>
                            <span class="risk-badge ${county.riskLevel}">${county.riskLevel.toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <div class="county-recommendations">
                        <h4>Recommendations</h4>
                        ${this.getCountyRecommendations(county)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    getRiskClass(value, type) {
        switch(type) {
            case 'prison':
                if (value > 30) return 'high-risk';
                if (value > 25) return 'moderate-risk';
                return 'low-risk';
            case 'counsel':
                if (value > 15) return 'high-risk';
                if (value > 8) return 'moderate-risk';
                return 'low-risk';
            case 'racial':
                if (value > 8) return 'high-risk';
                if (value > 3) return 'moderate-risk';
                return 'low-risk';
            case 'unrepresented':
                if (value > 75) return 'high-risk';
                if (value > 65) return 'moderate-risk';
                return 'low-risk';
            default:
                return '';
        }
    }
    
    getCountyRecommendations(county) {
        const recommendations = [];
        
        if (county.counselDisparity > 15) {
            recommendations.push('• Increase public defender funding and staffing');
            recommendations.push('• Implement attorney performance monitoring');
        }
        
        if (county.racialDisparity > 8) {
            recommendations.push('• Mandatory judicial bias training');
            recommendations.push('• Statistical review of sentencing patterns');
        }
        
        if (county.unrepresented > 75) {
            recommendations.push('• Emergency public defense measures');
            recommendations.push('• Court delay reduction protocols');
        }
        
        if (county.prisonRate > 30) {
            recommendations.push('• Review sentencing guidelines compliance');
            recommendations.push('• Alternative sentencing program expansion');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('• Continue current best practices');
            recommendations.push('• Share successful strategies with other counties');
        }
        
        return '<ul>' + recommendations.join('<li>') + '</ul>';
    }
    
    applyFilters() {
        const dateRange = document.getElementById('date-range')?.value;
        const caseTypes = document.getElementById('case-types')?.value;
        const countyGroup = document.getElementById('county-group')?.value;
        
        // In a real implementation, this would filter and re-render data
        console.log('Applying filters:', { dateRange, caseTypes, countyGroup });
        
        // Show filter status
        const filterStatus = document.querySelector('.filter-status');
        if (filterStatus) {
            filterStatus.textContent = `Filters applied: ${[dateRange, caseTypes, countyGroup].filter(f => f && f !== 'all').join(', ') || 'None'}`;
        }
        
        // Re-render charts with filtered data
        this.renderCharts();
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateLiveData();
        }, 30000);
    }
    
    updateLiveData() {
        // Simulate small data changes
        this.oregonData.counties.forEach(county => {
            // Small random variations to simulate real-time updates
            county.unrepresented += (Math.random() - 0.5) * 0.2;
            county.unrepresented = Math.max(0, Math.min(100, county.unrepresented));
        });
        
        // Update timestamp
        const timestamp = document.querySelector('.last-updated');
        if (timestamp) {
            timestamp.textContent = `Last Updated: ${new Date().toLocaleString()}`;
        }
        
        // Re-render crisis trends chart
        this.renderCrisisTrendsChart();
    }
    
    toggleRealTimeUpdates(enabled) {
        if (enabled) {
            this.startRealTimeUpdates();
        } else {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BiasBeaconDashboard();
});

// Add CSS for modal and interactive elements
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    .county-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        background: #2c5aa0;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .county-detail-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .detail-stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .high-risk { color: #e74c3c; font-weight: bold; }
    .moderate-risk { color: #e67e22; font-weight: bold; }
    .low-risk { color: #27ae60; font-weight: bold; }
    
    .county-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .county-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .chart-container {
        position: relative;
        margin: 20px 0;
    }
    
    .filter-status {
        margin: 10px 0;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
        font-style: italic;
    }
`;
document.head.appendChild(dashboardStyles);

// Initialize dashboard when DOM is loaded
let dashboardInstance;

document.addEventListener('DOMContentLoaded', function() {
    dashboardInstance = new BiasBeaconDashboard();
    console.log('Enhanced Bias Beacon Dashboard with Judge Analysis initialized successfully');
});

// Export for global access
window.dashboardInstance = dashboardInstance;