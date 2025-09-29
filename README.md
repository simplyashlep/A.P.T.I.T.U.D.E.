# Bias Beacon - Judicial Bias Tracker

The Bias Beacon is a comprehensive judicial bias tracking system integrated into the Public Accountability Project. It analyzes sentencing patterns across all 36 counties to identify potential bias in criminal justice decisions.

## 🎯 Overview

The Bias Beacon tracks:
- **Sentencing Disparities**: How prison time varies by judge, county, and demographics
- **Representation Impact**: Differences between public defender and private attorney outcomes  
- **Demographic Patterns**: Sentencing variations across racial, gender, and age lines
- **Judicial Consistency**: How consistent individual judges are in similar cases
- **Geographic Variations**: County-by-county differences in justice outcomes

## 📊 Key Features

### Judge Profiles (`/bias-beacon/judges/`)
- Individual judge sentencing patterns and statistics
- Case type specializations and volume metrics
- Demographic impact analysis for each judge
- Comparison with county and state averages

### County Comparisons (`/bias-beacon/counties/`)
- County-by-county analysis of justice outcomes
- Interactive maps showing regional variations
- Resource allocation and efficiency metrics
- Rankings by various bias indicators

### Interactive Dashboard (`/bias-beacon/dashboard/`)
- Real-time overview of key metrics
- Interactive charts and visualizations
- Filtering and search capabilities
- Data export functionality

### Data Upload (`/bias-beacon/upload/`)
- Secure file upload for judicial data
- Automated data processing and validation
- Privacy protection and anonymization
- Template downloads for proper formatting

## 🗃️ Data Structure

The system expects judicial data in specific CSV formats:

### Required Files
- `judicial-records.csv` - Core case data
- `judge-profiles.csv` - Judge information  
- `demographic-data.csv` - Defendant demographics
- `sentence-data.csv` - Sentencing details
- `representation-data.csv` - Legal representation info
- `county-info.csv` - Jurisdiction data

### Key Data Fields
- **Case Information**: ID, dates, type, jurisdiction, judge
- **Defendant Data**: Age, race, gender, representation type (anonymized)
- **Outcomes**: Conviction status, sentence type, prison time, fines
- **Judge Data**: Name, county, years active, specializations

## 🔒 Privacy & Security 

### Data Protection
- All personally identifiable information is immediately anonymized
- Only statistical aggregations are displayed publicly
- Secure encrypted upload and storage
- Minimum case thresholds prevent individual identification

### Statistical Methodology  
- Uses rigorous statistical analysis to identify significant patterns
- Provides confidence intervals for all metrics
- Controls for case complexity and severity
- Peer-reviewed analytical methods

## 📈 Metrics Explained

### Sentencing Severity Index
Compares a judge's average sentences to county/state benchmarks for similar cases.

### Demographic Disparity Score  
Statistical measure of sentencing differences across demographic groups.

### Representation Impact Ratio
Difference in outcomes between public defender and private attorney cases.

### Consistency Rating
How predictable a judge's sentencing is for similar cases and circumstances.

## 🚀 Getting Started

1. **Upload Data**: Go to `/bias-beacon/upload/` and upload your judicial data ZIP file
2. **Explore Dashboard**: Visit `/bias-beacon/dashboard/` for overview metrics
3. **Search Judges**: Use `/bias-beacon/judges/` to find specific judges
4. **Compare Counties**: Analyze regional differences at `/bias-beacon/counties/`

## 🛠️ Technical Implementation

### Frontend Components
- Responsive Jekyll-based interface
- Interactive JavaScript visualizations  
- Real-time data filtering and search
- Mobile-friendly design

### Data Processing
- Automated CSV parsing and validation
- Statistical analysis engine
- Privacy-preserving anonymization
- Error handling and data quality checks

### Files Structure
```
bias-beacon/
├── index.md              # Main landing page
├── judges.md             # Judge profiles section
├── counties.md           # County comparisons
├── dashboard.md          # Interactive dashboard
├── upload.md             # Data upload interface
└── README.md             # This documentation

_data/bias-beacon/
├── sample-structure.yml  # Data format examples
└── [processed-data]/     # Generated from uploads

assets/
├── css/bias-beacon.scss  # Custom styles
└── js/bias-beacon/       # JavaScript components
    └── data-processor.js # Data processing logic
```

## 📋 Data Templates

Download template files from the upload page to ensure proper data formatting:
- Judicial Records Template
- Judge Profiles Template  
- Demographic Data Template
- Sentence Data Template

## ⚠️ Important Notes

### Ethical Use
- The Bias Beacon is designed to identify systemic patterns, not criticize individuals
- All findings should be interpreted with proper statistical context
- Results warrant further investigation but are not definitive proof of bias

### Data Requirements
- Data must be legally obtained from official sources
- Minimum 5-10 years of historical data recommended
- All 36 counties should be represented for complete analysis
- Case volume must be sufficient for statistical significance

### Limitations
- Statistical correlation does not imply causation
- Results may be influenced by unmeasured variables
- Local legal and cultural factors may affect patterns
- Analysis is only as good as the input data quality

## 🤝 Contributing

To improve the Bias Beacon system:
1. Report data quality issues or bugs
2. Suggest additional metrics or visualizations
3. Provide feedback on methodology
4. Contribute to statistical analysis improvements

## 📞 Support

For questions, issues, or data contribution:
- Email: [Insert contact email]
- Documentation: This README and inline help
- Templates: Available on upload page
- Privacy Policy: Details on data handling procedures

---

*The Bias Beacon is part of the Public Accountability Project's commitment to transparency and evidence-based analysis of public institutions.*