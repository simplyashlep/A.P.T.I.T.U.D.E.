#!/bin/bash

# Bias Beacon - Build Script for Static Deployment
# This script builds the Jekyll site and validates it's ready for deployment

echo "🚀 Building Bias Beacon for static deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf _site
rm -rf .jekyll-cache

# Install dependencies
echo "📦 Installing dependencies..."
bundle install

# Build for production
echo "🏗️ Building Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build --config _config.yml

# Validate build
if [ -d "_site" ]; then
    echo "✅ Build successful!"
    
    # Check for critical files
    echo "🔍 Validating critical files..."
    
    if [ -f "_site/index.html" ]; then
        echo "✅ Homepage found"
    else
        echo "❌ Homepage missing"
        exit 1
    fi
    
    if [ -f "_site/bias-beacon/index.html" ]; then
        echo "✅ Bias Beacon hub found"
    else
        echo "❌ Bias Beacon hub missing"
        exit 1
    fi
    
    if [ -f "_site/bias-beacon/judges/index.html" ]; then
        echo "✅ Judge search page found"
    else
        echo "❌ Judge search page missing"
        exit 1
    fi
    
    if [ -d "_site/assets/js/bias-beacon" ]; then
        echo "✅ JavaScript assets found"
    else
        echo "❌ JavaScript assets missing"
        exit 1
    fi
    
    if [ -d "_site/assets/css" ]; then
        echo "✅ CSS assets found"
    else
        echo "❌ CSS assets missing"
        exit 1
    fi
    
    # Count judge data
    JUDGE_COUNT=$(grep -c "id:" _data/bias-beacon/live-oregon-data.yml | grep -v "oregon_stop_data")
    echo "📊 Judge database contains: $JUDGE_COUNT judges"
    
    if [ "$JUDGE_COUNT" -gt 170 ]; then
        echo "✅ Complete judge database (173+ judges expected)"
    else
        echo "⚠️ Incomplete judge database (found $JUDGE_COUNT, expected 173+)"
    fi
    
    # Check for STOP data
    if grep -q "oregon_stop_data" _data/bias-beacon/live-oregon-data.yml; then
        echo "✅ STOP data integration found"
    else
        echo "❌ STOP data integration missing"
    fi
    
    # Site size
    SITE_SIZE=$(du -sh _site | cut -f1)
    echo "📦 Site size: $SITE_SIZE"
    
    echo ""
    echo "🎉 Build validation complete!"
    echo "📁 Site ready for deployment in '_site' directory"
    echo ""
    echo "🚀 Deploy options:"
    echo "   1. Import the repository into Cloudflare Pages"
    echo "   2. Use build command: bundle exec jekyll build"
    echo "   3. Use output directory: _site"
    echo ""
    echo "🔗 You can also upload the built '_site' directory to any static host"
    
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi
