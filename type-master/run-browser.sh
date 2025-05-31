#!/bin/bash

echo "Type Master - Browser Mode"
echo "========================="

# Kill any existing servers
pkill -f "python3 -m http.server" 2>/dev/null || true
pkill -f "webpack.*3001" 2>/dev/null || true

# Build the app
echo "Building application..."
npm run build

# Serve the built files
echo ""
echo "Starting server on http://localhost:3002"
echo "Open this URL in your browser"
echo ""

cd dist && python3 -m http.server 3002