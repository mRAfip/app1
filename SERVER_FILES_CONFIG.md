# Server Files Configuration

## 🎵 **Current Server Files**

Your R2 bucket currently has these files in the `songs/` folder:
- `001.mp3` ✅ (Uploaded)

## 📁 **How to Add More Files**

### 1. **Upload Files to R2**
1. Go to your Cloudflare R2 dashboard
2. Navigate to your bucket
3. Go to the `songs/` folder
4. Upload your MP3 files with names like:
   - `002.mp3`
   - `003.mp3`
   - `004.mp3`
   - etc.

### 2. **Update the App Configuration**

Edit `src/services/r2Service.ts` and update the `musicFiles` array:

```typescript
const musicFiles = [
  '001.mp3', // Your current file
  '002.mp3', // Add new files here
  '003.mp3',
  '004.mp3',
  // Add more as you upload them
];
```

### 3. **File Naming Convention**

- Use simple names: `001.mp3`, `002.mp3`, etc.
- The app will automatically format them for display:
  - `001.mp3` → "001"
  - `song-name.mp3` → "Song Name"
  - `my_song.mp3` → "My Song"

## 🎨 **Display Format**

The app will show:
- **Title**: Formatted file name (e.g., "001" for `001.mp3`)
- **Artist**: "Unknown Artist" (you can customize this later)
- **Genre**: "Music"
- **Source**: "Server" (indicating it's from your R2 bucket)

## 🔄 **Automatic Updates**

The app will:
- ✅ Fetch files from your R2 bucket on startup
- ✅ Show loading state while fetching
- ✅ Handle errors gracefully with retry option
- ✅ Support pull-to-refresh to reload files
- ✅ Use local files when downloaded, remote when not

## 📱 **User Experience**

1. **First Launch**: Users see your server files
2. **Download Option**: Users can download files for offline use
3. **Smart Playback**: Uses local files when available, streams when needed
4. **File Management**: Users can manage downloaded files via storage settings

## 🚀 **Ready to Use!**

Your app now:
- ✅ Fetches files from your R2 server
- ✅ Displays actual file names from server
- ✅ Supports offline downloading
- ✅ Handles loading and error states
- ✅ Provides smooth user experience

Just upload more MP3 files to your R2 `songs/` folder and update the configuration file! 🎵
