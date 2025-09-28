# Network Troubleshooting Guide

## 🔧 Fixing "Fetch Failed" Errors

If you're seeing "fetch failed" errors, here are the solutions:

### 1. **Restart Expo Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart with a different port
npx expo start --web --port 8083 --clear
```

### 2. **Clear Cache and Restart**
```bash
# Clear all caches
npx expo start --web --clear --reset-cache
```

### 3. **Check Network Connection**
- Ensure you have a stable internet connection
- Try accessing other websites to verify connectivity
- Check if your firewall is blocking the connection

### 4. **Use Different Port**
```bash
# Try different ports if 8081/8082 are busy
npx expo start --web --port 8084
npx expo start --web --port 8085
```

### 5. **Offline Mode**
The app now has **offline fallback** - if Firebase is unavailable:
- ✅ Comments are saved locally
- ✅ App works without internet
- ✅ Data syncs when connection returns
- ✅ No data loss

### 6. **Firebase Setup Issues**
If you see permission errors:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `finalapp-9df8e`
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Set up security rules (see `FIREBASE_SETUP_GUIDE.md`)

### 7. **Alternative Development Setup**
If network issues persist:
```bash
# Use local development mode
npx expo start --localhost
# or
npx expo start --tunnel
```

## 🚀 **App Features**

### **Online Mode (Firebase Connected):**
- Real-time comment synchronization
- Cross-device data sharing
- User authentication
- Cloud storage

### **Offline Mode (Network Issues):**
- Local comment storage
- Full app functionality
- Data preserved locally
- Automatic sync when online

## 📱 **Status Indicators**

- **Green**: Online, Firebase connected
- **Red**: Offline, using local storage
- **No indicator**: Normal operation

## 🔄 **Data Synchronization**

When the app goes back online:
- Local comments are preserved
- Firebase comments are loaded
- Both datasets are merged
- No data loss occurs

## 📞 **Still Having Issues?**

1. **Check Expo CLI version**: `npx expo --version`
2. **Update Expo CLI**: `npm install -g @expo/cli@latest`
3. **Clear node_modules**: `rm -rf node_modules && npm install`
4. **Restart your computer** (sometimes helps with network issues)

The app is designed to work in both online and offline modes, so you'll never lose your data!

