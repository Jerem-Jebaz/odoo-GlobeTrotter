#!/bin/bash

# GlobeTrotter Backend Setup Script
# This script sets up MySQL database and installs dependencies

echo "🌍 GlobeTrotter Setup"
echo "===================="

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "   Ubuntu/Debian: sudo apt-get install mysql-server"
    echo "   macOS: brew install mysql"
    echo "   Windows: Download from https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo "✅ MySQL found"

# Create database
echo "📦 Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS globetrotter;"

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Failed to create database. Make sure MySQL is running and you have the correct password."
    exit 1
fi

# Install dependencies
echo "📚 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your MySQL credentials if needed"
echo "2. Run the backend: npm run server"
echo "3. In another terminal, run the frontend: npm run dev"
echo ""
echo "Admin credentials:"
echo "  Email: admin@globetrotter.com"
echo "  Password: admin"
