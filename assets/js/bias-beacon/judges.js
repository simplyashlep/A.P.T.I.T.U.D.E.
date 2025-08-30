// Bias Beacon - Comprehensive Judge Analysis System
// Handles dropdown selection, search, filtering, and comparison functionality

class JudgeAnalysisSystem {
    constructor() {
        this.judges = [];
        this.filteredJudges = [];
        this.selectedJudges = [];
        this.comparisonJudges = [];
        
        this.initializeSystem();
    }
    
    initializeSystem() {
        this.loadJudgeData();
        this.setupEventListeners();
        this.populateDropdowns();
        this.setupFilters();
        this.initializeHeatMap();
    }
    
    loadJudgeData() {
        // Extract judge data from DOM elements
        const judgeCards = document.querySelectorAll('.judge-card');
        
        judgeCards.forEach(card => {
            const judge = {
                id: card.dataset.id,
                name: card.dataset.name,
                county: card.dataset.county,
                department: card.dataset.department,
                risk: card.dataset.risk,
                period: card.dataset.period,
                element: card,
                data: this.extractJudgeDataFromCard(card)
            };
            
            this.judges.push(judge);
        });
        
        this.filteredJudges = [...this.judges];
        console.log(`Loaded ${this.judges.length} judges into system`);
    }
    
    extractJudgeDataFromCard(card) {
        // Extract detailed judge data from the card HTML
        const data = {
            name: card.querySelector('h3').textContent,
            county: this.extractDetail(card, 'Court:'),
            department: this.extractDetail(card, 'Department:'),
            tenure: this.extractDetail(card, 'Tenure:'),
            caseload: this.extractDetail(card, '2024 Caseload:'),
            prisonRate: this.extractMetric(card, 'Prison Rate:'),
            racialDisparity: this.extractMetric(card, 'Racial Disparity Score:'),
            counselDisparity: this.extractMetric(card, 'Counsel Disparity Score:'),
            appeals: this.extractAppealsData(card),
            representation: this.extractRepresentationData(card),
            specialization: this.extractSpecialization(card)
        };
        
        return data;
    }
    
    extractDetail(card, label) {
        const element = Array.from(card.querySelectorAll('p')).find(p => p.textContent.includes(label));
        return element ? element.textContent.replace(label, '').trim() : 'N/A';
    }
    
    extractMetric(card, label) {
        const element = Array.from(card.querySelectorAll('.metric-label')).find(el => el.textContent === label);
        if (element) {
            const valueEl = element.nextElementSibling;
            return valueEl ? parseFloat(valueEl.textContent) : 0;
        }
        return 0;
    }
    
    extractAppealsData(card) {
        const appealsSection = card.querySelector('.appellate-record');
        if (!appealsSection) return { total: 0, reversal_rate: 0 };
        
        const appealsText = appealsSection.querySelector('.appeals-count')?.textContent || '0 appeals';
        const reversalText = appealsSection.querySelector('.reversal-rate')?.textContent || '0% reversed';
        
        return {
            total: parseInt(appealsText.match(/\\d+/) || [0])[0],
            reversal_rate: parseFloat(reversalText.match(/[\\d.]+/) || [0])[0]
        };
    }
    
    extractRepresentationData(card) {
        const repSection = card.querySelector('.representation-breakdown');
        if (!repSection) return null;
        
        const repTypes = repSection.querySelectorAll('.rep-type');
        const data = {};
        
        repTypes.forEach(type => {
            const label = type.querySelector('.rep-label').textContent.replace(':', '').toLowerCase().replace('-', '_');
            const count = type.querySelector('.rep-count').textContent;
            const outcome = type.querySelector('.rep-outcome').textContent;
            
            data[label] = {
                count: parseInt(count.match(/\\d+/) || [0])[0],
                percentage: parseFloat(count.match(/\\((\\d+\\.?\\d*)%\\)/) || [0, 0])[1],
                avg_sentence: parseFloat(outcome.match(/Avg: ([\\d.]+)mo/) || [0, 0])[1],
                conviction_rate: parseFloat(outcome.match(/([\\d.]+)% conviction/) || [0, 0])[1]
            };
        });
        
        return data;
    }
    
