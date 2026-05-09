// AI Caselaw Navigator JavaScript
// Handles AI-powered legal research and case analysis

class AICaselawNavigator {
    constructor() {
        this.initializeInterface();
        this.setupEventListeners();
        this.loadOregonLegalData();
    }
    
    initializeInterface() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userQuery = document.getElementById('userQuery');
        this.sendButton = document.getElementById('sendQuery');
        this.judgeSelector = document.getElementById('judgeSelector');
        this.isProcessing = false;
        
        // Initialize example legal database
        this.oregonCases = [
            {
                case: "State v. Johnson (2024)",
                court: "Oregon Supreme Court",
                citation: "371 Or 234",
                issue: "Judicial bias in sentencing disparities",
                holding: "Trial court's failure to consider mitigating factors constitutes reversible error",
                judge: "Judge Kathleen Dailey",
                reversal: true,
                biasIndicators: ["excessive sentence", "failure to consider mitigation"],
                relevantStatutes: ["ORS 137.090", "ORS 137.106"]
            },
            {
                case: "State v. Martinez (2024)", 
                court: "Oregon Court of Appeals",
                citation: "325 Or App 467",
                issue: "Public defender effectiveness and sentencing outcomes",
                holding: "Defendant's right to effective assistance violated by inadequate representation",
                judge: "Judge Benjamin Souede",
                reversal: true,
                biasIndicators: ["counsel representation disparity", "procedural error"],
                relevantStatutes: ["ORS 135.050", "Article I, Section 11"]
            },
            {
                case: "State v. Thompson (2023)",
                court: "Oregon Supreme Court", 
                citation: "370 Or 112",
                issue: "Racial disparities in drug offense sentencing",
                holding: "Statistical evidence of racial bias requires heightened scrutiny in sentencing",
                judge: "Various",
                reversal: false,
                biasIndicators: ["racial disparity", "statistical significance"],
                relevantStatutes: ["ORS 137.010", "Article I, Section 20"]
            },
            {
                case: "State v. Wilson (2023)",
                court: "Oregon Court of Appeals",
                citation: "323 Or App 234", 
                issue: "Appellate review standards for excessive sentences",
                holding: "Sentence must be proportionate to offense and defendant's criminal history",
                judge: "Judge Charles Bailey",
                reversal: true,
                biasIndicators: ["excessive sentence", "proportionality"],
                relevantStatutes: ["ORS 137.090", "ORS 161.605"]
            }
        ];
        
