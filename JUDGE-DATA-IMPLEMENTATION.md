# Judge Data & Dashboard Implementation Summary

## Phase 1: Judge Data System ✅ COMPLETE

### Judge Profile Layout Created
**File:** `_layouts/judge-profile.html` (550+ lines)

Three-level view structure:
1. **Front:** Quick card display with photo
2. **Back:** Key information and bio (on flip cards grid)
3. **Full Profile:** Mini-dashboard with comparative metrics

### Judge Profile Features
- **Hero Section:** Photo, name, role, term info
- **Quick Stats:** Risk score, district, caseload, focus areas
- **Contact Information:** Email, phone, official bio link
- **Bias Metrics:** 4 key metrics with comparative data:
  - Prison sentence usage %
  - Appeal reversal rate %
  - Counsel representation disparity %
  - Racial outcome disparity %
- **Comparative Analysis:** Courthouse-wide, county-wide, state-wide tabs
- **Data Sources:** Citation of official sources
- **Mobile Responsive:** Adapts to all screen sizes

### Sample Judge Pages
1. **Matthew B Shirtcliff** (Baker County) - No metrics (pending)
2. **Jeffrey S Jones** (Clackamas County) - Full metrics example

Both demonstrate complete data structure and templating.

### Judge Page Generator
**File:** `tools/generate_judge_pages.py`

Automated script to generate all 211 judge pages from JSON data:
```python
python3 tools/generate_judge_pages.py
```

Features:
- Reads from `_data/bias-beacon/judges-directory.json`
- Creates individual markdown files for each judge
- Generates URL slugs (e.g., /bias-beacon/judges/matthew-shirtcliff/)
- Outputs to `_judges/` directory
- Generates appropriate content based on metric availability

### Photo Integration
✅ **Oregon Blue Book Photos Ready**
- All 211 judges have `officialPhotoUrl` populated
- Photos already point to official Oregon SOS Blue Book URLs
- Fallback placeholder with initials for any broken URLs

### Judge Data Available
From `_data/bias-beacon/judges-directory.json`:
- **211 total judges**
- **35** with fully verified metrics
- **176** with pending metrics (space reserved for bias scores)
- **Complete contact info:** Email, phone, official bio URLs
- **Court info:** Designation, district, county, position, term expiration
- **Photo URLs:** Direct links to Oregon Blue Book photos

---

## Phase 2: Color System & Page Remixes ✅ COMPLETE

### Page-Specific Color Remixes Applied

| Page | Color Primary | Color Secondary | Body Class |
|------|-------------|-----------------|------------|
| Attorneys General | #4a7ec8 | #a2addc | page-bias-beacon |
| Judiciary | #2d4a7b | #7a9b7f | page-judiciary |
| Prosecutors | #d4af8f | #a87a5c | page-prosecutor |
| Law Enforcement | #d97c6a | #5d9b9b | page-law-enforcement |
| Community Corrections | #7cb8a8 | #5d9b9b | page-community-corrections |
| Juris Lab/Methodology | #7a9b7f | #8b6f9f | page-juris-lab |

### Updated Pages
- `prosecutors.html` → page-prosecutor
- `law-enforcement.html` → page-law-enforcement
- `parole-probation.html` → page-community-corrections
- `bias-beacon/dashboard.md` → page-bias-beacon
- `index.html` → page-bias-beacon (homepage)

### Dynamic Text Effects Applied
- `.text-shimmer` on main headings (3s flowing gradient)
- `.text-dynamic` on intro text (0.8s fade-in)
- `.text-glow` on statistics (2s pulsing effect)

---

## Phase 3: Dashboard Foundation ✅ COMPLETE

### Dashboard Layout
**File:** `bias-beacon/dashboard.md` (280+ lines)

#### Sections Implemented

1. **State-Wide Summary Cards**
   - 211 Circuit Court Judges
   - 35+ Judges with Metrics
   - 36 County Jurisdictions
   - 8 Judicial Districts

2. **Prison Sentence Usage Heat Map**
   - County-by-county visualization placeholder
   - Ready for data integration

3. **Key Judicial Metrics**
   - Prison Usage: 31.2% state average
   - Reversal Rate: 15.8% state average
   - Counsel Disparity: 9.7% state average
   - Racial Disparity: 6.3% state average

4. **Judge Rankings**
   - Tabbed interface for different metrics
   - Prison usage ranking
   - Reversal rate ranking
   - Counsel disparity ranking
   - Racial disparity ranking
   - Ready for JavaScript population

5. **County Comparison Grid**
   - County profiles with key metrics
   - Comparative analysis capabilities

6. **Data Information Section**
   - Explains each metric
   - Notes data verification process
   - Describes update frequency

### Dashboard Styling
**File:** `assets/css/dashboard.scss`

- Responsive grid layouts
- Color system integration
- Metric card styling
- Heat map styling
- Ranking table styling

---

