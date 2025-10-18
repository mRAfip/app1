# QRAN Music Player - Project Structure

```
my-app/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Navigation layout
│   ├── index.tsx                # Splash screen (entry point)
│   ├── home.tsx                 # Home screen route
│   └── player.tsx               # Player screen route
│
├── src/                         # Source code
│   ├── screens/                 # Screen components
│   │   ├── SplashScreen.tsx     # App launch screen
│   │   ├── HomeScreen.tsx       # Music list screen
│   │   └── PlayerScreen.tsx     # Full-screen player
│   │
│   ├── components/              # Reusable components
│   │   └── BottomPlayer.tsx     # Mini-player component
│   │
│   ├── data/                    # Data layer
│   │   └── mockData.ts          # Sample music data
│   │
│   └── types/                   # TypeScript definitions
│       └── index.ts             # Type interfaces
│
├── assets/                      # Static assets
│   └── images/                  # App images and icons
│
└── package.json                 # Dependencies and scripts
```

## Screen Flow

```
Splash Screen (3s)
       ↓
   Home Screen
   ├── Music List
   └── Bottom Player
       ↓ (tap to expand)
   Full Screen Player
   ├── Large Album Art
   ├── Track Info
   ├── Progress Bar
   ├── Playback Controls
   └── Social Engagement
```

## Key Features

- **Modular Structure**: Clear separation of screens, components, and data
- **TypeScript**: Full type safety throughout the app
- **Expo Router**: File-based navigation system
- **Responsive Design**: Works on different screen sizes
- **Clean Architecture**: Easy to extend and maintain

## Navigation

- `index.tsx` → Splash screen (auto-navigates to home)
- `home.tsx` → Home screen with music list
- `player.tsx` → Full-screen player
- Bottom player → Expands to full player on tap
