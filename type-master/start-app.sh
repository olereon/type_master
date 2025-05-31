#!/bin/bash

echo "Type Master - Starting Application"
echo "================================="

# Check if running in WSL
if grep -qi microsoft /proc/version; then
    echo "Detected WSL environment"
    
    # Set DISPLAY for WSLg (Windows 11) or X server (Windows 10)
    if [ -z "$DISPLAY" ]; then
        export DISPLAY=:0
    fi
    
    echo "DISPLAY set to: $DISPLAY"
    
    # Try to start dbus-daemon if not running
    if ! pgrep -x "dbus-daemon" > /dev/null; then
        echo "Starting D-Bus daemon..."
        eval $(dbus-launch --sh-syntax) 2>/dev/null || true
    fi
fi

# Check if we can run Electron or should fall back to browser
if command -v electron &> /dev/null; then
    echo ""
    echo "Starting in Electron mode..."
    echo "Note: D-Bus errors are expected in WSL and can be ignored"
    echo ""
    
    # Make sure dev server is running
    echo "Checking if dev server is running on port 3001..."
    if ! curl -s http://localhost:3001 > /dev/null; then
        echo "Dev server not running. Please run 'npm run dev' in another terminal first."
        exit 1
    fi
    
    # Run Electron with appropriate flags
    if grep -qi microsoft /proc/version; then
        npm run dev:electron-wsl
    else
        npm run dev:electron
    fi
else
    echo ""
    echo "Electron not available. Starting in browser mode..."
    echo "Open http://localhost:3001 in your browser"
    echo ""
    npm run dev:browser
fi