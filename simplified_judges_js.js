// Simplified Judge Analysis System
// Matches the current HTML template structure

class JudgeAnalysisSystem {
    constructor() {
        this.judges = [];
        this.filteredJudges = [];
        this.comparisonJudges = [];
        this.maxComparison = 3;
        
        this.initializeSystem();
    }
    
    initializeSystem() {
        console.log('Initializing Judge Analysis System...');
        this.loadJudgeData();
        this.setupEventListeners();
        this.setupFilters();
    }
    
    loadJudgeData() {
        const judgeCards = document.querySelectorAll('.judge-card');
        console.log(`Found ${judgeCards.length} judge cards`);
        
        judgeCards.forEach(card => {
            const judge = {
                id: card.dataset.id,
                name: card.dataset.name,
                county: card.dataset.county,
                department: card.dataset.department,
                risk: card.dataset.risk,
                period: card.dataset.period,
                element: card,
                data: this.extractBasicData(card)
            };
            
            this.judges.push(judge);
        });
        
        this.filteredJudges = [...this.judges];
        console.log(`Loaded ${this.judges.length} judges into system`);
    }
    
    extractBasicData(card) {
        // Extract data that actually exists in the current template
        const nameEl = card.querySelector('.judge-name');
        const courtEl = card.querySelector('.judge-court');
        const deptEl = card.querySelector('.judge-department');
        const specEl = card.querySelector('.specialization');
        
        // Extract metric values
        const metricValues = card.querySelectorAll('.metric-value');
        const biasScores = card.querySelectorAll('.bias-score');
        
        return {
            name: nameEl ? nameEl.textContent.trim() : 'Unknown',
            court: courtEl ? courtEl.textContent.trim() : 'Unknown',
            department: deptEl ? deptEl.textContent.trim() : 'Unknown',
            specialization: specEl ? specEl.textContent.replace('Specializes in:', '').trim() : 'None',
            prisonRate: metricValues[0] ? parseFloat(metricValues[0].textContent) : 0,
            appeals2024: metricValues[1] ? parseInt(metricValues[1].textContent) : 0,
            reversalRate: metricValues[2] ? parseFloat(metricValues[2].textContent) : 0,
            racialDisparity: biasScores[0] ? parseFloat(biasScores[0].textContent) : 0,
            counselDisparity: biasScores[1] ? parseFloat(biasScores[1].textContent) : 0
        };
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('judge-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
        
        // Filter controls
        const filters = ['county-filter', 'risk-filter', 'department-filter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });
        
        // Judge card buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-details-btn')) {
                this.viewJudgeDetails(e.target.dataset.judgeId);
            } else if (e.target.classList.contains('add-compare-btn')) {
                this.addToComparison(e.target.dataset.judgeId, e.target.dataset.judgeName);
            }
        });
        
        // Comparison controls
        const compareBtn = document.getElementById('compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.showComparison());
        }
        
