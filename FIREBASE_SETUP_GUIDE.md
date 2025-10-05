# Firebase Setup Guide for EchoVerse

## 🔥 Required Firebase Console Setup

To fix the "Missing or insufficient permissions" errors, you need to configure your Firebase project:

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `finalapp-9df8e`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Save the changes

### 2. Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Done**

### 3. Set Up Firestore Security Rules
1. In Firestore Database, go to **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to mood comments for authenticated users
    match /moodComments/{mood}/comments/{commentId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow read access to all mood comments (for public viewing)
    match /moodComments/{mood}/comments/{commentId} {
      allow read: if true;
    }
  }
}
```

3. Click **Publish**

### 4. Test the Setup
1. Restart your Expo app
2. Try to add a comment
3. Check if comments load without errors

## 🚨 Alternative: Temporary Test Rules (Development Only)

If you want to test quickly without authentication, you can use these rules temporarily:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING: These rules allow anyone to read/write your database. Only use for development!**

## 📱 App Features After Setup

Once configured, your app will have:
- ✅ Real-time comment synchronization
- ✅ User authentication for comments
- ✅ Cross-device comment sharing
- ✅ Secure data storage in Firestore

## 🔧 Troubleshooting

If you still see permission errors:
1. Make sure you're logged in to the app
2. Check that Firestore rules are published
3. Verify Authentication is enabled
4. Clear app cache and restart

## 📞 Need Help?

The app will show helpful error messages if Firebase isn't configured properly. The design and functionality remain exactly the same - only the data storage changes from local to cloud!

