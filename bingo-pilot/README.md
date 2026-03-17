# BinGo Pilot 🚛

![BinGo Pilot Logo](./assets/logo.png)

A professional-grade mobile application for waste collection pilots in Accra, Ghana. Built with Expo SDK 54 and React Native, designed for real-time mission management, geofencing-based job assignment, and proof-of-service verification.

---

## 📱 Overview

BinGo Pilot is the rider-side companion app to the BinGo Customer app. It enables waste collection pilots to:

- **Receive nearby missions** automatically via geofencing
- **Navigate to waste locations** using integrated maps
- **Capture proof of service** with camera verification
- **Manage duty status** (Online/Offline)
- **Track earnings** and mission history

---

## 🏗️ Architecture

### Tech Stack

| Category         | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Framework        | Expo SDK 54                                      |
| Language         | JavaScript (React Native)                        |
| Navigation       | Expo Router (file-based)                         |
| State Management | Zustand                                          |
| Maps             | react-native-maps + react-native-maps-directions |
| Location         | expo-location                                    |
| Storage          | AsyncStorage                                     |
| HTTP Client      | Axios                                            |
| Icons            | lucide-react-native                              |

### Directory Structure

```
bingo-pilot/
├── app/                    # Expo Router screens
│   ├── _layout.jsx        # Root navigation stack
│   ├── index.jsx          # Splash screen
│   ├── login.jsx          # Pilot authentication
│   └── (tabs)/           # Tab navigation
│       ├── _layout.jsx   # Tab configuration
│       ├── index.jsx     # Mission Dashboard
│       ├── activity.jsx  # Earnings & history
│       └── profile.jsx   # Pilot profile
├── components/            # Reusable UI components
├── constants/
│   └── Colors.js         # Industrial dark theme
├── hooks/                 # Custom React hooks
├── stores/
│   └── useMissionStore.js # Zustand state management
└── assets/               # Images, fonts, icons
```

---

## 🎯 Core Features

### 1. Mission Radar (Geofencing)

The app continuously monitors the pilot's GPS location and alerts them when within range of a waste collection request.

- **Haversine formula** calculates distance between pilot and customer
- Configurable geofence radius (default: 500m)
- Real-time mission proximity alerts

### 2. Duty Management

Pilots can toggle between Online/Offline status:

- Online: Receiving nearby missions
- Offline: Not receiving missions
- Status persists across app restarts

### 3. Mission Workflow

```
Idle → Accept → En Route → Arrived → Complete → Proof of Service
```

- **Accept**: Trigger haptic feedback confirmation
- **En Route**: Turn-by-turn navigation
- **Complete**: Capture "After" photo
- **Proof**: Store photo as verification

### 4. Sensory Alerts

- **Haptic feedback** when new mission detected
- **Audio alerts** for mission acceptance
- Vibration patterns for different events

### 5. Proof of Service

- In-app camera capture
- Photo stored with mission metadata
- Upload to Django backend for verification

---

## 🎨 Design System

### Industrial Dark Theme

| Color                 | Hex       | Usage                 |
| --------------------- | --------- | --------------------- |
| Primary (BinGo Green) | `#10B981` | CTAs, success states  |
| Background            | `#0F172A` | App background        |
| Surface               | `#1E293B` | Cards, inputs         |
| Text                  | `#F8FAFC` | Primary text          |
| Muted                 | `#94A3B8` | Secondary text        |
| Accent                | `#3B82F6` | Navigation highlights |
| Error                 | `#EF4444` | Alerts, offline       |

---

## 🔌 API Integration

### Endpoints (Django Backend)

| Endpoint                       | Method | Description             |
| ------------------------------ | ------ | ----------------------- |
| `/api/pilots/login/`           | POST   | Authenticate pilot      |
| `/api/missions/nearby/`        | GET    | Fetch missions in range |
| `/api/missions/{id}/accept/`   | POST   | Accept a mission        |
| `/api/missions/{id}/complete/` | POST   | Submit proof of service |
| `/api/pilots/earnings/`        | GET    | Fetch earnings history  |

### Network Handling

- `@react-native-community/netinfo` monitors connectivity
- Offline missions queued for sync
- Retry logic on failed requests

---

## 🛡️ Permissions

The app requires the following permissions (configured in `app.json`):

| Permission        | Purpose                            |
| ----------------- | ---------------------------------- |
| Location (Always) | Background tracking for geofencing |
| Camera            | Proof of service photos            |
| Photo Library     | Gallery fallback for uploads       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Android Studio (for Android builds)
- Xcode (for iOS builds, Mac only)

### Installation

```bash
# Navigate to project
cd bingo-pilot

# Install dependencies
npm install

# Start development server
npx expo start
```

### Building for Android

```bash
# Generate Android project
npx expo prebuild --platform android

# Build debug APK
cd android && ./gradlew assembleDebug
```

---

## 📂 State Management (Zustand)

The app uses Zustand for lightweight, performant state management:

```javascript
import useMissionStore from "./stores/useMissionStore";

// Access state
const { isOnline, activeMission } = useMissionStore();

// Update state
useMissionStore.getState().setOnline(true);
useMissionStore.getState().acceptMission(mission);
```

### Store Features

- Duty status persistence
- Mission lifecycle management
- Geofence calculations
- Haptic feedback triggers

---

## 🔐 Security Considerations

- JWT tokens stored securely
- HTTPS for all API calls
- Location data encrypted in transit
- Photo uploads signed with presigned URLs

---

## 🌍 Use Case: Accra Waste Collection

BinGo Pilot is specifically designed for Accra's urban environment:

1. **Customer** requests waste collection via BinGo Customer app
2. **Django backend** stores request with GPS coordinates
3. **Geofencing engine** identifies nearest pilot
4. **Pilot** receives haptic + audio alert
5. **Pilot** accepts via one-tap interface
6. **Navigation** guides pilot to location
7. **Pilot** captures proof of service
8. **Payment** processed automatically

---

## 📄 License

Proprietary - BinGo Waste Management Ltd.

---

## 👤 Author

Developed for BinGo - Revolutionizing waste management in Accra, Ghana.

---

## 🔗 Related Projects

- [BinGo Customer](https://github.com/yourorg/bingo-customer) - Customer-facing app for requesting collections
- [BinGo Backend](https://github.com/yourorg/bingo-backend) - Django REST API
