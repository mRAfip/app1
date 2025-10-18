# How to Add More Music Files to R2

## 🎵 **Current Setup**

Your app is now connected to R2 and will show your `001.mp3` file.

## 📁 **To Add More Files:**

### 1. **Upload to R2 Bucket**
1. Go to your Cloudflare R2 dashboard
2. Navigate to your bucket
3. Go to the `songs/` folder
4. Upload new MP3 files with names like:
   - `002.mp3`
   - `003.mp3`
   - `004.mp3`
   - etc.

### 2. **Update the App Configuration**

Edit `src/screens/BasicHomeScreen.tsx` and update the `r2Files` array:

```typescript
const r2Files = [
  '001.mp3', // Your current file
  '002.mp3', // Add new files here
  '003.mp3',
  '004.mp3',
  // Add more as you upload them
];
```

### 3. **Restart the App**

The app will automatically fetch and display the new files!

## 🎯 **What You'll See:**

- **Loading**: "Loading music from R2..."
- **Success**: Your files listed with "R2 Server" indicator
- **Error**: Retry button if there are issues
- **Empty**: Helpful message if no files found

## 🔄 **Features:**

- ✅ **Pull to Refresh**: Swipe down to reload files
- ✅ **Error Handling**: Graceful error messages
- ✅ **Loading States**: Shows progress while fetching
- ✅ **R2 Integration**: Direct connection to your bucket

## 📱 **Current Status:**

- **Working**: ✅ R2 connection and file listing
- **Next**: Add audio playback functionality
- **Future**: Download for offline use

Your app now successfully fetches music files from your R2 bucket! 🚀