        const clearBtn = document.getElementById('clear-comparison');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearComparison());
        }
    }
    
    setupFilters() {
        // Initialize filter options based on available judges
        this.populateFilterOptions();
    }
    
    populateFilterOptions() {
        // This could be enhanced to dynamically populate filter options
        // based on the loaded judge data
        console.log('Filter options ready');
    }
    
    performSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredJudges = [...this.judges];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredJudges = this.judges.filter(judge => {
                return judge.name.toLowerCase().includes(term) ||
                       judge.county.toLowerCase().includes(term) ||
                       judge.department.toLowerCase().includes(term) ||
                       judge.data.specialization.toLowerCase().includes(term);
            });
        }
        
        this.displayFilteredJudges();
    }
    
    applyFilters() {
        const countyFilter = document.getElementById('county-filter')?.value || '';
        const riskFilter = document.getElementById('risk-filter')?.value || '';
        const departmentFilter = document.getElementById('department-filter')?.value || '';
        
        let filtered = [...this.judges];
        
        if (countyFilter) {
            filtered = filtered.filter(judge => judge.county === countyFilter);
        }
        
        if (riskFilter) {
            filtered = filtered.filter(judge => judge.risk === riskFilter);
        }
        
        if (departmentFilter) {
            filtered = filtered.filter(judge => judge.department === departmentFilter);
        }
        
        this.filteredJudges = filtered;
        this.displayFilteredJudges();
    }
    
    displayFilteredJudges() {
        // Show/hide judge cards based on filtered results
        this.judges.forEach(judge => {
            const isVisible = this.filteredJudges.includes(judge);
            judge.element.style.display = isVisible ? 'block' : 'none';
        });
        
        // Update results count
        this.updateResultsCount(this.filteredJudges.length);
        
        console.log(`Showing ${this.filteredJudges.length} of ${this.judges.length} judges`);
    }
    
    updateResultsCount(count) {
        // Try to find existing results counter or create one
        let countElement = document.querySelector('.results-count');
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.className = 'results-count';
            countElement.style.cssText = 'margin: 10px 0; font-weight: bold; color: #666;';
            
            const judgesGrid = document.getElementById('judges-grid');
            if (judgesGrid && judgesGrid.parentNode) {
                judgesGrid.parentNode.insertBefore(countElement, judgesGrid);
            }
        }
        
        countElement.textContent = `Showing ${count} of ${this.judges.length} judges`;
    }
    
    viewJudgeDetails(judgeId) {
        const judge = this.judges.find(j => j.id === judgeId);
        if (!judge) return;
        
        // Scroll to and highlight the judge card
        judge.element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        this.highlightJudgeCard(judge.element);
        
        // Show a simple modal or detailed view
        this.showJudgeModal(judge);
    }
    
    showJudgeModal(judge) {
        // Check if modal exists, if not create a simple one
        let modal = document.getElementById('judge-detail-modal');
        if (!modal) {
            modal = this.createSimpleModal();
        }
        
        const content = document.getElementById('judge-detail-content');
        if (content) {
            content.innerHTML = this.generateJudgeDetails(judge);
        }
        
        modal.style.display = 'block';
    }
    
    createSimpleModal() {
        const modal = document.createElement('div');
        modal.id = 'judge-detail-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background-color: white;
            margin: 5% auto;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            position: relative;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 25px;
            font-size: 28px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => modal.style.display = 'none';
        
        const content = document.createElement('div');
        content.id = 'judge-detail-content';
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(content);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        return modal;
    }
    
    generateJudgeDetails(judge) {
        const data = judge.data;
        
        return `
            <h2>${data.name}</h2>
            <div class="judge-details-content">
                <div class="detail-section">
                    <h3>Court Information</h3>
                    <p><strong>Court:</strong> ${data.court}</p>
                    <p><strong>Department:</strong> ${data.department}</p>
                    <p><strong>Risk Level:</strong> ${judge.risk.toUpperCase()}</p>
                    <p><strong>Specialization:</strong> ${data.specialization}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Key Metrics</h3>
                    <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
                        <div class="metric-card" style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #333;">${data.prisonRate}%</div>
                            <div style="font-size: 14px; color: #666;">Prison Rate</div>
                        </div>
                        <div class="metric-card" style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #333;">${data.appeals2024}</div>
                            <div style="font-size: 14px; color: #666;">2024 Appeals</div>
                        </div>
                        <div class="metric-card" style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #333;">${data.reversalRate}%</div>
                            <div style="font-size: 14px; color: #666;">Reversal Rate</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Bias Analysis</h3>
                    <p><strong>Racial Disparity Score:</strong> ${data.racialDisparity}</p>
                    <p><strong>Counsel Disparity Score:</strong> ${data.counselDisparity}</p>
                </div>
                
                <div class="detail-actions" style="margin-top: 20px; text-align: center;">
                    <button onclick="judgeSystem.addToComparison('${judge.id}', '${data.name}')" 
                            style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                        Add to Comparison
                    </button>
                    <button onclick="document.getElementById('judge-detail-modal').style.display='none'" 
                            style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
    }
    
    highlightJudgeCard(cardElement) {
        // Remove previous highlights
        document.querySelectorAll('.judge-card.highlighted').forEach(card => {
            card.classList.remove('highlighted');
        });
        
        // Add highlight to selected card
        cardElement.classList.add('highlighted');
        
        // Add CSS for highlight if not exists
        if (!document.getElementById('highlight-style')) {
            const style = document.createElement('style');
            style.id = 'highlight-style';
            style.textContent = `
                .judge-card.highlighted {
                    box-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
                    border-color: #007bff;
                    transform: scale(1.02);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            cardElement.classList.remove('highlighted');
        }, 3000);
    }
    
    addToComparison(judgeId, judgeName) {
        if (this.comparisonJudges.length >= this.maxComparison) {
            this.showMessage(`Maximum of ${this.maxComparison} judges can be compared at once.`);
            return;
        }
        
        if (this.comparisonJudges.find(j => j.id === judgeId)) {
            this.showMessage('This judge is already in the comparison.');
            return;
        }
        
        const judge = this.judges.find(j => j.id === judgeId);
        if (judge) {
            this.comparisonJudges.push(judge);
            this.updateComparisonPanel();
            this.showMessage(`${judgeName} added to comparison (${this.comparisonJudges.length}/${this.maxComparison})`);
        }
    }
    
    updateComparisonPanel() {
        const selectedJudges = document.getElementById('selected-judges');
        if (!selectedJudges) return;
        
        if (this.comparisonJudges.length === 0) {
            selectedJudges.innerHTML = '<p class="comparison-help">Click "Add to Compare" on judge cards to compare up to 3 judges side-by-side</p>';
        } else {
            let html = '<div class="selected-judges-list">';
            this.comparisonJudges.forEach((judge, index) => {
                html += `
                    <div class="selected-judge-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f8f9fa; margin-bottom: 5px; border-radius: 4px;">
                        <span>${judge.data.name} (${judge.county.charAt(0).toUpperCase() + judge.county.slice(1)})</span>
                        <button onclick="judgeSystem.removeFromComparison(${index})" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;">Remove</button>
                    </div>
                `;
            });
            html += '</div>';
            selectedJudges.innerHTML = html;
        }
        
        // Enable/disable compare button
        const compareBtn = document.getElementById('compare-btn');
        if (compareBtn) {
            compareBtn.disabled = this.comparisonJudges.length < 2;
        }
    }
    
    removeFromComparison(index) {
        if (index >= 0 && index < this.comparisonJudges.length) {
            const removedJudge = this.comparisonJudges.splice(index, 1)[0];
            this.updateComparisonPanel();
            this.showMessage(`${removedJudge.data.name} removed from comparison.`);
        }
    }
    
    showComparison() {
        if (this.comparisonJudges.length < 2) {
            this.showMessage('Please select at least 2 judges for comparison.');
            return;
        }
        
        // Create or show comparison modal
        this.displayComparisonModal();
    }
    
    displayComparisonModal() {
        let modal = document.getElementById('comparison-modal');
        if (!modal) {
            modal = this.createComparisonModal();
        }
        
        const content = document.getElementById('comparison-results');
        if (content) {
            content.innerHTML = this.generateComparisonHTML();
        }
        
        modal.style.display = 'block';
    }
    
    createComparisonModal() {
        const modal = document.createElement('div');
        modal.id = 'comparison-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background-color: white;
            margin: 2% auto;
            padding: 20px;
            border-radius: 8px;
            width: 95%;
            max-width: 1200px;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        `;
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 25px;
            font-size: 28px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => modal.style.display = 'none';
        
        const title = document.createElement('h2');
        title.textContent = 'Judge Comparison';
        title.style.marginTop = '0';
        
        const content = document.createElement('div');
        content.id = 'comparison-results';
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(content);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        return modal;
    }
    
    generateComparisonHTML() {
        const judges = this.comparisonJudges;
        
        return `
            <div class="comparison-table" style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Metric</th>
                            ${judges.map(judge => `<th style="border: 1px solid #ddd; padding: 12px; text-align: center;">${judge.data.name}<br><small>${judge.county.charAt(0).toUpperCase() + judge.county.slice(1)} County</small></th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Prison Rate</td>
                            ${judges.map(judge => `<td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${judge.data.prisonRate}%</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Racial Disparity Score</td>
                            ${judges.map(judge => `<td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${judge.data.racialDisparity}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Counsel Disparity Score</td>
                            ${judges.map(judge => `<td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${judge.data.counselDisparity}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Reversal Rate</td>
                            ${judges.map(judge => `<td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${judge.data.reversalRate}%</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">2024 Appeals</td>
                            ${judges.map(judge => `<td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${judge.data.appeals2024}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Department</td>
                            ${judges.map(judge => `<td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${judge.data.department}</td>`).join('')}
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Risk Level</td>
                            ${judges.map(judge => `<td style="border: 1px solid #ddd; padding: 12px; text-align: center;"><span class="risk-badge ${judge.risk}">${judge.risk.toUpperCase()}</span></td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
    
    clearComparison() {
        this.comparisonJudges = [];
        this.updateComparisonPanel();
        this.showMessage('Comparison cleared.');
    }
    
    showMessage(message) {
        let messageEl = document.getElementById('system-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'system-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #007bff;
                color: white;
                padding: 15px 20px;
                border-radius: 4px;
                z-index: 10000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: none;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

// Initialize the system when DOM is ready
let judgeSystem;

document.addEventListener('DOMContentLoaded', function() {
    judgeSystem = new JudgeAnalysisSystem();
    console.log('Judge Analysis System initialized successfully');
});

// Export for global access
window.judgeSystem = judgeSystem;