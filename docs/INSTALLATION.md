# Installation Guide

## Step-by-Step Installation

### 1. Install Node.js

**Windows:**
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the prompts
4. Restart your computer
5. Open Command Prompt and type: `node --version`

**Mac:**
1. Go to https://nodejs.org/
2. Download the LTS version
3. Run the installer
4. Open Terminal and type: `node --version`

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

### 2. Install Git

**Windows:**
1. Go to https://git-scm.com/download/win
2. Download and run the installer
3. Use default settings (just keep clicking Next)
4. Open Command Prompt and type: `git --version`

**Mac:**
```bash
# Install Homebrew first if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Git
brew install git
git --version
```

**Linux:**
```bash
sudo apt update
sudo apt install git
git --version
```

### 3. Set Up the Project

```bash
# Navigate to the project directory
cd medical-diagnosis-tool

# Install all dependencies
npm install

# Start the development server
npm start
```

### 4. Install Expo Go on Your Phone

**iPhone:**
1. Open the App Store
2. Search for "Expo Go"
3. Install the app by Expo

**Android:**
1. Open Google Play Store
2. Search for "Expo Go"
3. Install the app by Expo

### 5. Connect Your Phone

1. Make sure your phone and computer are on the same WiFi network
2. Open Expo Go on your phone
3. Scan the QR code that appears when you run `npm start`
4. The app should load on your phone

## Alternative: Using Simulators

### iOS Simulator (Mac Only)

1. Install Xcode from the Mac App Store (this takes a while)
2. Open Xcode and accept the license
3. In your project terminal, type: `npm run ios`

### Android Emulator

1. Download Android Studio from https://developer.android.com/studio
2. Install Android Studio and follow the setup wizard
3. Open Android Studio → More Actions → AVD Manager
4. Create a new virtual device (Pixel 4 recommended)
5. In your project terminal, type: `npm run android`

## Verification

After installation, you should be able to:

1. ✅ Run `node --version` and see a version number
2. ✅ Run `git --version` and see a version number
3. ✅ Run `npm start` in the project folder
4. ✅ See the app running on your phone or simulator
5. ✅ Fill out the patient form and see a success message

## Common Installation Issues

### "npm command not found"
- Node.js wasn't installed properly
- Restart your terminal/command prompt
- On Windows, restart your computer

### "Permission denied" on Mac/Linux
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### "Metro bundler failed to start"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### "Can't connect to Metro server"
- Check that your phone and computer are on the same WiFi
- Try disabling your firewall temporarily
- Make sure no VPN is running

### Expo Go not loading the app
- Update Expo Go to the latest version
- Close and reopen Expo Go
- Try scanning the QR code again

## Getting Help

If you're still having issues:

1. **Check the error message carefully** - Google the exact error
2. **Ask a teammate** - Someone else might have solved it
3. **Check Expo documentation** - https://docs.expo.dev/
4. **Try the web version** - Run `npm run web` to test in browser
5. **Start fresh** - Delete the project and re-download it

## Success Checklist

- [ ] Node.js installed and working
- [ ] Git installed and working
- [ ] Project dependencies installed (`npm install` completed)
- [ ] Development server starts (`npm start` works)
- [ ] App loads on phone or simulator
- [ ] Can fill out and submit the patient form
- [ ] Voice recording button shows (even if not functional yet)
- [ ] AI summary button shows (even if not functional yet)

Once you have all these working, you're ready to start development!