# Bias Beacon - Netlify B12 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Repository Setup
- [ ] All files committed to Git repository
- [ ] Repository connected to Netlify
- [ ] Build settings configured in Netlify dashboard

### ✅ Configuration Files
- [ ] `netlify.toml` - Build configuration and security headers
- [ ] `.ruby-version` - Ruby 3.1.0 specified  
- [ ] `_config.yml` - Production settings enabled
- [ ] `Gemfile` - All Jekyll dependencies included

### ✅ Bias Beacon Core Features
- [ ] **Judge Database**: 173+ judges across 30 Oregon counties
- [ ] **Washington County**: Thompson, Menchaca, Coburn included
- [ ] **Data Quality**: No duplicate judges (Souede, Burton, Cherniak cleaned up)
- [ ] **STOP Integration**: Oregon traffic stop correlation data added

### ✅ Visual Interface
- [ ] **Color Scheme**: FB05FF, A3FF05, EBEBEB, 000000, 8100FF applied
- [ ] **Judge Cards**: Individual cards with proper grid layout
- [ ] **Risk Assessment**: Color-coded excellent/low/moderate/high/critical
- [ ] **Comparison Panel**: "Add to Compare" functionality working

### ✅ Interactive Features  
- [ ] **Heat Map**: County-level bias visualization with clickable tiles
- [ ] **Search Function**: Judge name, county, department search
- [ ] **Filter System**: County, risk level, time period filters
- [ ] **Modal System**: Detailed judge profiles with STOP data

### ✅ Content Pages
- [ ] **Homepage**: Public Accountability Project landing
- [ ] **Bias Beacon Hub**: Main dashboard with 173 judge count
- [ ] **Judge Search**: Complete database with all counties
- [ ] **County Heat Map**: Interactive Oregon map with bias patterns
- [ ] **Methodology**: Transparent bias calculation documentation
- [ ] **AI Caselaw**: Legal research integration

## Netlify Build Settings

### Build Command
```bash
bundle exec jekyll build
```

### Publish Directory
```
_site
```

### Environment Variables (Optional)
```
JEKYLL_ENV=production
RUBY_VERSION=3.1.0
```

## Post-Deployment Testing

### 🔍 Functionality Tests
- [ ] **Judge Search**: Search for "Thompson" finds Judge Patricia Thompson
- [ ] **County Filter**: Select "Washington" shows 16 judges
- [ ] **Risk Filter**: Select "Critical" shows high-risk judges
- [ ] **Comparison**: Add judges to compare, modal opens with side-by-side data
- [ ] **Heat Map**: Click county tiles filter judge results
- [ ] **STOP Data**: Judge Thompson profile shows traffic stop correlation

### 🎨 Visual Verification
- [ ] **Bright Colors**: Magenta (FB05FF) for critical alerts
- [ ] **Green Accents**: (A3FF05) for excellent ratings
- [ ] **Clean Layout**: Light grey (EBEBEB) backgrounds
- [ ] **Dark Text**: Black (000000) for readability
- [ ] **Purple Highlights**: (8100FF) for high-risk indicators

### 📱 Responsive Design
- [ ] **Desktop**: All features work on desktop browsers
- [ ] **Tablet**: Heat map and cards display properly on tablets  
- [ ] **Mobile**: Judge cards stack vertically, search functions work

### ⚡ Performance
- [ ] **Page Load**: Homepage loads under 3 seconds
- [ ] **Judge Search**: Filter results appear instantly
- [ ] **Large Dataset**: 173 judges load without lag
- [ ] **Asset Loading**: CSS/JS assets load from CDN

## Common Deployment Issues & Solutions

### Issue: Build Fails
**Solution**: Check Ruby version, ensure all gems in Gemfile.lock

### Issue: Judge Data Missing  
**Solution**: Verify `_data/bias-beacon/live-oregon-data.yml` file size and structure

### Issue: Colors Not Displaying
**Solution**: Check CSS variables in `_sass/_bias-beacon.scss` and cache clearing

### Issue: JavaScript Not Working
**Solution**: Verify CSP headers in `netlify.toml` allow inline scripts

### Issue: 404 on Judge Pages
**Solution**: Check permalink structure and redirect rules in `netlify.toml`

## Success Metrics

### Complete Deployment Includes:
- ✅ **173 Oregon Judges** searchable across 30 counties
- ✅ **STOP Data Integration** showing traffic stop to court pipeline
- ✅ **Interactive Heat Map** with clickable county filtering  
- ✅ **Working Comparison Tools** with side-by-side judge analysis
- ✅ **Methodology Documentation** with transparent bias calculations
- ✅ **Responsive Design** working on all device sizes
- ✅ **Bright Color Scheme** fully implemented and visible
- ✅ **No Duplicate Data** - all judge database issues resolved

## Final Validation Commands

### Local Testing
```bash
# Run build validation
./build.sh

# Start local server
bundle exec jekyll serve

# Test at http://localhost:4000
```

### Remote Testing  
```bash
# Check site is live
curl -I https://your-netlify-domain.com

# Validate specific pages
curl -I https://your-netlify-domain.com/bias-beacon/judges/
```

## Deployment Complete When:
1. All 173 judges display with individual cards
2. Color scheme (FB05FF, A3FF05, EBEBEB, 000000, 8100FF) is visible
3. Heat map shows interactive Oregon counties  
4. Judge comparison modal works with STOP data
5. Search and filter functions operate correctly
6. Mobile responsiveness confirmed
7. Page load times under 3 seconds
8. No console errors in browser developer tools

---
**Note**: The Bias Beacon system represents the most comprehensive judicial bias analysis platform for Oregon, featuring complete judge coverage, STOP data correlation, and transparent methodology documentation.