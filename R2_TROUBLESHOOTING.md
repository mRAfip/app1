# R2 Audio Playback Troubleshooting

## 🔍 **Debug Steps**

### 1. **Test R2 URL Accessibility**
- Click the "Test" button next to your track
- Check browser console for detailed logs
- Look for HTTP status codes and headers

### 2. **Check R2 Bucket Configuration**

#### **Public Access Settings:**
1. Go to Cloudflare R2 Dashboard
2. Select your bucket
3. Go to **Settings** → **Public Access**
4. Make sure **"Allow Access"** is enabled
5. Note your public URL format

#### **CORS Configuration:**
Add this CORS policy to your R2 bucket:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. **Common Issues & Solutions**

#### **Issue: "URL not accessible" (Status 403/404)**
- **Solution**: Check R2 bucket public access settings
- **Solution**: Verify file path in R2 bucket (`songs/001.mp3`)

#### **Issue: "CORS error"**
- **Solution**: Add CORS policy to R2 bucket
- **Solution**: Check AllowedOrigins includes your domain

#### **Issue: "Network error"**
- **Solution**: Check internet connection
- **Solution**: Verify R2 bucket URL is correct

#### **Issue: "Audio format not supported"**
- **Solution**: Ensure MP3 file is valid
- **Solution**: Try different audio format (WAV, M4A)

### 4. **Check Your R2 Configuration**

Edit `src/config/environment.ts` and verify:

```typescript
export const ENV_CONFIG = {
  // Make sure this URL is correct
  R2_BUCKET_URL: 'https://your-bucket-name.r2.cloudflarestorage.com/quran',
  R2_BUCKET_NAME: 'quran',
};
```

### 5. **Test URLs Manually**

Open these URLs in your browser:
- `https://your-bucket-name.r2.cloudflarestorage.com/quran/songs/001.mp3`
- Should download or play the MP3 file directly

### 6. **Console Debugging**

Check browser console for:
- "Testing URL accessibility..."
- "URL response status: 200" (should be 200)
- "Creating audio object..."
- "Audio object created successfully"

### 7. **Quick Fixes**

1. **Re-upload MP3 file** to R2 bucket
2. **Check file permissions** in R2
3. **Try different MP3 file** (smaller size)
4. **Clear browser cache** and reload

## 🎯 **Expected Behavior**

✅ **Working**: Console shows "Track started playing successfully"
❌ **Not Working**: Error dialog with specific error message

## 📞 **Next Steps**

If still not working:
1. Share the console error messages
2. Test the R2 URL directly in browser
3. Check R2 bucket CORS settings
4. Verify MP3 file format and size
