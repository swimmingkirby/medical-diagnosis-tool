# Medical Diagnosis Tool

React Native app for offline medical data collection with voice recording, AI transcription, and blockchain storage.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Testing the App

**Phone (Recommended):**
1. Install "Expo Go" from App Store/Google Play
2. Scan QR code from terminal
3. Make sure phone and computer are on same WiFi

**Computer:**
- Press `w` for web browser
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)

## Current Features

- ✅ Patient form with validation
- ✅ Voice recording UI (mock functionality)
- ✅ AI summarization UI (mock functionality)
- ❌ Real voice recording (next phase)
- ❌ AI services integration (next phase)
- ❌ Blockchain storage (next phase)

## Project Structure

```
src/
├── components/           # UI components
├── types/               # TypeScript interfaces
└── utils/               # Helper functions
```

## Common Issues

**App won't start:**
```bash
npx expo start --clear
```

**Can't connect to phone:**
- Check WiFi connection
- Update Expo Go app
- Restart development server

## Development

- Files auto-reload when saved
- Press `r` to manually reload
- Use `console.log()` for debugging
- Shake phone for developer menu