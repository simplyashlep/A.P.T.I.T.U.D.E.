// Counties Comparison JavaScript
// Interactive county comparison and analysis tools

class CountyComparison {
    constructor() {
        this.selectedCounties = [];
        this.oregonCountyData = {};
        this.initialize();
    }
    
    initialize() {
        this.loadCountyData();
        this.setupEventListeners();
        this.setupRankingTabs();
    }
    
    loadCountyData() {
        // Sample Oregon county data - in production this would come from live APIs
        this.oregonCountyData = {
            'multnomah': {
                name: 'Multnomah',
                population: 815428,
                judges: 47,
                cases2024: 18947,
                prisonRate: 32.4,
                racialDisparity: 12.1,
                counselDisparity: 18.2,
                unrepresented: 78.3,
                riskLevel: 'critical',
                region: 'metro',
                judges_list: ['Judge Kathleen Dailey', 'Judge Benjamin Souede'],
                keyIssues: ['Highest unrepresented rate statewide', 'Significant counsel representation disparity', 'High reversal rates']
            },
            'washington': {
                name: 'Washington',
                population: 695115,
                judges: 23,
                cases2024: 12834,
                prisonRate: 29.1,
                racialDisparity: 2.4,
                counselDisparity: 8.3,
                unrepresented: 67.9,
                riskLevel: 'moderate',
                region: 'metro',
                judges_list: ['Judge Michael Chen', 'Judge Charles Bailey'],
                keyIssues: ['Moderate counsel disparities', 'Urban case volume challenges']
            },
            'lane': {
                name: 'Lane',
                population: 382067,
                judges: 15,
                cases2024: 8923,
                prisonRate: 24.3,
                racialDisparity: -1.1,
                counselDisparity: 1.8,
                unrepresented: 64.2,
                riskLevel: 'excellent',
                region: 'valley',
                judges_list: ['Judge Debra Vogt'],
                keyIssues: ['Best practices model', 'Equity-focused sentencing']
            },
            'marion': {
                name: 'Marion',
                population: 345920,
                judges: 14,
                cases2024: 11247,
                prisonRate: 31.8,
                racialDisparity: 8.7,
                counselDisparity: 12.4,
                unrepresented: 71.8,
                riskLevel: 'high',
                region: 'valley',
                judges_list: ['Judge Patricia Davis'],
                keyIssues: ['High prison rates', 'Significant racial disparities']
            }
        };
    }
    
