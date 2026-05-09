# Bias Beacon - Netlify B12 Deployment Guide

## Overview
This guide covers deploying the Bias Beacon Jekyll site to Netlify's B12 platform with full functionality including:
- 173+ Oregon judges across 30 counties
- Interactive heat maps with bias analysis
- STOP data correlation analysis
- Comprehensive judge comparison tools
- Bright color scheme (FB05FF, A3FF05, EBEBEB, 000000, 8100FF)

## Prerequisites
- Netlify account with B12 integration
- GitHub repository containing the Bias Beacon code
- Ruby 3.1.0+ environment (handled by Netlify)

## Deployment Options

### Option 1: Direct Netlify Deployment (Recommended)

1. **Connect Repository to Netlify:**
   ```
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the branch (main/master)
   ```

2. **Build Settings:**
   ```
   Build command: bundle exec jekyll build
   Publish directory: _site
   ```

3. **Environment Variables (if needed):**
   ```
   JEKYLL_ENV=production
   RUBY_VERSION=3.1.0
   ```

### Option 2: B12 Website Builder Integration

If using B12's website builder integration:

1. **Upload Static Files:**
   - Build the site locally: `bundle exec jekyll build`
   - Upload the `_site` folder contents to B12
   - Ensure all asset paths are correct

2. **Custom Domain Setup:**
   - Configure custom domain in B12 settings
   - Update `_config.yml` with your domain:
     ```yaml
     url: "https://your-domain.com"
     baseurl: "/bias-beacon"  # if using subdirectory
     ```

## Required Files Created

### `netlify.toml`
- Build configuration
- Security headers
- Asset caching
- Redirect rules
- Environment-specific settings

### `.ruby-version`
- Specifies Ruby 3.1.0 for consistent builds

## Build Process

The site will build automatically when you:
1. Push to the connected Git branch
2. Trigger manual deployment in Netlify
3. Make changes to any tracked files

## Site Structure After Deployment

```
your-domain.com/
├── /                          # Homepage
├── /bias-beacon/              # Main Bias Beacon hub
├── /bias-beacon/judges/       # Judge search & cards (173 judges)
├── /bias-beacon/counties/     # County heat map dashboard  
├── /bias-beacon/methodology/  # Bias calculation transparency
├── /bias-beacon/dashboard/    # Analytics overview
└── /bias-beacon/ai-caselaw/   # AI legal research tool
```

## Key Features Deployed

### 1. Complete Judge Database
- **173 Oregon circuit court judges** across 30 counties
- **Washington County**: All 16 judges including Thompson, Menchaca, Coburn
- **Multnomah County**: All 38 judges with comprehensive data
- **Statewide Coverage**: Marion, Jackson, Lane, Clackamas, and 26 other counties

### 2. Interactive Judge Cards
- **Individual Cards**: Professional grid layout with specializations
- **Color-Coded Risk Assessment**: Excellent (green), Low (grey), Moderate (black), High (purple), Critical (magenta)
- **Key Metrics**: Prison rates, disparity scores, reversal rates, caseload data
- **Comparison Tools**: Working "Add to Compare" functionality
- **Detailed Modals**: Full judge profiles with STOP correlation data

### 3. Oregon Heat Map Dashboard
- **County-level Bias Visualization**: Interactive tiles showing bias patterns
- **Risk Level Filtering**: Click tiles to filter judges by county/risk
- **Multiple Metrics**: Racial disparity, counsel representation, reversal rates
- **Legend System**: Clear color coding and metric explanations

### 4. STOP Data Integration
- **Traffic Stop Correlations**: Shows pipeline from stops to court appearances
- **Demographic Analysis**: Overrepresentation patterns by race
- **Search Rate Disparities**: Racial breakdown of search rates and contraband found
- **Judge Thompson Example**: Full STOP correlation analysis displayed

### 5. Methodology Documentation
- **Transparent Calculations**: Complete mathematical formulas
- **Data Source Attribution**: Oregon Judicial Department, Court of Appeals, etc.
- **Statistical Limitations**: Honest discussion of methodology constraints
- **STOP Data Integration**: Oregon Statistical Transparency of Policing analysis

## Troubleshooting

### Common Build Issues:

1. **Ruby Version Mismatch:**
   ```
   Solution: Ensure .ruby-version file specifies 3.1.0
   ```

2. **Missing Dependencies:**
   ```
   Solution: Check Gemfile.lock is committed to repository
   ```

3. **Asset Path Issues:**
   ```
   Solution: Update _config.yml baseurl for your domain structure
   ```

4. **JavaScript Not Loading:**
   ```
   Solution: Check Content-Security-Policy in netlify.toml
   ```

### Performance Optimization:

1. **Large Dataset Handling:**
   - 173 judges with comprehensive YAML data
   - Optimized JavaScript for filtering/search
   - Lazy loading for judge cards
   - Efficient Jekyll liquid templating

2. **Asset Optimization:**
   - CSS/JS minification enabled in netlify.toml
   - Image compression for any graphics
   - Browser caching headers set

## Post-Deployment Verification

### Test These Features:
1. **Judge Search**: Verify all 173 judges appear and are searchable
2. **County Filter**: Test filtering by all 30 counties
3. **Judge Comparison**: Add judges to comparison and verify modal works
4. **Heat Map**: Click county tiles and verify judge filtering
5. **STOP Data**: Check Judge Thompson's profile shows STOP correlation
6. **Color Scheme**: Verify bright colors (FB05FF, A3FF05, etc.) display correctly
7. **Mobile Responsiveness**: Test on mobile devices
8. **Performance**: Check page load times and responsiveness

## Maintenance

### Regular Updates:
- **Judge Data**: Update _data/bias-beacon/live-oregon-data.yml with new cases
- **STOP Data**: Refresh Oregon STOP statistics quarterly
- **Security**: Keep Jekyll and gems updated
- **Performance**: Monitor site speed and optimize as needed

## Support

If deployment issues occur:
1. Check Netlify build logs for specific errors
2. Verify all files are properly committed to Git
3. Test locally with `bundle exec jekyll serve`
4. Ensure B12 integration settings match expected paths

## Security Considerations

The netlify.toml includes security headers:
- XSS protection
- Content type options
- Frame options for clickjacking prevention
- CSP for script/style security
- Referrer policy for privacy

This deployment setup ensures your complete Bias Beacon system with 173 judges, STOP data integration, interactive heat maps, and comparison tools will work seamlessly on Netlify's B12 platform.