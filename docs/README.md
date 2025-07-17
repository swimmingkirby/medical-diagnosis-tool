# Medical Diagnosis Tool - Getting Started Guide

## Overview

This is a React Native mobile app built with Expo that helps doctors collect patient data offline. The app includes voice recording, AI transcription, and blockchain storage features.

## Prerequisites

Before you start, make sure you have these installed on your computer:

### Required Software

1. **Node.js** (version 18 or later)
   - Download from: https://nodejs.org/
   - Check if installed: `node --version`

2. **Git**
   - Download from: https://git-scm.com/
   - Check if installed: `git --version`

3. **Expo CLI** (will be installed automatically)

### Mobile Testing Options

Choose one of these options to test the app:

**Option A: Physical Device (Recommended)**
- Install "Expo Go" app from App Store (iOS) or Google Play Store (Android)
- Make sure your phone and computer are on the same WiFi network

**Option B: Simulator/Emulator**
- **iOS**: Xcode (Mac only) - Install from Mac App Store
- **Android**: Android Studio - Download from https://developer.android.com/studio

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to your project folder
cd medical-diagnosis-tool

# Install dependencies
npm install
```

### 2. Start the Development Server

```bash
# Start Expo development server
npm start
```

This will open a web page with a QR code and several options.

### 3. Run on Your Device

**Using Physical Device:**
1. Open the Expo Go app on your phone
2. Scan the QR code from the terminal or web page
3. The app will load on your phone

**Using Simulator:**
- Press `i` in the terminal to open iOS simulator (Mac only)
- Press `a` in the terminal to open Android emulator
- Or click the respective buttons in the web interface

## Available Commands

```bash
# Start development server
npm start

# Start with specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator (Mac only)
npm run web        # Web browser

# Clear cache if you have issues
npx expo start --clear
```

## Project Structure

```
medical-diagnosis-tool/
├── App.tsx                 # Main app component
├── src/
│   ├── components/         # UI components
│   │   ├── PatientIntakeForm.tsx
│   │   ├── VoiceRecorder.tsx
│   │   └── LLMSummarizer.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Helper functions
│       └── validation.ts
├── docs/                  # Documentation
├── package.json           # Dependencies and scripts
└── README.md
```

## Current Features (UI Only)

The current version includes basic UI components without backend integration:

- ✅ Patient intake form with validation
- ✅ Voice recording button (UI only)
- ✅ AI summarization button (UI only)
- ✅ Form submission with mock data
- ❌ Actual voice recording (coming next)
- ❌ Real AI transcription (coming next)
- ❌ Blockchain storage (coming next)

## Troubleshooting

### Common Issues

**"Metro bundler not starting"**
```bash
npx expo start --clear
```

**"Can't connect to development server"**
- Make sure your phone and computer are on the same WiFi
- Try restarting the Expo development server
- Check if your firewall is blocking the connection

**"Module not found" errors**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Expo Go app not loading**
- Make sure you have the latest version of Expo Go
- Try closing and reopening the Expo Go app
- Restart your phone if needed

### Getting Help

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Look at [React Native documentation](https://reactnative.dev/docs/getting-started)
3. Ask team members for help
4. Check the project's GitHub issues

## Next Steps

Once you have the basic app running:

1. Test the UI components and form validation
2. Try the voice recording button (shows placeholder for now)
3. Test the AI summarization button (shows mock response)
4. Submit a patient form to see the success message

The next development phases will add:
- Real voice recording with expo-av
- Docker services for AI processing
- Local blockchain integration
- Offline data storage

## Development Tips

- Use `console.log()` to debug - check the terminal or browser console
- The app auto-refreshes when you save files
- Press `r` in the terminal to manually reload
- Press `m` to toggle the developer menu on your device
- Shake your physical device to open the developer menu