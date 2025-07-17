# Team Setup Guide

## Team Member Responsibilities

### Hamza (DevOps / Self-hosted AI)
**Focus**: Docker services, AI backends, infrastructure

**Setup Requirements**:
- Docker Desktop installed and running
- Python 3.10+ for AI services
- Basic knowledge of Flask APIs

**Your Tasks**:
- Set up Whisper transcription service in Docker
- Set up LLM summarization service in Docker  
- Set up Ganache blockchain in Docker
- Create docker-compose.yml for all services

### Tayyeb (Frontend Developer)
**Focus**: React Native integration, API connections

**Setup Requirements**:
- Node.js and Expo CLI
- Understanding of React Native and TypeScript
- HTTP client knowledge (fetch/axios)

**Your Tasks**:
- Integrate voice recording with expo-av
- Connect frontend to Whisper API
- Connect frontend to LLM API
- Implement blockchain integration with ethers.js

### Akram (Designer / Vibe Coder)
**Focus**: UI/UX design and styling

**Setup Requirements**:
- Node.js and Expo CLI
- Eye for design and user experience
- React Native styling knowledge

**Your Tasks**:
- Improve UI components styling
- Create consistent design system
- Add loading states and animations
- Ensure good user experience flow

### Liban (Beginner Dev)
**Focus**: Learning and supporting UI development

**Setup Requirements**:
- Node.js and Expo CLI
- Willingness to learn React Native basics
- Pair programming with Akram

**Your Tasks**:
- Help with UI component development
- Test the app on different devices
- Write basic components under guidance
- Document any issues found

### Temis (Full Stack)
**Focus**: Integration, storage, blockchain

**Setup Requirements**:
- Node.js and Expo CLI
- Understanding of blockchain basics
- Local storage and data management

**Your Tasks**:
- Implement AsyncStorage for local data
- Create blockchain integration logic
- Connect all components together
- Handle error states and edge cases

## Development Workflow

### Day 1: Setup and Foundation
1. **Everyone**: Get the basic app running on your device
2. **Hamza**: Start Docker service setup
3. **Tayyeb**: Begin voice recording implementation
4. **Akram + Liban**: Improve UI styling
5. **Temis**: Set up local storage

### Day 2: Integration
1. **Hamza**: Complete Docker services
2. **Tayyeb**: Connect frontend to services
3. **Akram + Liban**: Polish UI and add feedback
4. **Temis**: Implement blockchain storage

### Day 3: Testing and Demo
1. **Everyone**: Test end-to-end workflow
2. **Akram**: Prepare demo scenarios
3. **Temis**: Handle error cases
4. **Hamza**: Ensure all services are stable

## Communication

### Daily Standups
- What did you work on yesterday?
- What will you work on today?
- Any blockers or help needed?

### Code Sharing
- Use Git branches for features
- Create pull requests for review
- Test changes before merging

### Testing Together
- Test on both iOS and Android
- Share QR codes for testing
- Document any bugs found

## Quick Commands Reference

```bash
# Start the app
npm start

# Install new packages
npm install package-name

# Clear cache if issues
npx expo start --clear

# Check what's running
npm run android  # Android
npm run ios      # iOS (Mac only)
npm run web      # Web browser
```

## Helpful Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Basics](https://www.typescriptlang.org/docs/)
- [Docker Getting Started](https://docs.docker.com/get-started/)

## Emergency Contacts

If you're completely stuck:
1. Ask in the team chat
2. Check the troubleshooting section in README.md
3. Google the error message
4. Ask a mentor or experienced developer