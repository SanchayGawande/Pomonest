#!/bin/bash

# 🚀 WorkStreak Production Deployment Script

echo "🚀 Starting WorkStreak deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Clean and build
print_status "Cleaning previous builds..."
rm -rf .next node_modules/.cache

print_status "Installing dependencies..."
pnpm install

print_status "Running production build..."
if pnpm build; then
    print_status "Build successful!"
else
    print_error "Build failed. Check errors above."
    exit 1
fi

# Step 2: Deploy to Vercel
print_status "Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
    print_status "Deployment complete!"
else
    print_warning "Vercel CLI not found. Install with: npm i -g vercel"
    print_warning "Or deploy via GitHub integration at vercel.com"
fi

# Step 3: Deployment checklist
echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "📋 Post-Deployment Checklist:"
echo "• ⏳ Test all pages load correctly"
echo "• ⏳ Verify authentication works"
echo "• ⏳ Test Pro subscription flow"
echo "• ⏳ Check mobile responsiveness"
echo "• ⏳ Validate SEO metadata"
echo "• ⏳ Monitor performance metrics"
echo ""
echo "📈 Next Steps:"
echo "• Add content for AdSense approval"
echo "• Build organic traffic"
echo "• Apply for Google AdSense in 2-3 weeks"
echo ""
echo "🔗 Resources:"
echo "• Production Checklist: ./PRODUCTION_CHECKLIST.md"
echo "• Deployment Guide: ./DEPLOYMENT_GUIDE.md"
echo "• AdSense Setup: ./GOOGLE_ADS_SETUP.md"

print_status "Ready for production! 🚀"