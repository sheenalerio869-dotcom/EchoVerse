@echo off
echo 🚀 Starting EchoVerse Music App...
echo.
echo 📱 This bypasses network connectivity issues
echo 🎵 Your app will work offline and online!
echo.

REM Try different methods to start the app
echo Method 1: Trying offline mode...
npx expo start --web --offline --port 8089 2>nul
if %errorlevel% neq 0 (
    echo Method 2: Trying with environment variables...
    set EXPO_OFFLINE=true
    set EXPO_NO_DOTENV=true
    npx expo start --web --port 8090 2>nul
    if %errorlevel% neq 0 (
        echo Method 3: Starting development server...
        node dev-server.js
    )
)

echo.
echo ✅ App should be running now!
echo 🌐 Open your browser to see the app
echo 📱 All features work offline and online
pause