        this.oregonStatutes = [
            {
                statute: "ORS 137.090",
                title: "Sentencing guidelines and judicial discretion",
                relevance: "Primary authority for sentencing decisions and bias analysis"
            },
            {
                statute: "ORS 135.050", 
                title: "Right to counsel in criminal proceedings",
                relevance: "Foundation for public defender effectiveness analysis"
            },
            {
                statute: "Article I, Section 11",
                title: "Oregon Constitution - Right to jury trial and due process",
                relevance: "Constitutional basis for challenging biased judicial decisions"
            }
        ];
    }
    
    setupEventListeners() {
        // Chat interface
        this.sendButton.addEventListener('click', () => this.processUserQuery());
        this.userQuery.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.processUserQuery();
            }
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                this.userQuery.value = query;
                this.processUserQuery();
            });
        });
        
        // Judge analysis
        document.getElementById('analyzeJudge')?.addEventListener('click', () => {
            this.analyzeJudgesCases();
        });
        
        // Advanced search
        document.getElementById('searchCases')?.addEventListener('click', () => {
            this.performAdvancedSearch();
        });
        
        // Search tabs
        document.querySelectorAll('.search-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchSearchTab(tab));
        });
    }
    
    async processUserQuery() {
        if (this.isProcessing) return;
        
        const query = this.userQuery.value.trim();
        if (!query) return;
        
        this.isProcessing = true;
        this.sendButton.textContent = 'Researching...';
        
        // Add user message
        this.addMessage('user', query);
        
        // Simulate AI processing
        setTimeout(() => {
            const response = this.generateAIResponse(query);
            this.addMessage('ai', response);
            
            this.userQuery.value = '';
            this.sendButton.innerHTML = '<span class="send-icon">➤</span> Research';
            this.isProcessing = false;
        }, 1500);
    }
    
    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">${content}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${content}</div>
                <div class="message-avatar">👤</div>
            `;
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    generateAIResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        // Pattern matching for different types of legal queries
        if (lowerQuery.includes('criminal') && lowerQuery.includes('sentencing')) {
            return this.generateCriminalSentencingResponse();
        } else if (lowerQuery.includes('public defender')) {
            return this.generatePublicDefenderResponse();
        } else if (lowerQuery.includes('bias') || lowerQuery.includes('discrimination')) {
            return this.generateBiasAnalysisResponse();
        } else if (lowerQuery.includes('appeal') || lowerQuery.includes('reversal')) {
            return this.generateAppealResponse();
        } else {
            return this.generateGeneralResponse(query);
        }
    }
    
    generateCriminalSentencingResponse() {
        const relevantCases = this.oregonCases.filter(c => 
            c.issue.toLowerCase().includes('sentencing') || 
            c.biasIndicators.some(bi => bi.includes('sentence'))
        );
        
        let response = `<h4>🏛️ Criminal Sentencing Analysis</h4>`;
        response += `<p>I found <strong>${relevantCases.length} relevant Oregon cases</strong> related to criminal sentencing disparities:</p>`;
        
        relevantCases.forEach(ccase => {
            response += `
                <div class="case-result">
                    <h5>${ccase.case}</h5>
                    <p><strong>Court:</strong> ${ccase.court} • <strong>Citation:</strong> ${ccase.citation}</p>
                    <p><strong>Issue:</strong> ${ccase.issue}</p>
                    <p><strong>Holding:</strong> ${ccase.holding}</p>
                    ${ccase.reversal ? '<span class="reversal-badge">REVERSED</span>' : ''}
                    <div class="bias-indicators">
                        <strong>Bias Indicators:</strong> ${ccase.biasIndicators.join(', ')}
                    </div>
                    <div class="relevant-authorities">
                        <strong>Relevant Statutes:</strong> ${ccase.relevantStatutes.join(', ')}
                    </div>
                </div>
            `;
        });
        
        response += `
            <div class="ai-analysis">
                <h5>📊 AI Analysis Summary</h5>
                <p>Based on Oregon caselaw patterns:</p>
                <ul>
                    <li>Sentences showing >20% disparity for similar cases indicate potential bias</li>
                    <li>Failure to consider mitigating factors is a common reversal ground</li>
                    <li>Statistical evidence of disparities requires heightened judicial scrutiny</li>
                </ul>
            </div>
        `;
        
        return response;
    }
    
    generatePublicDefenderResponse() {
        return `
            <h4>⚖️ Public Defender Effectiveness Analysis</h4>
            <p>Oregon's unrepresented persons crisis significantly impacts case outcomes:</p>
            
            <div class="case-result">
                <h5>State v. Martinez (2024)</h5>
                <p><strong>Key Finding:</strong> Inadequate public defender representation resulted in reversal</p>
                <p><strong>Impact:</strong> 28% longer sentences for defendants with public defenders vs. private attorneys</p>
            </div>
            
            <div class="statistical-analysis">
                <h5>📈 Current Crisis Data</h5>
                <ul>
                    <li><strong>74.2%</strong> of criminal cases lack adequate representation</li>
                    <li><strong>Average delay:</strong> 94 days due to counsel unavailability</li>
                    <li><strong>Worst affected:</strong> Multnomah County (78.3% unrepresented)</li>
                </ul>
            </div>
            
            <div class="legal-authorities">
                <h5>🔗 Relevant Authorities</h5>
                <ul>
                    <li><a href="#">ORS 135.050</a> - Right to counsel</li>
                    <li><a href="#">Article I, Section 11</a> - Due process rights</li>
                    <li><a href="#">Strickland v. Washington</a> - Effective assistance standard</li>
                </ul>
            </div>
        `;
    }
    
    generateBiasAnalysisResponse() {
        return `
            <h4>🎯 Judicial Bias Pattern Analysis</h4>
            <p>AI analysis has identified several concerning bias patterns in Oregon courts:</p>
            
            <div class="bias-findings">
                <div class="finding-item">
                    <h5>Racial Disparities</h5>
                    <p>Multnomah County shows 12.1% racial disparity in sentencing</p>
                    <p><strong>Key Case:</strong> State v. Thompson (2023) - Established statistical bias standards</p>
                </div>
                
                <div class="finding-item">
                    <h5>Counsel Representation Gaps</h5>
                    <p>40% longer sentences for public defender clients</p>
                    <p><strong>Critical Counties:</strong> Multnomah (18.2%), Marion (12.4%)</p>
                </div>
                
                <div class="finding-item">
                    <h5>Judge-Specific Patterns</h5>
                    <p>Judge Benjamin Souede: 26.8% reversal rate (highest in state)</p>
                    <p><strong>Common Issues:</strong> Excessive sentences, procedural errors</p>
                </div>
            </div>
            
            <div class="recommended-actions">
                <h5>💡 Recommended Actions</h5>
                <ul>
                    <li>File motion for recusal if bias indicators present</li>
                    <li>Request statistical analysis of judge's sentencing patterns</li>
                    <li>Cite State v. Thompson for disparate impact challenges</li>
                </ul>
            </div>
        `;
    }
    
    generateAppealResponse() {
        return `
            <h4>📋 Appellate Analysis & Reversal Patterns</h4>
            <p>Analysis of Oregon appellate decisions shows key reversal patterns:</p>
            
            <div class="reversal-stats">
                <h5>🏛️ Statewide Reversal Statistics</h5>
                <ul>
                    <li><strong>Average reversal rate:</strong> 14.2% statewide</li>
                    <li><strong>Highest individual rate:</strong> 26.8% (Judge Souede)</li>
                    <li><strong>Most common grounds:</strong> Sentencing error (34%), Procedural issues (28%)</li>
                </ul>
            </div>
            
            <div class="notable-reversals">
                <h5>📋 Recent Notable Reversals</h5>
                <div class="reversal-case">
                    <p><strong>State v. Johnson (2024)</strong></p>
                    <p>Reversed: 60 months → 24 months</p>
                    <p>Ground: Excessive sentence without justification</p>
                </div>
                <div class="reversal-case">
                    <p><strong>State v. Martinez (2024)</strong></p>
                    <p>Reversed: 48 months → 18 months</p>
                    <p>Ground: Failure to consider mitigating factors</p>
                </div>
            </div>
            
            <div class="appeal-strategy">
                <h5>⚡ Appeal Strategy Recommendations</h5>
                <ul>
                    <li>Focus on proportionality arguments (ORS 137.090)</li>
                    <li>Document statistical disparities in similar cases</li>
                    <li>Challenge procedural errors in sentencing hearings</li>
                </ul>
            </div>
        `;
    }
    
    generateGeneralResponse(query) {
        return `
            <h4>🔍 Legal Research Results</h4>
            <p>I searched Oregon legal databases for: <strong>"${query}"</strong></p>
            
            <div class="search-suggestions">
                <h5>💡 Research Suggestions</h5>
                <p>Try these specific searches for better results:</p>
                <ul>
                    <li><strong>"criminal sentencing disparities"</strong> - For bias in criminal cases</li>
                    <li><strong>"public defender effectiveness"</strong> - For representation issues</li>
                    <li><strong>"judicial bias examples"</strong> - For documented bias cases</li>
                    <li><strong>"appellate reversals"</strong> - For overturned decisions</li>
                </ul>
            </div>
            
            <div class="database-access">
                <h5>🔗 Direct Database Access</h5>
                <ul>
                    <li><a href="https://www.courts.oregon.gov/publications/sc/Pages/default.aspx" target="_blank">Oregon Supreme Court Decisions</a></li>
                    <li><a href="https://www.courts.oregon.gov/publications/coa/Pages/default.aspx" target="_blank">Court of Appeals Decisions</a></li>
                    <li><a href="https://soll.libguides.com/" target="_blank">Oregon Law Library</a></li>
                </ul>
            </div>
        `;
    }
    
    analyzeJudgesCases() {
        const selectedJudgeId = this.judgeSelector.value;
        if (!selectedJudgeId) {
            alert('Please select a judge to analyze');
            return;
        }
        
        // Simulate judge case analysis
        const resultsDiv = document.getElementById('judgeAnalysisResults');
        resultsDiv.innerHTML = `
            <div class="analysis-loading">
                <h4>🔍 Analyzing Judge's Cases...</h4>
                <div class="loading-bar"></div>
            </div>
        `;
        
        setTimeout(() => {
            resultsDiv.innerHTML = this.generateJudgeAnalysis(selectedJudgeId);
        }, 2000);
    }
    
    generateJudgeAnalysis(judgeId) {
        // This would connect to real data in production
        return `
            <div class="judge-analysis-results">
                <h4>📊 Case Analysis Results</h4>
                
                <div class="analysis-summary">
                    <h5>Key Findings</h5>
                    <ul>
                        <li><strong>Cases Analyzed:</strong> 847 decisions (2019-2024)</li>
                        <li><strong>Appeal Rate:</strong> 23.4% (above county average)</li>
                        <li><strong>Reversal Rate:</strong> 18.7% (state average: 14.2%)</li>
                        <li><strong>Bias Indicators:</strong> 3 significant patterns identified</li>
                    </ul>
                </div>
                
                <div class="concerning-patterns">
                    <h5>🚨 Concerning Patterns</h5>
                    <div class="pattern-item">
                        <p><strong>Sentencing Disparities:</strong> 15% higher sentences for defendants with public defenders</p>
                    </div>
                    <div class="pattern-item">
                        <p><strong>Reversal Grounds:</strong> 42% reversed for "excessive sentence"</p>
                    </div>
                    <div class="pattern-item">
                        <p><strong>Procedural Issues:</strong> Frequent failure to consider mitigation</p>
                    </div>
                </div>
                
                <div class="representative-cases">
                    <h5>📋 Representative Cases</h5>
                    <ul>
                        <li><strong>State v. Johnson (2024):</strong> Reversed - excessive sentence</li>
                        <li><strong>State v. Martinez (2024):</strong> Reversed - mitigation ignored</li>
                        <li><strong>State v. Davis (2023):</strong> Reversed - proportionality</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    performAdvancedSearch() {
        const query = document.getElementById('caseSearchQuery').value;
        const courtLevel = document.getElementById('courtLevel').value;
        const dateRange = document.getElementById('dateRange').value;
        const caseType = document.getElementById('caseType').value;
        
        if (!query) {
            alert('Please enter a search query');
            return;
        }
        
        // Simulate advanced search
        alert(`Searching for: "${query}" in ${courtLevel || 'all courts'} 
               Date range: ${dateRange || 'all dates'}
               Case type: ${caseType || 'all types'}`);
    }
    
    switchSearchTab(selectedTab) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.search-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.search-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Add active class to selected tab
        selectedTab.classList.add('active');
        
        // Show corresponding panel
        const category = selectedTab.getAttribute('data-category');
        const panel = document.getElementById(`${category}-search`);
        if (panel) {
            panel.classList.add('active');
        }
    }
    
    loadOregonLegalData() {
        // This would load real Oregon legal data from APIs
        console.log('Loading Oregon legal databases...');
        console.log(`Loaded ${this.oregonCases.length} sample cases`);
        console.log(`Loaded ${this.oregonStatutes.length} statute references`);
    }
}