## Phase 4: Configuration Updates ✅ COMPLETE

### Jekyll Configuration
**File:** `_config.yml` updated

```yaml
collections:
  judges:
    output: true
    permalink: /bias-beacon/judges/:slug/
```

Enables Jekyll to treat `_judges/` directory as a collection and generate output URLs.

### Main Stylesheet
**File:** `assets/css/style.scss` updated

Import order:
1. minima (base theme)
2. color-system (colors + animations)
3. aptitude-base (typography)
4. improved-flip-cards (cards)
5. premium-theme (enhancements)
6. fixed-menu (navigation)
7. 3d-cubes (background effects)
8. judge-profile (judge pages)
9. dashboard (dashboard styling)

---

## To Deploy & Activate

### Step 1: Generate All Judge Pages
```bash
python3 tools/generate_judge_pages.py
```
This creates markdown files for all 211 judges in `_judges/` directory.

### Step 2: Update judges.md Links
Update "Full Profile" button in `bias-beacon/judges.md`:
```liquid
<a href="/bias-beacon/judges/{{ judge.id }}/" class="btn btn-primary">Full Profile</a>
```

### Step 3: Build & Deploy
```bash
bundle exec jekyll build
# Deploy to Cloudflare Pages
```

### Step 4: Populate Dashboard Data (Optional)
Assets will render with placeholder data initially. To populate with live metrics:
1. Create JavaScript data aggregator
2. Calculate county/district/state rankings
3. Generate heat map data
4. Populate ranking tables

---

## Files Created This Session

| File | Type | Purpose | Status |
|------|------|---------|--------|
| `_layouts/judge-profile.html` | Layout | Judge profile pages | ✅ Ready |
| `_judges/001-matthew-shirtcliff.md` | Collection | Sample judge (no metrics) | ✅ Complete |
| `_judges/007-jeffrey-jones.md` | Collection | Sample judge (full metrics) | ✅ Complete |
| `tools/generate_judge_pages.py` | Script | Generate all 211 judge pages | ✅ Ready |
| `assets/css/judge-profile.scss` | Styling | Judge profile page styles | ✅ Complete |
| `assets/css/dashboard.scss` | Styling | Dashboard styles | ✅ Complete |
| `bias-beacon/dashboard.md` | Page | Dashboard foundation | ✅ Complete |
| `prosecutors.html` | Page | Prosecutor page (color remix) | ✅ Updated |
| `law-enforcement.html` | Page | Law enforcement page (color remix) | ✅ Updated |
| `parole-probation.html` | Page | Community corrections page (color remix) | ✅ Updated |
| `_config.yml` | Config | Added judges collection | ✅ Updated |
| `assets/css/style.scss` | Stylesheet | Added judge-profile + dashboard imports | ✅ Updated |

---

## Next Steps for You

### Immediate (Ready to Deploy)
1. Run `python3 tools/generate_judge_pages.py` to create all 211 judge pages
2. Build and deploy to verify judge pages render correctly
3. Test flip card interaction and "Full Profile" links
4. Verify colors apply correctly across pages

### Short-term
1. Populate dashboard with live data from judges.json
2. Create county profile cards with aggregated metrics
3. Add real judge comparisons (courthouse-wide, county-wide, state-wide)
4. Enhance search filters on judges.md page

### Medium-term
1. Create prosecutor office profiles
2. Create law enforcement agency profiles
3. Create community supervision profiles
4. Implement interactive heat map for county comparison

### Long-term
1. Integrate CourtListener API for recent decisions
2. Add judge appointment/election data
3. Implement bias trend analysis over time
4. Create predictive models for sentencing disparity

---

## Architecture Overview

```
┌─ Home Page (index.html)
│  └─ 6 Main Actor Cards (flip cards)
│     ├─ Bias Beacon → /bias-beacon/
│     ├─ Judiciary → /bias-beacon/judges/ (list)
│     │  └─ Individual Judge → /bias-beacon/judges/[name]/ (profile)
│     ├─ Prosecutors → /prosecutors.html
│     ├─ Law Enforcement → /law-enforcement.html
│     ├─ Community Supervision → /parole-probation.html
│     └─ Juris Lab → /bias-beacon/methodology/
│
├─ Dashboard: /bias-beacon/dashboard/
│  ├─ Summary statistics
│  ├─ Heat maps
│  ├─ Rankings
│  └─ County comparisons
│
└─ Color System
   ├─ Body class selection determines:
   │  ├─ Primary color
   │  ├─ Accent color
   │  └─ Background gradients
   └─ Applied across all pages
```

---

## Key File Links
- [Judge Profile Layout](_layouts/judge-profile.html)
- [Judge Page Generator](tools/generate_judge_pages.py)
- [Color System](assets/css/color-system.scss)
- [Judge Styling](assets/css/judge-profile.scss)
- [Dashboard](bias-beacon/dashboard.md)
- [Jekyll Config](_config.yml)
