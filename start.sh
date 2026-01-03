#!/bin/bash

# GlobeTrotter Development Server Starter Script

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌍 Starting GlobeTrotter...${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}📦 Installing dependencies...${NC}"
  npm install
  echo ""
fi

# Start the dev server
echo -e "${GREEN}✅ Dev server starting...${NC}"
echo -e "${BLUE}🚀 Open your browser to: http://localhost:5173${NC}"
echo ""

npm run dev
