# QRAN Music Player

A React Native/Expo music player app with a modern UI design featuring a splash screen, home screen with music list, and a bottom drawer player that expands to full screen.

## Project Structure

```
src/
├── screens/
│   ├── SplashScreen.tsx      # App launch screen
│   ├── HomeScreen.tsx        # Main screen with music list
│   └── PlayerScreen.tsx      # Full-screen player
├── components/
│   └── BottomPlayer.tsx      # Bottom drawer mini-player
├── data/
│   └── mockData.ts           # Sample music data
└── types/
    └── index.ts              # TypeScript type definitions

app/
├── index.tsx                 # Entry point (splash screen)
├── home.tsx                  # Home screen route
├── player.tsx                # Player screen route
└── _layout.tsx               # Navigation layout
```

## Features

### 🎵 Core Functionality
- **Splash Screen**: 3-second loading screen with QRAN branding
- **Home Screen**: Dark-themed music list with album art thumbnails
- **Bottom Player**: Persistent mini-player at the bottom of home screen
- **Full Screen Player**: Expanded player with album art, controls, and engagement buttons

### 🎨 UI Components
- **Music List**: Scrollable list with album art, track info, and genre tags
- **Bottom Drawer**: Mini-player with progress bar and basic controls
- **Full Player**: Large album art, progress bar, playback controls, and social engagement
- **Navigation**: Smooth transitions between screens

### 🎛️ Player Controls
- Play/Pause functionality
- Previous/Next track navigation
- Progress bar with time display
- Social engagement buttons (likes, comments, shares)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Screen Flow

1. **Splash Screen** → Automatically navigates to home after 3 seconds
2. **Home Screen** → Shows music list with bottom player
3. **Tap Bottom Player** → Opens full-screen player
4. **Full Screen Player** → Tap back arrow to return to home

## Customization

### Adding New Music
Edit `src/data/mockData.ts` to add your own tracks:

```typescript
{
  id: 'unique-id',
  title: 'Song Title',
  artist: 'Artist Name',
  albumArt: 'https://your-image-url.com/image.jpg',
  genre: 'Genre',
  duration: '3:45',
}
```

### Styling
- Colors and themes are defined in each component's StyleSheet
- Dark theme for home screen, light theme for player
- Responsive design with proper spacing and typography

## Next Steps

This is the basic UI implementation. Future enhancements could include:

- **Audio Playback**: Integrate with react-native-track-player
- **Playlists**: Create and manage custom playlists
- **Search**: Add music search functionality
- **Offline Support**: Download music for offline listening
- **User Accounts**: Login and sync across devices
- **Social Features**: Share music and follow other users

## Dependencies Used

- **Expo Router**: File-based navigation
- **React Native**: Core mobile framework
- **TypeScript**: Type safety and better development experience
- **React Native Gesture Handler**: For smooth interactions (ready for future use)

## Development Notes

- All components are functional components with TypeScript
- Mock data is used for demonstration
- UI matches the provided design reference
- Responsive design works on different screen sizes
- Clean separation of concerns with proper folder structure
