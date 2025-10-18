# Fix R2 CORS Issue - "Failed to fetch"

## 🚨 **Problem**: CORS Error
The "Failed to fetch" error means your R2 bucket is blocking requests from your web browser due to CORS (Cross-Origin Resource Sharing) restrictions.

## 🔧 **Solution**: Configure CORS in R2 Bucket

### **Step 1: Access R2 Bucket Settings**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. Click on your bucket name
4. Go to **Settings** tab

### **Step 2: Add CORS Policy**
1. Look for **"CORS Policy"** section
2. Click **"Add CORS policy"** or **"Edit CORS"**
3. Add this exact CORS configuration:

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

### **Step 3: Save and Test**
1. Click **"Save"** or **"Update"**
2. Wait 1-2 minutes for changes to propagate
3. Test your app again

## 🎯 **Alternative: Use R2.dev Subdomain**

If CORS still doesn't work, try using the R2.dev subdomain:

### **Update Your Configuration**
Edit `src/config/environment.ts`:

```typescript
export const ENV_CONFIG = {
  // Try this format instead
  R2_BUCKET_URL: 'https://your-bucket-name.r2.dev',
  R2_BUCKET_NAME: 'your-bucket-name',
};
```

### **File Structure**
Make sure your files are in the correct path:
```
your-bucket/
└── songs/
    └── 001.mp3
```

So the full URL becomes: `https://your-bucket-name.r2.dev/songs/001.mp3`

## 🔍 **Verify Your Setup**

### **Check R2 Bucket Public Access**
1. Go to **Settings** → **Public Access**
2. Make sure **"Allow Access"** is enabled
3. Note the public URL format

### **Test URL Directly**
Open this URL in your browser:
```
https://your-bucket-name.r2.dev/songs/001.mp3
```

Should either:
- ✅ Download the MP3 file
- ✅ Play the audio directly
- ❌ Show error (then CORS is still not configured)

## 🚀 **Quick Test**

After configuring CORS:
1. Wait 2-3 minutes
2. Refresh your app
3. Click "Test" button again
4. Should show "R2 URL is accessible! Status: 200"

## 📞 **Still Not Working?**

If CORS configuration doesn't work:
1. Try the R2.dev subdomain approach
2. Check if your R2 bucket has the correct permissions
3. Verify the file actually exists at the expected path
4. Try uploading a new MP3 file to test

The CORS configuration should fix the "Failed to fetch" error! 🎵
