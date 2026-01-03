#!/bin/bash

# GlobeTrotter Start Script
# Starts both backend (Node.js) and frontend (Vite) servers

echo "🌍 Starting GlobeTrotter..."
echo "========================="
echo ""

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start backend and frontend concurrently
echo "🚀 Starting servers..."
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both processes
npm run dev-all