    setupEventListeners() {
        // County comparison selectors
        const county1Select = document.getElementById('county1');
        const county2Select = document.getElementById('county2');
        const compareButton = document.getElementById('compareButton');
        
        if (compareButton) {
            compareButton.addEventListener('click', () => {
                const county1 = county1Select ? county1Select.value : null;
                const county2 = county2Select ? county2Select.value : null;
                
                if (county1 && county2 && county1 !== county2) {
                    this.compareCounties(county1, county2);
                } else {
                    alert('Please select two different counties to compare.');
                }
            });
        }
        
        // County card clicks
        document.querySelectorAll('.county-profile-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('view-details-btn') && 
                    !e.target.classList.contains('compare-btn')) {
                    const county = card.getAttribute('data-county');
                    this.showCountyModal(county);
                }
            });
        });
        
        // Ranking buttons
        document.querySelectorAll('.ranking-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const metric = e.target.getAttribute('data-metric');
                this.switchRanking(metric);
            });
        });
    }
    
    setupRankingTabs() {
        // Initialize ranking display
        this.switchRanking('severity');
    }
    
    switchRanking(metric) {
        // Update active button
        document.querySelectorAll('.ranking-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-metric="${metric}"]`).classList.add('active');
        
        // Show corresponding ranking category
        document.querySelectorAll('.ranking-category').forEach(category => {
            category.classList.remove('active');
        });
        
        let targetId;
        switch(metric) {
            case 'severity':
                targetId = 'prison-rate-ranking';
                break;
            case 'disparity':
                targetId = 'racial-disparity-ranking';
                break;
            case 'representation':
                targetId = 'counsel-disparity-ranking';
                break;
            default:
                targetId = 'prison-rate-ranking';
        }
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    }
    
    compareCounties(county1Id, county2Id) {
        const county1 = this.oregonCountyData[county1Id.toLowerCase()];
        const county2 = this.oregonCountyData[county2Id.toLowerCase()];
        
        if (!county1 || !county2) {
            alert('County data not available for comparison.');
            return;
        }
        
        const resultsDiv = document.getElementById('comparisonResults');
        if (!resultsDiv) return;
        
        resultsDiv.innerHTML = this.generateComparisonHTML(county1, county2);
    }
    
    generateComparisonHTML(county1, county2) {
        return `
            <div class="comparison-result">
                <div class="comparison-header">
                    <h4>${county1.name} County vs ${county2.name} County</h4>
                    <div class="comparison-summary">
                        <span class="winner ${county1.riskLevel === 'excellent' || county1.prisonRate < county2.prisonRate ? 'county1' : 'county2'}">
                            ${county1.prisonRate < county2.prisonRate ? county1.name + ' has lower prison rates' : county2.name + ' has lower prison rates'}
                        </span>
                    </div>
                </div>
                
                <div class="comparison-metrics">
                    <div class="metric-comparison">
                        <h5>📊 Prison Rate</h5>
                        <div class="metric-values">
                            <div class="county1-value ${county1.prisonRate < county2.prisonRate ? 'better' : 'worse'}">
                                <span class="county-name">${county1.name}:</span>
                                <span class="value">${county1.prisonRate}%</span>
                            </div>
                            <div class="county2-value ${county2.prisonRate < county1.prisonRate ? 'better' : 'worse'}">
                                <span class="county-name">${county2.name}:</span>
                                <span class="value">${county2.prisonRate}%</span>
                            </div>
                        </div>
                        <div class="difference">
                            Difference: ${Math.abs(county1.prisonRate - county2.prisonRate).toFixed(1)} percentage points
                        </div>
                    </div>
                    
                    <div class="metric-comparison">
                        <h5>⚖️ Racial Disparity</h5>
                        <div class="metric-values">
                            <div class="county1-value ${Math.abs(county1.racialDisparity) < Math.abs(county2.racialDisparity) ? 'better' : 'worse'}">
                                <span class="county-name">${county1.name}:</span>
                                <span class="value">${county1.racialDisparity}</span>
                            </div>
                            <div class="county2-value ${Math.abs(county2.racialDisparity) < Math.abs(county1.racialDisparity) ? 'better' : 'worse'}">
                                <span class="county-name">${county2.name}:</span>
                                <span class="value">${county2.racialDisparity}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-comparison">
                        <h5>👥 Counsel Disparity</h5>
                        <div class="metric-values">
                            <div class="county1-value ${county1.counselDisparity < county2.counselDisparity ? 'better' : 'worse'}">
                                <span class="county-name">${county1.name}:</span>
                                <span class="value">${county1.counselDisparity}</span>
                            </div>
                            <div class="county2-value ${county2.counselDisparity < county1.counselDisparity ? 'better' : 'worse'}">
                                <span class="county-name">${county2.name}:</span>
                                <span class="value">${county2.counselDisparity}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-comparison">
                        <h5>🚨 Unrepresented Crisis</h5>
                        <div class="metric-values">
                            <div class="county1-value ${county1.unrepresented < county2.unrepresented ? 'better' : 'worse'}">
                                <span class="county-name">${county1.name}:</span>
                                <span class="value">${county1.unrepresented}%</span>
                            </div>
                            <div class="county2-value ${county2.unrepresented < county1.unrepresented ? 'better' : 'worse'}">
                                <span class="county-name">${county2.name}:</span>
                                <span class="value">${county2.unrepresented}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="comparison-demographics">
                    <div class="demo-comparison">
                        <h5>📊 Demographics & Scale</h5>
                        <div class="demo-stats">
                            <div class="demo-stat">
                                <span class="label">Population:</span>
                                <span class="county1">${county1.population.toLocaleString()}</span>
                                <span class="vs">vs</span>
                                <span class="county2">${county2.population.toLocaleString()}</span>
                            </div>
                            <div class="demo-stat">
                                <span class="label">Judges:</span>
                                <span class="county1">${county1.judges}</span>
                                <span class="vs">vs</span>
                                <span class="county2">${county2.judges}</span>
                            </div>
                            <div class="demo-stat">
                                <span class="label">2024 Cases:</span>
                                <span class="county1">${county1.cases2024.toLocaleString()}</span>
                                <span class="vs">vs</span>
                                <span class="county2">${county2.cases2024.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="comparison-recommendations">
                    <h5>💡 Key Differences & Recommendations</h5>
                    <div class="recommendations-grid">
                        <div class="county1-recommendations">
                            <h6>${county1.name} County</h6>
                            <ul>
                                ${county1.keyIssues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="county2-recommendations">
                            <h6>${county2.name} County</h6>
                            <ul>
                                ${county2.keyIssues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    showCountyModal(countyId) {
        const county = this.oregonCountyData[countyId.toLowerCase()];
        if (!county) return;
        
        const modal = document.createElement('div');
        modal.className = 'county-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${county.name} County - Detailed Analysis</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="county-overview">
                        <div class="overview-stats">
                            <div class="overview-stat">
                                <label>Population:</label>
                                <span>${county.population.toLocaleString()}</span>
                            </div>
                            <div class="overview-stat">
                                <label>Active Judges:</label>
                                <span>${county.judges}</span>
                            </div>
                            <div class="overview-stat">
                                <label>2024 Cases:</label>
                                <span>${county.cases2024.toLocaleString()}</span>
                            </div>
                            <div class="overview-stat">
                                <label>Risk Level:</label>
                                <span class="risk-badge ${county.riskLevel}">${county.riskLevel.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bias-analysis">
                        <h4>Bias Analysis</h4>
                        <div class="bias-metrics-detailed">
                            <div class="bias-metric-detail">
                                <div class="metric-label">Prison Rate</div>
                                <div class="metric-bar">
                                    <div class="bar-fill" style="width: ${(county.prisonRate / 40) * 100}%"></div>
                                </div>
                                <div class="metric-value">${county.prisonRate}%</div>
                            </div>
                            
                            <div class="bias-metric-detail">
                                <div class="metric-label">Racial Disparity</div>
                                <div class="metric-bar">
                                    <div class="bar-fill ${county.racialDisparity > 8 ? 'high' : county.racialDisparity > 3 ? 'medium' : 'low'}" 
                                         style="width: ${Math.min((Math.abs(county.racialDisparity) / 15) * 100, 100)}%"></div>
                                </div>
                                <div class="metric-value">${county.racialDisparity}</div>
                            </div>
                            
                            <div class="bias-metric-detail">
                                <div class="metric-label">Counsel Disparity</div>
                                <div class="metric-bar">
                                    <div class="bar-fill ${county.counselDisparity > 15 ? 'high' : county.counselDisparity > 8 ? 'medium' : 'low'}" 
                                         style="width: ${(county.counselDisparity / 20) * 100}%"></div>
                                </div>
                                <div class="metric-value">${county.counselDisparity}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="crisis-status">
                        <h4>Unrepresented Persons Crisis</h4>
                        <div class="crisis-indicator-large ${county.unrepresented > 75 ? 'emergency' : county.unrepresented > 65 ? 'critical' : 'manageable'}">
                            <div class="crisis-percentage">${county.unrepresented}%</div>
                            <div class="crisis-label">Cases Unrepresented</div>
                            <div class="crisis-status-text">
                                ${county.unrepresented > 75 ? '🚨 EMERGENCY LEVEL' : 
                                  county.unrepresented > 65 ? '⚠️ CRITICAL LEVEL' : 
                                  'ℹ️ MANAGEABLE LEVEL'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="judges-section">
                        <h4>Notable Judges</h4>
                        <div class="judges-list">
                            ${county.judges_list.map(judge => `
                                <div class="judge-item">
                                    <span class="judge-name">${judge}</span>
                                    <button class="view-judge-btn" onclick="window.location.href='/bias-beacon/judges/'">View Profile</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="key-issues">
                        <h4>Key Issues</h4>
                        <ul class="issues-list">
                            ${county.keyIssues.map(issue => `<li>${issue}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
}

// Global functions for inline event handlers
function showCountyDetails(countyId) {
    if (window.countyComparison) {
        window.countyComparison.showCountyModal(countyId);
    }
}

function addToComparison(countyId) {
    // Add county to comparison list
    const county1Select = document.getElementById('county1');
    const county2Select = document.getElementById('county2');
    
    if (county1Select && !county1Select.value) {
        county1Select.value = countyId;
    } else if (county2Select && !county2Select.value) {
        county2Select.value = countyId;
    }
    
    // Scroll to comparison tool
    document.querySelector('.comparison-tool').scrollIntoView({ behavior: 'smooth' });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.countyComparison = new CountyComparison();
});

// Add CSS styles for modal and interactive elements
const countyStyles = document.createElement('style');
countyStyles.textContent = `
    .county-detail-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    .modal-header {
        background: linear-gradient(135deg, #2c5aa0, #1e4080);
        color: white;
        padding: 20px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 28px;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .modal-close:hover {
        background: rgba(255,255,255,0.2);
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .overview-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 25px;
    }
    
    .overview-stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #2c5aa0;
    }
    
    .bias-metrics-detailed {
        space-y: 15px;
    }
    
    .bias-metric-detail {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }
    
    .metric-label {
        min-width: 120px;
        font-weight: 600;
    }
    
    .metric-bar {
        flex: 1;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .bar-fill {
        height: 100%;
        background: #2c5aa0;
        border-radius: 10px;
        transition: width 0.5s ease;
    }
    
    .bar-fill.high { background: #e74c3c; }
    .bar-fill.medium { background: #f39c12; }
    .bar-fill.low { background: #27ae60; }
    
    .crisis-indicator-large {
        text-align: center;
        padding: 30px;
        border-radius: 12px;
        margin: 20px 0;
    }
    
    .crisis-indicator-large.emergency {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
    }
    
    .crisis-indicator-large.critical {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
    }
    
    .crisis-indicator-large.manageable {
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
    }
    
    .crisis-percentage {
        font-size: 3em;
        font-weight: bold;
        margin-bottom: 10px;
    }
    
    .crisis-label {
        font-size: 1.2em;
        margin-bottom: 5px;
    }
    
    .judges-list {
        space-y: 10px;
    }
    
    .judge-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
        margin-bottom: 10px;
    }
    
    .view-judge-btn {
        background: #2c5aa0;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .issues-list {
        list-style: none;
        padding: 0;
    }
    
    .issues-list li {
        padding: 10px;
        margin-bottom: 8px;
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        border-radius: 4px;
    }
    
    .comparison-result {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin-top: 20px;
    }
    
    .comparison-metrics {
        display: grid;
        gap: 20px;
        margin: 20px 0;
    }
    
    .metric-comparison {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 15px;
    }
    
    .metric-values {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 10px 0;
    }
    
    .county1-value, .county2-value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-radius: 6px;
    }
    
    .county1-value.better, .county2-value.better {
        background: #d4edda;
        border-left: 4px solid #28a745;
    }
    
    .county1-value.worse, .county2-value.worse {
        background: #f8d7da;
        border-left: 4px solid #dc3545;
    }
    
    .ranking-category {
        display: none;
    }
    
    .ranking-category.active {
        display: block;
    }
    
    .ranking-item {
        display: flex;
        align-items: center;
        padding: 15px;
        margin: 10px 0;
        border-radius: 8px;
        border-left: 5px solid #2c5aa0;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
    }
    
    .ranking-item:hover {
        transform: translateX(5px);
    }
    
    .ranking-item.critical {
        border-left-color: #e74c3c;
    }
    
    .ranking-item.high {
        border-left-color: #e67e22;
    }
    
    .ranking-item.moderate {
        border-left-color: #f39c12;
    }
    
    .ranking-item.excellent {
        border-left-color: #27ae60;
    }
    
    .rank-number {
        font-size: 1.5em;
        font-weight: bold;
        color: #2c5aa0;
        margin-right: 15px;
        min-width: 30px;
    }
    
    .county-info {
        flex: 1;
    }
    
    .county-info h5 {
        margin: 0 0 5px 0;
        color: #2c3e50;
    }
    
    .primary-stat {
        font-size: 1.2em;
        font-weight: bold;
        color: #e74c3c;
    }
    
    .secondary-stats {
        font-size: 0.9em;
        color: #6c757d;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(countyStyles);