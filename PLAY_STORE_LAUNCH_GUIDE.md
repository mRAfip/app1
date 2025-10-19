# 🚀 Quran Malayalam MP3 - Play Store Launch Guide

## 📱 **Pre-Launch Checklist**

### ✅ **1. App Configuration**
- [ ] Update `app.json` with proper app details
- [ ] Set correct package name (e.g., `com.yourcompany.quranmusic`)
- [ ] Configure app version and build number
- [ ] Add proper app icons (all sizes)
- [ ] Set splash screen
- [ ] Configure permissions

### ✅ **2. App Store Assets**
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (phone and tablet)
- [ ] App description
- [ ] Privacy policy URL
- [ ] Support email

## 🛠 **Step-by-Step Launch Process**

### **Step 1: Prepare Your App**

1. **Update app.json:**
```json
{
  "expo": {
    "name": "Quran Malayalam MP3",
    "slug": "quran-malayalam-mp3",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a1a"
    },
    "android": {
      "package": "com.quranmalayalam.mp3",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

2. **Create app icons:**
   - 48x48, 72x72, 96x96, 144x144, 192x192
   - 512x512 for Play Store

### **Step 2: Build APK/AAB**

#### **Option A: Using EAS Build (Recommended)**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android
```

#### **Option B: Using Expo Build**
```bash
# Build APK
expo build:android

# Or build AAB (recommended for Play Store)
expo build:android --type app-bundle
```

### **Step 3: Google Play Console Setup**

1. **Create Google Play Console Account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay $25 one-time registration fee
   - Complete developer profile

2. **Create New App**
   - Click "Create app"
   - Fill in app details:
     - App name: "Quran Music Player"
     - Default language: English
     - App or game: App
     - Free or paid: Free

### **Step 4: Upload Your App**

1. **Go to Production Track**
   - Navigate to "Production" in left sidebar
   - Click "Create new release"

2. **Upload AAB File**
   - Upload the `.aab` file from your build
   - Add release notes
   - Set release percentage (start with 20%)

3. **Add App Content**
   - **App details:**
     ```
     Title: Quran Music Player
     Short description: Beautiful Quran recitation player with Arabic text and offline playback
     Full description: 
     Experience the beauty of Quran recitation with our elegant music player. 
     Features Arabic sura names, offline playback, search functionality, and 
     prayer times. Perfect for daily Quran listening and spiritual reflection.
     ```

### **Step 5: Store Listing**

1. **App Icon**
   - Upload 512x512 PNG icon
   - Must be high quality, no text

2. **Feature Graphic**
   - 1024x500 PNG
   - Showcase your app's main features
   - Include "Quran Music Player" text

3. **Screenshots**
   - Phone screenshots (minimum 2, maximum 8)
   - Tablet screenshots (optional)
   - Show: Home screen, player, search, download features

4. **App Description**
   ```
   🕌 Quran Music Player - Your Spiritual Companion
   
   Experience the beauty of Quran recitation with our elegant and feature-rich music player.
   
   ✨ Key Features:
   • Beautiful Arabic sura names with proper text display
   • Offline playback - download tracks for offline listening
   • Smart search - find any sura by name or number
   • Prayer times integration
   • Recent played tracks
   • Individual track downloads
   • Clean, modern interface
   
   🎵 Perfect for:
   • Daily Quran listening
   • Spiritual reflection
   • Learning Arabic sura names
   • Offline Quran recitation
   
   Download now and enhance your spiritual journey!
   ```

### **Step 6: Content Rating & Privacy**

1. **Content Rating**
   - Complete content rating questionnaire
   - Select appropriate age rating (likely 3+)

2. **Privacy Policy**
   - Create privacy policy (required)
   - Include data collection practices
   - Add to app store listing

3. **Target Audience**
   - Select appropriate categories
   - Set content rating

### **Step 7: Review & Publish**

1. **Review Checklist**
   - [ ] All required fields completed
   - [ ] App tested thoroughly
   - [ ] Screenshots uploaded
   - [ ] Privacy policy added
   - [ ] Content rating completed

2. **Submit for Review**
   - Click "Review release"
   - Google will review (1-3 days typically)
   - You'll receive email notifications

## 📋 **Required Assets Checklist**

### **App Icons**
- [ ] 48x48 px
- [ ] 72x72 px  
- [ ] 96x96 px
- [ ] 144x144 px
- [ ] 192x192 px
- [ ] 512x512 px (Play Store)

### **Screenshots (Phone)**
- [ ] Home screen with Arabic text
- [ ] Player screen
- [ ] Search functionality
- [ ] Download features
- [ ] Recent played section

### **Store Assets**
- [ ] Feature graphic (1024x500)
- [ ] App description
- [ ] Privacy policy
- [ ] Support email

## 🎯 **Marketing Tips**

### **App Store Optimization (ASO)**
- **Keywords:** Quran, Islamic, Arabic, recitation, offline, music player
- **Title:** "Quran Music Player - Arabic Recitation"
- **Description:** Include relevant keywords naturally

### **Social Media**
- Share screenshots on Islamic communities
- Post on Facebook groups about Islamic apps
- Share on Twitter with #Quran #Islamic #MobileApp

### **Community Engagement**
- Share in Islamic forums
- Post in Muslim community groups
- Get feedback from beta testers

## 📞 **Support & Maintenance**

### **Post-Launch**
- Monitor user reviews
- Respond to feedback
- Update app regularly
- Fix bugs promptly

### **Analytics**
- Set up Google Analytics
- Track user engagement
- Monitor download statistics
- Analyze user behavior

## 🚨 **Important Notes**

1. **Testing:** Test thoroughly on different devices
2. **Permissions:** Only request necessary permissions
3. **Content:** Ensure all content is appropriate
4. **Legal:** Comply with Google Play policies
5. **Updates:** Plan for regular updates

## 📱 **Final Steps**

1. **Build your app** using EAS or Expo build
2. **Create Google Play Console account**
3. **Upload your AAB file**
4. **Complete store listing**
5. **Submit for review**
6. **Wait for approval** (1-3 days)
7. **Your app goes live!** 🎉

---

**Good luck with your Quran Music Player launch!** 🌟

For any questions or issues, refer to:
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