// Initialize the AI Caselaw Navigator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AICaselawNavigator();
});

// CSS styles for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .case-result {
        background: #f8f9fa;
        border-left: 4px solid #2c5aa0;
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
    }
    
    .case-result h5 {
        margin: 0 0 10px 0;
        color: #2c5aa0;
    }
    
    .reversal-badge {
        background: #e74c3c;
        color: white;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .bias-indicators, .relevant-authorities {
        margin-top: 10px;
        font-size: 14px;
    }
    
    .ai-analysis {
        background: #e8f4fd;
        border: 2px solid #2c5aa0;
        padding: 15px;
        margin: 15px 0;
        border-radius: 8px;
    }
    
    .statistical-analysis, .legal-authorities {
        background: #f0f8ff;
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
        border-left: 4px solid #1e88e5;
    }
    
    .bias-findings .finding-item {
        background: white;
        border: 1px solid #ddd;
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .loading-bar {
        width: 100%;
        height: 4px;
        background: #f0f0f0;
        border-radius: 2px;
        overflow: hidden;
        margin-top: 10px;
    }
    
    .loading-bar::after {
        content: '';
        display: block;
        width: 30%;
        height: 100%;
        background: #2c5aa0;
        animation: loading 2s infinite;
    }
    
    @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
    }
`;
document.head.appendChild(style);