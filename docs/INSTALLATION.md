# Installation

## Requirements

1. **Node.js** (v18+) - https://nodejs.org/
2. **Git** - https://git-scm.com/
3. **Expo Go** app on your phone

## Setup

```bash
# Clone repository
git clone https://github.com/swimmingkirby/medical-diagnosis-tool.git
cd medical-diagnosis-tool

# Install dependencies
npm install

# Start development server
npm start
```

## Testing

**Phone (Recommended):**
1. Install Expo Go from App Store/Google Play
2. Scan QR code from terminal
3. Ensure same WiFi network

**Computer:**
- `npm run web` - Web browser
- `npm run android` - Android emulator
- `npm run ios` - iOS simulator (Mac only)

## Common Issues

**Metro won't start:**
```bash
npx expo start --clear
```

**Can't connect:**
- Check WiFi connection
- Update Expo Go app
- Restart development server

**Module errors:**
```bash
rm -rf node_modules
npm install
```