#!/bin/bash

# Start D-Bus if not running
if ! pgrep -x "dbus-daemon" > /dev/null; then
    echo "Starting D-Bus..."
    dbus-launch --sh-syntax > /tmp/dbus-env
    source /tmp/dbus-env
fi

# Set display if not set
if [ -z "$DISPLAY" ]; then
    export DISPLAY=:0
fi

# Run Electron with flags to disable GPU sandboxing in WSL
cd "$(dirname "$0")"
npm run dev:electron-wsl