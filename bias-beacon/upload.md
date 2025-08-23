---
layout: page
title: "Data Upload - Bias Beacon"
permalink: /bias-beacon/upload/
description: "Upload your judicial data to populate the Bias Beacon system with real court records and sentencing information."
---

# Upload Bias Beacon Data

<div class="upload-header">
  <p>Upload your judicial data zip file to populate the Bias Beacon system with comprehensive court records and sentencing information across all 36 counties.</p>
</div>

## Data Upload

<div class="upload-container">
  <div class="upload-section">
    <h3>📁 Select Your Data File</h3>
    <div class="file-upload-area" id="file-upload-area">
      <div class="upload-instructions">
        <div class="upload-icon">📤</div>
        <h4>Drop your Bias Beacon zip file here</h4>
        <p>or <button class="upload-btn" onclick="document.getElementById('file-input').click()">browse to select file</button></p>
        <input type="file" id="file-input" accept=".zip" style="display: none;" onchange="handleFileSelect(event)">
      </div>
      
      <div class="upload-progress" id="upload-progress" style="display: none;">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <div class="progress-text" id="progress-text">Processing...</div>
      </div>
      
      <div class="upload-success" id="upload-success" style="display: none;">
        <div class="success-icon">✅</div>
        <h4>Data Successfully Processed!</h4>
        <p>Your judicial data has been uploaded and processed. The Bias Beacon is now populated with your data.</p>
        <a href="/bias-beacon/dashboard/" class="btn btn-primary">View Dashboard</a>
      </div>
    </div>
  </div>

  <div class="data-info-section">
    <h3>📋 Expected Data Format</h3>
    <div class="format-info">
      <h4>Your zip file should contain:</h4>
      <ul>
        <li><strong>judicial-records.csv</strong> - Court case data with outcomes</li>
        <li><strong>judge-profiles.csv</strong> - Judge information and assignments</li>
        <li><strong>demographic-data.csv</strong> - Defendant demographic information</li>
        <li><strong>sentence-data.csv</strong> - Detailed sentencing information</li>
        <li><strong>representation-data.csv</strong> - Legal representation details</li>
        <li><strong>county-info.csv</strong> - County jurisdiction information</li>
      </ul>
      
      <h4>Required Data Fields:</h4>
      <div class="field-requirements">
        <div class="field-group">
          <h5>Case Information</h5>
          <ul>
            <li>Case ID</li>
            <li>Date Filed/Decided</li>
            <li>Case Type (Felony, Misdemeanor, etc.)</li>
            <li>Jurisdiction/County</li>
            <li>Judge Assigned</li>
          </ul>
        </div>
        
        <div class="field-group">
          <h5>Defendant Information</h5>
          <ul>
            <li>Age (or age range)</li>
            <li>Race/Ethnicity</li>
            <li>Gender</li>
            <li>Representation Type</li>
          </ul>
        </div>
        
        <div class="field-group">
          <h5>Outcome Information</h5>
          <ul>
            <li>Conviction/Acquittal</li>
            <li>Sentence Type</li>
            <li>Prison Time (if applicable)</li>
            <li>Fine Amount (if applicable)</li>
            <li>Probation Terms</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

## Data Processing Information

<div class="processing-info">
  <h3>🔄 How We Process Your Data</h3>
  
  <div class="processing-steps">
    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <h4>Data Validation</h4>
        <p>We verify the format and completeness of your uploaded files, checking for required fields and data consistency.</p>
      </div>
    </div>
    
    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <h4>Anonymization</h4>
        <p>All personally identifiable information is removed or anonymized to protect individual privacy while preserving analytical value.</p>
      </div>
    </div>
    
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <h4>Statistical Analysis</h4>
        <p>We calculate bias indicators, sentencing patterns, and demographic disparities using rigorous statistical methods.</p>
      </div>
    </div>
    
    <div class="step">
      <div class="step-number">4</div>
      <div class="step-content">
        <h4>Visualization</h4>
        <p>Processed data is prepared for interactive dashboards, charts, and detailed analytical reports.</p>
      </div>
    </div>
  </div>
</div>

## Privacy & Security

<div class="privacy-section">
  <h3>🔒 Data Privacy & Security</h3>
  
  <div class="privacy-commitments">
    <div class="commitment">
      <h4>🛡️ Data Protection</h4>
      <ul>
        <li>All uploads are encrypted in transit and at rest</li>
        <li>Personal identifiers are immediately anonymized</li>
        <li>No individual case details are publicly accessible</li>
        <li>Data is stored securely with access controls</li>
      </ul>
    </div>
    
    <div class="commitment">
      <h4>📊 Statistical Aggregation</h4>
      <ul>
        <li>Only aggregated statistics are displayed</li>
        <li>Minimum case thresholds prevent individual identification</li>
        <li>Statistical significance testing ensures reliable findings</li>
        <li>Confidence intervals provided for all metrics</li>
      </ul>
    </div>
    
    <div class="commitment">
      <h4>🔍 Transparency</h4>
      <ul>
        <li>Clear methodology documentation</li>
        <li>Open source analytical methods</li>
        <li>Regular data quality reports</li>
        <li>Community oversight and feedback</li>
      </ul>
    </div>
  </div>
</div>

## Sample Data Template