    extractSpecialization(card) {
        const specElement = card.querySelector('.specialization');
        if (!specElement) return [];
        
        const specText = specElement.textContent.replace('Specializes in:', '').trim();
        return specText.split(',').map(s => s.trim());
    }
    
    setupEventListeners() {
        // Judge dropdown selection
        const judgeDropdown = document.getElementById('judge-dropdown');
        if (judgeDropdown) {
            judgeDropdown.addEventListener('change', (e) => {
                this.selectJudge(e.target.value);
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('judge-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
        
        // Filter controls
        ['county-filter', 'time-period-filter', 'risk-filter', 'department-filter'].forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });
        
        // Comparison tool buttons
        const compareBtn = document.getElementById('compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.startComparison());
        }
        
        const clearBtn = document.getElementById('clear-comparison');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearComparison());
        }
        
        // Judge card action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-details-btn')) {
                this.viewJudgeDetails(e.target.dataset.judgeId);
            } else if (e.target.classList.contains('add-compare-btn')) {
                this.addToComparison(e.target.dataset.judgeId, e.target.dataset.judgeName);
            }
        });
        
        // Heat map controls
        const heatMapRefresh = document.getElementById('heat-map-refresh');
        if (heatMapRefresh) {
            heatMapRefresh.addEventListener('click', () => this.updateHeatMap());
        }
        
        const heatMapMetric = document.getElementById('heat-map-metric');
        const heatMapView = document.getElementById('heat-map-view');
        if (heatMapMetric) {
            heatMapMetric.addEventListener('change', () => this.updateHeatMap());
        }
        if (heatMapView) {
            heatMapView.addEventListener('change', () => this.updateHeatMap());
        }
    }
    
    populateDropdowns() {
        // Main judge dropdown
        const judgeDropdown = document.getElementById('judge-dropdown');
        if (judgeDropdown) {
            this.judges.forEach(judge => {
                const option = new Option(
                    `${judge.name} (${judge.county.charAt(0).toUpperCase() + judge.county.slice(1)} County)`,
                    judge.id
                );
                judgeDropdown.add(option);
            });
        }
        
        // Comparison dropdowns
        ['compare-judge-1', 'compare-judge-2', 'compare-judge-3'].forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            if (selector) {
                this.judges.forEach(judge => {
                    const option = new Option(
                        `${judge.name} (${judge.county.charAt(0).toUpperCase() + judge.county.slice(1)})`,
                        judge.id
                    );
                    selector.add(option.cloneNode(true));
                });
            }
        });
    }
    
    selectJudge(judgeId) {
        if (!judgeId) {
            this.hideSelectedJudgeProfile();
            return;
        }
        
        const judge = this.judges.find(j => j.id === judgeId);
        if (judge) {
            this.displayJudgeProfile(judge);
            this.scrollToElement(judge.element);
            this.highlightJudgeCard(judge.element);
        }
    }
    
    displayJudgeProfile(judge) {
        const profileContainer = document.getElementById('selected-judge-profile');
        if (!profileContainer) return;
        
        const profileHTML = this.generateDetailedProfile(judge);
        profileContainer.innerHTML = profileHTML;
        profileContainer.style.display = 'block';
        
        // Scroll to profile
        profileContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    generateDetailedProfile(judge) {
        const data = judge.data;
        
        return `
            <div class=\"detailed-judge-profile\">
                <div class=\"profile-header\">
                    <h2>${data.name}</h2>
                    <div class=\"risk-badge ${judge.risk}\">${judge.risk.toUpperCase()}</div>
                </div>
                
                <div class=\"profile-content\">
                    <div class=\"profile-section\">
                        <h3>📊 Key Metrics Summary</h3>
                        <div class=\"metrics-grid\">
                            <div class=\"metric-card\">
                                <div class=\"metric-value\">${data.prisonRate}%</div>
                                <div class=\"metric-label\">Prison Rate</div>
                            </div>
                            <div class=\"metric-card\">
                                <div class=\"metric-value\">${data.racialDisparity}</div>
                                <div class=\"metric-label\">Racial Disparity Score</div>
                            </div>
                            <div class=\"metric-card\">
                                <div class=\"metric-value\">${data.counselDisparity}</div>
                                <div class=\"metric-label\">Counsel Disparity Score</div>
                            </div>
                            <div class=\"metric-card\">
                                <div class=\"metric-value\">${data.appeals.reversal_rate}%</div>
                                <div class=\"metric-label\">Reversal Rate</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class=\"profile-section\">
                        <h3>⚖️ Representation Type Analysis</h3>
                        ${this.generateRepresentationChart(data.representation)}
                    </div>
                    
                    <div class=\"profile-section\">
                        <h3>📈 Bias Analysis Explanation</h3>
                        ${this.generateBiasExplanation(judge)}
                    </div>
                    
                    <div class=\"profile-actions\">
                        <button onclick=\"judgeSystem.addToComparison('${judge.id}', '${data.name}')\">Add to Comparison</button>
                        <button onclick=\"judgeSystem.hideSelectedJudgeProfile()\">Close Profile</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateRepresentationChart(repData) {
        if (!repData) return '<p>No representation data available.</p>';
        
        let html = '<div class=\"rep-chart\">';
        
        Object.keys(repData).forEach(repType => {
            const data = repData[repType];
            const displayName = repType.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase());
            
            html += `
                <div class=\"rep-bar\">
                    <div class=\"rep-label\">${displayName}</div>
                    <div class=\"rep-visual\">
                        <div class=\"bar\" style=\"width: ${data.percentage}%\"></div>
                        <span class=\"rep-stats\">${data.count} cases (${data.percentage}%) - Avg: ${data.avg_sentence}mo, ${data.conviction_rate}% conviction</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    generateBiasExplanation(judge) {
        const racialScore = judge.data.racialDisparity;
        const counselScore = judge.data.counselDisparity;
        
        let explanation = '<div class=\"bias-explanation\">';
        
        // Racial disparity explanation
        explanation += '<div class=\"bias-item\">';
        explanation += '<h4>Racial Disparity Analysis</h4>';
        explanation += `<p><strong>Score: ${racialScore}</strong> - `;
        
        if (racialScore < 0) {
            explanation += 'This judge shows a slight equity advantage, meaning non-white defendants receive slightly better outcomes than white defendants.</p>';
        } else if (racialScore <= 3) {
            explanation += 'This score indicates minimal racial disparity in sentencing patterns.</p>';
        } else if (racialScore <= 7) {
            explanation += 'This score indicates moderate concern regarding racial disparities in sentencing.</p>';
        } else if (racialScore <= 12) {
            explanation += 'This score indicates high concern regarding racial disparities in sentencing patterns.</p>';
        } else {
            explanation += 'This score indicates critical levels of racial disparity that require immediate attention.</p>';
        }
        explanation += '</div>';
        
        // Counsel disparity explanation
        explanation += '<div class=\"bias-item\">';
        explanation += '<h4>Representation Type Disparity</h4>';
        explanation += `<p><strong>Score: ${counselScore}</strong> - `;
        
        if (counselScore < 2) {
            explanation += 'Excellent: Minimal disparity between representation types.</p>';
        } else if (counselScore <= 5) {
            explanation += 'Low concern: Some disparity exists but within acceptable ranges.</p>';
        } else if (counselScore <= 10) {
            explanation += 'Moderate concern: Notable disparities between self-represented and retained counsel outcomes.</p>';
        } else if (counselScore <= 15) {
            explanation += 'High concern: Significant disparities that may indicate systemic issues.</p>';
        } else {
            explanation += 'Critical: Extreme disparities between representation types requiring immediate review.</p>';
        }
        explanation += '</div>';
        
        explanation += '</div>';
        return explanation;
    }
    
    performSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredJudges = [...this.judges];
            this.applyFilters();
            return;
        }
        
        const term = searchTerm.toLowerCase();
        this.filteredJudges = this.judges.filter(judge => {
            return judge.name.toLowerCase().includes(term) ||
                   judge.county.toLowerCase().includes(term) ||
                   judge.department.toLowerCase().includes(term) ||
                   judge.data.specialization.some(spec => spec.toLowerCase().includes(term));
        });
        
        this.applyFilters();
    }
    
    applyFilters() {
        const countyFilter = document.getElementById('county-filter')?.value;
        const periodFilter = document.getElementById('time-period-filter')?.value;
        const riskFilter = document.getElementById('risk-filter')?.value;
        const departmentFilter = document.getElementById('department-filter')?.value;
        
        let filtered = [...this.filteredJudges];
        
        if (countyFilter) {
            filtered = filtered.filter(judge => judge.county === countyFilter);
        }
        
        if (periodFilter) {
            filtered = filtered.filter(judge => {
                if (periodFilter === '2024-active') {
                    return judge.period.includes('2024');
                } else if (periodFilter === '2019-2024') {
                    return judge.period.includes('2019') || judge.period.includes('2020') || judge.period.includes('2021') || judge.period.includes('2022') || judge.period.includes('2023') || judge.period.includes('2024');
                } else if (periodFilter === '2014-2018') {
                    return judge.period.includes('2014') || judge.period.includes('2015') || judge.period.includes('2016') || judge.period.includes('2017') || judge.period.includes('2018');
                }
                return true;
            });
        }
        
        if (riskFilter) {
            filtered = filtered.filter(judge => judge.risk === riskFilter);
        }
        
        if (departmentFilter) {
            filtered = filtered.filter(judge => judge.department.includes(departmentFilter));
        }
        
        this.displayFilteredJudges(filtered);
    }
    
    displayFilteredJudges(filtered) {
        // Show/hide judge cards based on filtered results
        this.judges.forEach(judge => {
            const isVisible = filtered.includes(judge);
            judge.element.style.display = isVisible ? 'block' : 'none';
        });
        
        // Update results count
        this.updateResultsCount(filtered.length);
    }
    
    updateResultsCount(count) {
        let countElement = document.getElementById('results-count');
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.id = 'results-count';
            countElement.className = 'results-count';
            
            const judgesList = document.getElementById('judges-list');
            if (judgesList) {
                judgesList.parentNode.insertBefore(countElement, judgesList);
            }
        }
        
        countElement.textContent = `Showing ${count} of ${this.judges.length} judges`;
    }
    
    addToComparison(judgeId, judgeName) {
        if (this.comparisonJudges.length >= 3) {
            alert('Maximum of 3 judges can be compared at once.');
            return;
        }
        
        if (this.comparisonJudges.find(j => j.id === judgeId)) {
            alert('This judge is already in the comparison.');
            return;
        }
        
        const judge = this.judges.find(j => j.id === judgeId);
        if (judge) {
            this.comparisonJudges.push(judge);
            this.updateComparisonPanel();
            
            // Show success message
            this.showMessage(`${judgeName} added to comparison (${this.comparisonJudges.length}/3)`);
        }
    }
    
    updateComparisonPanel() {
        const selectedJudgesArea = document.getElementById('selected-judges');
        const compareBtn = document.getElementById('compare-btn');
        
        if (!selectedJudgesArea) return;
        
        if (this.comparisonJudges.length === 0) {
            selectedJudgesArea.innerHTML = '<p class="comparison-help">Click "Add to Compare" on judge cards to compare up to 3 judges side-by-side</p>';
            if (compareBtn) compareBtn.disabled = true;
            return;
        }
        
        let html = '<div class="selected-judges-list">';
        this.comparisonJudges.forEach((judge, index) => {
            html += `
                <div class="selected-judge">
                    <span class="judge-info">${judge.data.name} (${judge.county.charAt(0).toUpperCase() + judge.county.slice(1)} County)</span>
                    <button class="remove-judge" onclick="judgeSystem.removeFromComparison(${index})">&times;</button>
                </div>
            `;
        });
        html += '</div>';
        
        selectedJudgesArea.innerHTML = html;
        
        // Enable compare button if we have at least 2 judges
        if (compareBtn) {
            compareBtn.disabled = this.comparisonJudges.length < 2;
        }
    }
    
    updateComparisonSelection(selectorId, judgeId) {
        const index = parseInt(selectorId.split('-').pop()) - 1;
        
        if (!judgeId) {
            // Remove judge from comparison
            this.comparisonJudges.splice(index, 1);
        } else {
            const judge = this.judges.find(j => j.id === judgeId);
            if (judge) {
                // Check if judge is already in comparison
                const existingIndex = this.comparisonJudges.findIndex(j => j.id === judgeId);
                if (existingIndex !== -1 && existingIndex !== index) {
                    alert('This judge is already selected for comparison.');
                    document.getElementById(selectorId).value = '';
                    return;
                }
                
                this.comparisonJudges[index] = judge;
            }
        }
    }
    
    startComparison() {
        const selectedJudges = this.comparisonJudges.filter(j => j);
        
        if (selectedJudges.length < 2) {
            alert('Please select at least 2 judges for comparison.');
            return;
        }
        
        this.displayComparison(selectedJudges);
    }
    
    removeFromComparison(index) {
        this.comparisonJudges.splice(index, 1);
        this.updateComparisonPanel();
    }
    
    clearComparison() {
        this.comparisonJudges = [];
        this.updateComparisonPanel();
        
        // Hide comparison results if visible
        const comparisonResults = document.getElementById('comparison-results');
        if (comparisonResults) {
            comparisonResults.style.display = 'none';
        }
    }
    
    displayComparison(judges) {
        // Use the modal for comparison results
        const comparisonModal = document.getElementById('comparison-modal');
        const comparisonContainer = document.getElementById('comparison-results');
        
        if (!comparisonContainer || !comparisonModal) return;
        
        const comparisonHTML = this.generateComparisonTable(judges);
        comparisonContainer.innerHTML = comparisonHTML;
        
        // Show the modal
        comparisonModal.style.display = 'block';
        
        // Add close functionality
        const closeBtn = comparisonModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                comparisonModal.style.display = 'none';
            };
        }
        
        // Close on outside click
        comparisonModal.onclick = (e) => {
            if (e.target === comparisonModal) {
                comparisonModal.style.display = 'none';
            }
        };
    }
    
    generateComparisonTable(judges) {
        let html = `
            <div class=\"comparison-results\">
                <div class=\"comparison-header\">
                    <h2>📊 Judge Comparison Analysis</h2>
                    <p>Side-by-side analysis of ${judges.length} judges across key bias metrics</p>
                </div>
                
                <div class=\"comparison-table\">
                    <table>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                ${judges.map(judge => `<th class=\"judge-column\">${judge.data.name}<br><small>${judge.county.charAt(0).toUpperCase() + judge.county.slice(1)} County</small></th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Key metrics comparison
        const metrics = [
            { key: 'prisonRate', label: 'Prison Rate (%)', format: val => `${val}%` },
            { key: 'racialDisparity', label: 'Racial Disparity Score', format: val => val },
            { key: 'counselDisparity', label: 'Counsel Disparity Score', format: val => val },
            { key: 'appeals.reversal_rate', label: 'Reversal Rate (%)', format: val => `${val}%` },
            { key: 'appeals.total', label: 'Total Appeals (2024)', format: val => val },
            { key: 'caseload', label: '2024 Caseload', format: val => val.replace(/[^\\d,]/g, '') }
        ];
        
        metrics.forEach(metric => {
            html += `<tr><td class=\"metric-label\">${metric.label}</td>`;
            
            judges.forEach(judge => {
                let value;
                if (metric.key.includes('.')) {
                    const keys = metric.key.split('.');
                    value = judge.data[keys[0]][keys[1]];
                } else {
                    value = judge.data[metric.key];
                }
                
                html += `<td class=\"metric-value\">${metric.format(value)}</td>`;
            });
            
            html += '</tr>';
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class=\"comparison-insights\">
                    <h3>📈 Comparison Insights</h3>
                    ${this.generateComparisonInsights(judges)}
                </div>
                
                <div class=\"comparison-actions\">
                    <button onclick=\"judgeSystem.clearComparison()\">Clear Comparison</button>
                    <button onclick=\"judgeSystem.exportComparison()\">Export Results</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    generateComparisonInsights(judges) {
        let insights = '<div class=\"insights-grid\">';
        
        // Find judge with highest/lowest metrics
        const prisonRates = judges.map(j => ({ name: j.data.name, value: j.data.prisonRate }));
        const racialScores = judges.map(j => ({ name: j.data.name, value: j.data.racialDisparity }));
        const reversalRates = judges.map(j => ({ name: j.data.name, value: j.data.appeals.reversal_rate }));
        
        const highestPrison = prisonRates.reduce((max, current) => current.value > max.value ? current : max);
        const lowestPrison = prisonRates.reduce((min, current) => current.value < min.value ? current : min);
        
        const highestRacial = racialScores.reduce((max, current) => current.value > max.value ? current : max);
        const lowestRacial = racialScores.reduce((min, current) => current.value < min.value ? current : min);
        
        insights += `
            <div class=\"insight-card\">
                <h4>🏛️ Prison Sentencing</h4>
                <p><strong>Highest:</strong> ${highestPrison.name} (${highestPrison.value}%)</p>
                <p><strong>Lowest:</strong> ${lowestPrison.name} (${lowestPrison.value}%)</p>
                <p><strong>Difference:</strong> ${(highestPrison.value - lowestPrison.value).toFixed(1)} percentage points</p>
            </div>
            
            <div class=\"insight-card\">
                <h4>⚖️ Racial Equity</h4>
                <p><strong>Most Concerning:</strong> ${highestRacial.name} (${highestRacial.value})</p>
                <p><strong>Most Equitable:</strong> ${lowestRacial.name} (${lowestRacial.value})</p>
                <p><strong>Range:</strong> ${(highestRacial.value - lowestRacial.value).toFixed(1)} point spread</p>
            </div>
        `;
        
        insights += '</div>';
        return insights;
    }
    
    clearComparison() {
        this.comparisonJudges = [];
        
        ['compare-judge-1', 'compare-judge-2', 'compare-judge-3'].forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            if (selector) selector.value = '';
        });
        
        const comparisonContainer = document.getElementById('comparison-results');
        if (comparisonContainer) {
            comparisonContainer.style.display = 'none';
        }
        
        this.showMessage('Comparison cleared.');
    }
    
    exportComparison() {
        if (this.comparisonJudges.length < 2) {
            alert('No comparison data to export.');
            return;
        }
        
        // Generate CSV data
        const csvData = this.generateComparisonCSV(this.comparisonJudges);
        
        // Create and download file
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `judge_comparison_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showMessage('Comparison exported to CSV file.');
    }
    
    generateComparisonCSV(judges) {
        let csv = 'Metric,' + judges.map(j => j.data.name).join(',') + '\\n';
        
        const metrics = [
            ['Prison Rate (%)', j => j.data.prisonRate],
            ['Racial Disparity Score', j => j.data.racialDisparity],
            ['Counsel Disparity Score', j => j.data.counselDisparity],
            ['Reversal Rate (%)', j => j.data.appeals.reversal_rate],
            ['Total Appeals (2024)', j => j.data.appeals.total],
            ['County', j => j.county.charAt(0).toUpperCase() + j.county.slice(1)],
            ['Department', j => j.department],
            ['Risk Assessment', j => j.risk]
        ];
        
        metrics.forEach(([label, extractor]) => {
            csv += label + ',' + judges.map(extractor).join(',') + '\\n';
        });
        
        return csv;
    }
    
    viewJudgeDetails(judgeId) {
        this.selectJudge(judgeId);
        
        // Also update the dropdown to reflect selection
        const dropdown = document.getElementById('judge-dropdown');
        if (dropdown) {
            dropdown.value = judgeId;
        }
    }
    
    highlightJudgeCard(cardElement) {
        // Remove previous highlights
        document.querySelectorAll('.judge-card.highlighted').forEach(card => {
            card.classList.remove('highlighted');
        });
        
        // Add highlight to selected card
        cardElement.classList.add('highlighted');
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            cardElement.classList.remove('highlighted');
        }, 3000);
    }
    
    hideSelectedJudgeProfile() {
        const profileContainer = document.getElementById('selected-judge-profile');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
        
        // Clear dropdown selection
        const dropdown = document.getElementById('judge-dropdown');
        if (dropdown) {
            dropdown.value = '';
        }
    }
    
    scrollToElement(element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    showMessage(message) {
        // Create or update message element
        let messageEl = document.getElementById('system-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'system-message';
            messageEl.className = 'system-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bright-green);
                color: var(--black);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                font-weight: 600;
                border: 2px solid var(--black);
                display: none;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
    
    // Heat Map Functionality
    initializeHeatMap() {
        this.updateHeatMap();
    }
    
    updateHeatMap() {
        const metric = document.getElementById('heat-map-metric')?.value || 'racial_disparity';
        const view = document.getElementById('heat-map-view')?.value || 'county';
        
        const data = this.calculateHeatMapData(metric, view);
        this.renderHeatMap(data, metric, view);
        this.updateHeatMapStats(data, metric);
    }
    
    calculateHeatMapData(metric, view) {
        const data = new Map();
        
        this.judges.forEach(judge => {
            let key;
            switch (view) {
                case 'county':
                    key = judge.county.charAt(0).toUpperCase() + judge.county.slice(1);
                    break;
                case 'department':
                    key = judge.department.charAt(0).toUpperCase() + judge.department.slice(1);
                    break;
                case 'risk_level':
                    key = judge.risk.charAt(0).toUpperCase() + judge.risk.slice(1);
                    break;
                default:
                    key = 'Unknown';
            }
            
            if (!data.has(key)) {
                data.set(key, {
                    judges: [],
                    values: [],
                    total: 0,
                    average: 0,
                    riskLevel: 'low'
                });
            }
            
            const entry = data.get(key);
            entry.judges.push(judge);
            
            let value = 0;
            switch (metric) {
                case 'racial_disparity':
                    value = parseFloat(judge.data.racialDisparity) || 0;
                    break;
                case 'counsel_disparity':
                    value = parseFloat(judge.data.counselDisparity) || 0;
                    break;
                case 'prison_rate':
                    value = parseFloat(judge.data.prisonRate) || 0;
                    break;
                case 'reversal_rate':
                    value = parseFloat(judge.data.appeals?.reversal_rate) || 0;
                    break;
            }
            
            entry.values.push(value);
            entry.total += value;
        });
        
        // Calculate averages and determine risk levels
        data.forEach((entry, key) => {
            entry.average = entry.total / entry.judges.length;
            entry.riskLevel = this.calculateRiskLevel(entry.average, metric);
        });
        
        return data;
    }
    
    calculateRiskLevel(value, metric) {
        // Define thresholds based on metric type
        let thresholds;
        switch (metric) {
            case 'racial_disparity':
            case 'counsel_disparity':
                thresholds = { excellent: 0.5, low: 1.0, moderate: 2.0, high: 3.0 };
                break;
            case 'prison_rate':
                thresholds = { excellent: 15, low: 25, moderate: 40, high: 60 };
                break;
            case 'reversal_rate':
                thresholds = { excellent: 5, low: 10, moderate: 20, high: 35 };
                break;
            default:
                thresholds = { excellent: 1, low: 2, moderate: 3, high: 4 };
        }
        
        if (value <= thresholds.excellent) return 'excellent';
        if (value <= thresholds.low) return 'low';
        if (value <= thresholds.moderate) return 'moderate';
        if (value <= thresholds.high) return 'high';
        return 'critical';
    }
    
    renderHeatMap(data, metric, view) {
        const grid = document.getElementById('heat-map-grid');
        if (!grid) return;
        
        let html = '';
        
        Array.from(data.entries())
            .sort((a, b) => b[1].average - a[1].average)
            .forEach(([key, entry]) => {
                const formatValue = this.formatMetricValue(entry.average, metric);
                
                html += `
                    <div class="heat-tile ${entry.riskLevel}" onclick="judgeSystem.filterByHeatMapTile('${view}', '${key.toLowerCase()}')">
                        <div class="tile-label">${key}</div>
                        <div class="tile-value">${formatValue}</div>
                        <div class="tile-metric">${this.getMetricLabel(metric)}</div>
                        <div class="tile-judges">${entry.judges.length} judges</div>
                    </div>
                `;
            });
        
        if (html === '') {
            html = '<div class="no-data">No data available for selected view</div>';
        }
        
        grid.innerHTML = html;
    }
    
    formatMetricValue(value, metric) {
        switch (metric) {
            case 'prison_rate':
            case 'reversal_rate':
                return `${value.toFixed(1)}%`;
            case 'racial_disparity':
            case 'counsel_disparity':
                return value.toFixed(2);
            default:
                return value.toFixed(1);
        }
    }
    
    getMetricLabel(metric) {
        switch (metric) {
            case 'racial_disparity':
                return 'Racial Disparity';
            case 'counsel_disparity':
                return 'Counsel Disparity';
            case 'prison_rate':
                return 'Prison Rate';
            case 'reversal_rate':
                return 'Reversal Rate';
            default:
                return 'Score';
        }
    }
    
    updateHeatMapStats(data, metric) {
        const summaryEl = document.getElementById('heat-map-summary');
        if (!summaryEl) return;
        
        const values = Array.from(data.values()).map(entry => entry.average);
        const totalJudges = Array.from(data.values()).reduce((sum, entry) => sum + entry.judges.length, 0);
        
        const stats = {
            total: totalJudges,
            average: values.reduce((sum, val) => sum + val, 0) / values.length || 0,
            highest: Math.max(...values) || 0,
            lowest: Math.min(...values) || 0,
            counties: data.size
        };
        
        const html = `
            <div class="stat-item">
                <span class="stat-label">Total Judges:</span>
                <span class="stat-value">${stats.total}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Average ${this.getMetricLabel(metric)}:</span>
                <span class="stat-value">${this.formatMetricValue(stats.average, metric)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Highest:</span>
                <span class="stat-value">${this.formatMetricValue(stats.highest, metric)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Lowest:</span>
                <span class="stat-value">${this.formatMetricValue(stats.lowest, metric)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Categories:</span>
                <span class="stat-value">${stats.counties}</span>
            </div>
        `;
        
        summaryEl.innerHTML = html;
    }
    
    filterByHeatMapTile(view, value) {
        // Apply filter based on heat map tile selection
        const filterMap = {
            'county': 'county-filter',
            'department': 'department-filter',
            'risk_level': 'risk-filter'
        };
        
        const filterId = filterMap[view];
        const filterElement = document.getElementById(filterId);
        
        if (filterElement) {
            filterElement.value = value;
            this.applyFilters();
            
            // Scroll to judges grid
            document.getElementById('judges-grid')?.scrollIntoView({ behavior: 'smooth' });
            
            // Show success message
            this.showMessage(`Filtered by ${view}: ${value.charAt(0).toUpperCase() + value.slice(1)}`);
        }
    }
}

// Initialize the system when the page loads
let judgeSystem;

document.addEventListener('DOMContentLoaded', function() {
    judgeSystem = new JudgeAnalysisSystem();
    console.log('Judge Analysis System initialized successfully');
});

// Export for global access
window.judgeSystem = judgeSystem;