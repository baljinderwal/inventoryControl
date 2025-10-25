# Inventory Control - Mobile (Expo)

This folder contains a minimal Expo React Native scaffold to get started with the Inventory Control mobile app.

## Setup

1. Install Expo CLI (if you don't have it):

```powershell
npm install -g expo-cli
```

2. Install dependencies:

```powershell
cd mobile
npm install
```

3. Start the Expo dev server:

```powershell
npm run start
```

4. Open on Android device/emulator:

```powershell
npm run android
```

## Notes
- The API base URL is set to `http://localhost:3001`. If testing from a physical device, use your machine IP address (e.g., `http://192.168.x.x:3001`). Update `mobile/src/services/api.js` accordingly.
- This scaffold includes basic auth context and example screens for Login and Purchase Orders.
