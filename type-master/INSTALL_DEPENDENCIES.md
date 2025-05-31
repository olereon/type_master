# System Dependencies for Type Master

## Linux (Ubuntu/Debian)

Electron requires several system libraries to run on Linux. Install them with:

```bash
sudo apt-get update
sudo apt-get install -y \
  libnss3 \
  libnss3-dev \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libxss1 \
  libasound2 \
  libxtst6 \
  libatspi2.0-0 \
  libx11-xcb1 \
  libxcb-dri3-0
```

## Alternative: Run in Browser Mode

If you can't install system dependencies, you can run the app in browser mode for development:

```bash
# Terminal 1: Start the dev server
npm run dev:renderer

# Terminal 2: Open in browser
# Navigate to http://localhost:3001
```

## WSL2 Specific

If you're using WSL2, you may also need:

1. Install an X server on Windows (like VcXsrv or X410)
2. Set the DISPLAY environment variable:
   ```bash
   export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0
   ```

Or use WSLg if you have Windows 11 with WSL2.

## After Installing Dependencies

Once dependencies are installed, run:

```bash
# Terminal 1
npm run dev

# Terminal 2  
npm run dev:electron
```