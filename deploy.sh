#!/bin/bash

# Deployment script for Netlify
# This ensures clean builds and proper cache busting

echo "🚀 Starting deployment process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build for production
echo "🏗️ Building for production..."
npm run build:prod

echo "✅ Build completed successfully!"
echo "📁 Deploy the 'dist' folder to Netlify"

# Optional: Preview the build locally
# echo "🌐 Starting preview server..."
# npm run preview
