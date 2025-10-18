# Cloudflare R2 Setup Guide

This guide will help you connect your QRAN music player to your Cloudflare R2 bucket for streaming MP3 files.

## 🚀 Quick Setup

### 1. Update R2 Configuration

Edit `src/config/environment.ts` and replace the placeholder values:

```typescript
export const ENV_CONFIG = {
  // Replace with your actual R2 bucket public URL
  R2_BUCKET_URL: 'https://your-bucket-name.r2.cloudflarestorage.com',
  
  // Your R2 API credentials (for future upload functionality)
  R2_ACCOUNT_ID: 'your_actual_account_id',
  R2_ACCESS_KEY_ID: 'your_actual_access_key_id', 
  R2_SECRET_ACCESS_KEY: 'your_actual_secret_access_key',
  R2_BUCKET_NAME: 'your_actual_bucket_name',
};
```

### 2. Upload Your MP3 Files

Upload your MP3 files to your R2 bucket with this folder structure:

```
your-r2-bucket/
├── songs/
│   ├── bag-feat-yung-bans.mp3
│   ├── no-problem-feat-lil-wayne-2-chainz.mp3
│   ├── lonely-ft-lil-skies.mp3
│   ├── humility-feat-george-benson.mp3
│   ├── fuck-love-feat-trippie-redd.mp3
│   ├── old-town-road.mp3
│   ├── blinding-lights.mp3
│   └── watermelon-sugar.mp3
└── covers/
    ├── chance-the-rapper-bag.jpg
    ├── chance-the-rapper-no-problem.jpg
    └── ... (other album covers)
```

### 3. Configure R2 Bucket for Public Access

#### Option A: Public Bucket (Recommended for music streaming)
1. Go to your Cloudflare dashboard
2. Navigate to R2 Object Storage
3. Select your bucket
4. Go to Settings → Public Access
5. Enable "Allow Access" and set up a custom domain or use the R2.dev subdomain

#### Option B: Custom Domain (Professional setup)
1. Add a custom domain to your R2 bucket
2. Update the `R2_BUCKET_URL` in your config to use your custom domain
3. Example: `https://music.yourdomain.com`

### 4. Test Your Setup

1. Start your app: `npm start`
2. Tap on any music item to test playback
3. Check the console for any error messages
4. Verify that audio streams from your R2 bucket

## 🔧 Advanced Configuration

### Environment Variables (Optional)

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_R2_BUCKET_URL=https://your-bucket-name.r2.cloudflarestorage.com
EXPO_PUBLIC_R2_ACCOUNT_ID=your_account_id
EXPO_PUBLIC_R2_ACCESS_KEY_ID=your_access_key_id
EXPO_PUBLIC_R2_SECRET_ACCESS_KEY=your_secret_access_key
EXPO_PUBLIC_R2_BUCKET_NAME=your_bucket_name
```

Then update `src/config/environment.ts` to use environment variables:

```typescript
export const ENV_CONFIG = {
  R2_BUCKET_URL: process.env.EXPO_PUBLIC_R2_BUCKET_URL || 'https://your-bucket-name.r2.cloudflarestorage.com',
  R2_ACCOUNT_ID: process.env.EXPO_PUBLIC_R2_ACCOUNT_ID || 'your_account_id',
  // ... other variables
};
```

### CORS Configuration

If you encounter CORS issues, configure your R2 bucket:

1. Go to your R2 bucket settings
2. Add CORS policy:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## 🎵 File Naming Convention

The app expects MP3 files with these exact names in the `songs/` folder:

- `bag-feat-yung-bans.mp3`
- `no-problem-feat-lil-wayne-2-chainz.mp3`
- `lonely-ft-lil-skies.mp3`
- `humility-feat-george-benson.mp3`
- `fuck-love-feat-trippie-redd.mp3`
- `old-town-road.mp3`
- `blinding-lights.mp3`
- `watermelon-sugar.mp3`

## 🚨 Troubleshooting

### Common Issues:

1. **Audio not playing**: Check that your R2 bucket allows public access
2. **CORS errors**: Configure CORS policy in your R2 bucket settings
3. **File not found**: Verify file names match exactly (case-sensitive)
4. **Slow loading**: Consider using a CDN or custom domain for better performance

### Debug Steps:

1. Test your R2 URLs directly in a browser
2. Check the React Native console for error messages
3. Verify file permissions in your R2 bucket
4. Test with a simple MP3 file first

## 📱 Testing on Device

1. **iOS Simulator**: Should work out of the box
2. **Android Emulator**: May need additional network configuration
3. **Physical Device**: Ensure device has internet connection

## 🔄 Next Steps

Once your R2 integration is working:

1. **Add more tracks**: Update `src/data/mockData.ts` with new songs
2. **Implement playlists**: Create playlist management features
3. **Add offline support**: Cache frequently played songs
4. **Analytics**: Track which songs are played most
5. **User uploads**: Allow users to upload their own music

## 📞 Support

If you encounter issues:

1. Check the React Native console for error messages
2. Verify your R2 bucket configuration
3. Test with a simple MP3 file first
4. Ensure your device has internet connectivity

Your QRAN music player is now ready to stream music from your Cloudflare R2 bucket! 🎵