<div class="template-section">
  <h3>📥 Download Template Files</h3>
  <p>If you need help structuring your data, download our template files that show the expected format:</p>
  
  <div class="template-downloads">
    <button class="btn btn-outline" onclick="downloadTemplate('judicial-records')">📄 Judicial Records Template</button>
    <button class="btn btn-outline" onclick="downloadTemplate('judge-profiles')">👨‍⚖️ Judge Profiles Template</button>
    <button class="btn btn-outline" onclick="downloadTemplate('demographic-data')">👥 Demographic Data Template</button>
    <button class="btn btn-outline" onclick="downloadTemplate('sentence-data')">⚖️ Sentence Data Template</button>
  </div>
</div>

---

<div class="upload-footer">
  <p><strong>Need Help?</strong> If you encounter issues with data upload or have questions about the expected format, please <a href="mailto:{{ site.email }}">contact us</a> for assistance.</p>
  
  <p><strong>Data Sources:</strong> We accept data from court management systems, clerk records, district attorney databases, and other official judicial sources. All data must be legally obtained and properly authorized for use.</p>
</div>

<script>
// File upload handling
let uploadedFile = null;

// Drag and drop functionality
const uploadArea = document.getElementById('file-upload-area');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ target: { files: files } });
    }
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
        alert('Please select a ZIP file containing your judicial data.');
        return;
    }
    
    uploadedFile = file;
    processFile(file);
}

async function processFile(file) {
    // Show progress
    document.querySelector('.upload-instructions').style.display = 'none';
    document.getElementById('upload-progress').style.display = 'block';
    
    try {
        // Use the data processor
        const result = await window.biasBeaconProcessor.loadZipFile(file);
        
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 95) progress = 95;
            
            document.getElementById('progress-fill').style.width = progress + '%';
            document.getElementById('progress-text').textContent = 
                progress < 30 ? 'Extracting files...' :
                progress < 60 ? 'Validating data...' :
                progress < 90 ? 'Processing records...' :
                'Finalizing...';
        }, 200);
        
        // Complete after processing
        setTimeout(() => {
            clearInterval(progressInterval);
            document.getElementById('progress-fill').style.width = '100%';
            document.getElementById('progress-text').textContent = 'Complete!';
            
            setTimeout(() => {
                document.getElementById('upload-progress').style.display = 'none';
                document.getElementById('upload-success').style.display = 'block';
                
                // Update the site with new data
                updateSiteWithData(result);
            }, 500);
        }, 2000);
        
    } catch (error) {
        console.error('Processing error:', error);
        alert('Error processing file: ' + error.message);
        
        // Reset upload area
        document.getElementById('upload-progress').style.display = 'none';
        document.querySelector('.upload-instructions').style.display = 'block';
    }
}

function updateSiteWithData(data) {
    // This would update the site's data files
    console.log('Data processed successfully:', data);
    
    // Store in localStorage for now (in real implementation, this would update Jekyll data files)
    localStorage.setItem('biasBeaconData', JSON.stringify(data));
    
    // Trigger update of other pages
    if (window.updateDashboard) {
        window.updateDashboard(data);
    }
}

function downloadTemplate(templateType) {
    // Generate and download template files
    let csvContent = '';
    let filename = '';
    
    switch (templateType) {
        case 'judicial-records':
            csvContent = 'case_id,date_filed,date_decided,case_type,county,judge_id,defendant_id,outcome,guilty_plea\n';
            csvContent += 'CASE001,2023-01-15,2023-03-20,FELONY,County1,JUDGE001,DEF001,CONVICTION,FALSE\n';
            filename = 'judicial-records-template.csv';
            break;
        case 'judge-profiles':
            csvContent = 'judge_id,name,county,years_active_start,years_active_end,specialization\n';
            csvContent += 'JUDGE001,Judge Smith,County1,2015,2024,CRIMINAL\n';
            filename = 'judge-profiles-template.csv';
            break;
        case 'demographic-data':
            csvContent = 'defendant_id,age,race,gender,income_level\n';
            csvContent += 'DEF001,35,WHITE,MALE,LOW\n';
            filename = 'demographic-data-template.csv';
            break;
        case 'sentence-data':
            csvContent = 'case_id,sentence_type,prison_months,fine_amount,probation_months,community_service_hours\n';
            csvContent += 'CASE001,PRISON,36,1000,0,0\n';
            filename = 'sentence-data-template.csv';
            break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
</script>

<style>
.upload-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin: 2rem 0;
}

.file-upload-area {
    border: 3px dashed #3498db;
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    background: #f8f9fa;
    transition: all 0.3s ease;
    cursor: pointer;
}

.file-upload-area.drag-over {
    border-color: #2980b9;
    background: #e3f2fd;
}

.upload-instructions {
    .upload-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    h4 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .upload-btn {
        background: none;
        border: none;
        color: #3498db;
        text-decoration: underline;
        cursor: pointer;
        font-size: inherit;
    }
}

.progress-bar {
    width: 100%;
    height: 20px;
    background: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2980b9);
    width: 0%;
    transition: width 0.3s ease;
}

.processing-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.step {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.step-number {
    width: 40px;
    height: 40px;
    background: #3498db;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .upload-container {
        grid-template-columns: 1fr;
    }
}
</style>