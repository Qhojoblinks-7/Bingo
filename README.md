# BinGo 🚛

![BinGo Logo](./bingo-customer/assets/images/logo2.png)

**Clean communities, one tap at a time.**

BinGo is a decentralized, on-demand waste management platform designed to bridge the gap between urban households and independent tricycle waste operators in Accra, Ghana.

---

## 📱 Apps

### BinGo Customer
The customer-facing app for requesting waste collection services.

**Location:** [`bingo-customer/`](bingo-customer/)

**Features:**
- On-demand waste collection scheduling
- Automatic GPS location capture
- Real-time rider tracking
- Proof of service verification
- Digital payment (MoMo integration)

**Tech Stack:**
- Expo SDK 54
- React Native
- Zustand (State Management)
- Django REST API

---

### BinGo Pilot
The rider-side app for waste collection pilots.

**Location:** [`bingo-pilot/`](bingo-pilot/)

**Features:**
- Geofencing-based mission assignment
- GPS navigation to pickup locations
- Duty status management (Online/Offline)
- Camera capture for proof of service
- Earnings and activity tracking

**Tech Stack:**
- Expo SDK 54
- React Native
- react-native-maps (Navigation)
- expo-location (GPS Tracking)
- Zustand (State Management)

---

## 🏗️ System Architecture

```
┌─────────────────┐      ┌─────────────────┐
│  BinGo Customer │      │  BinGo Pilot    │
│      App        │      │      App        │
└────────┬────────┘      └────────┬────────┘
         │                        │
         └────────┬───────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Django Backend │
         │  (REST API)     │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
   ┌──────────┐     ┌──────────┐
   │PostgreSQL│     │  PostGIS │
   │   (DB)   │     │  (GIS)   │
   └──────────┘     └──────────┘
```

---

## 🌟 The Vision

In many urban centers, waste collection is inconsistent and opaque. BinGo solves this by:

- **On-Demand Scheduling:** No more waiting for "trash days."
- **Digital Escrow:** Secure MoMo payments released only upon "Proof of Service."
- **Verification:** GPS and Photo-based validation to ensure bins are actually emptied.
- **Geofencing:** Automatic mission assignment to the nearest pilot.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React Native (Expo SDK 54) |
| State Management | Zustand |
| Backend | Django REST Framework |
| Database | PostgreSQL + PostGIS |
| Maps | react-native-maps |
| Location | expo-location |

---

## 🤝 Social Impact (SDGs)

- **Goal 11:** Sustainable Cities and Communities
- **Goal 8:** Decent Work and Economic Growth (Empowering tricycle riders)
- **Goal 3:** Good Health and Well-being (Reducing illegal dumping)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Python 3.10+
- PostgreSQL with PostGIS extension

### Installation

**Customer App:**
```bash
cd bingo-customer
npm install
npx expo start
```

**Pilot App:**
```bash
cd bingo-pilot
npm install
npx expo start
```

---

## 📄 License

Proprietary - BinGo Waste Management Ltd.

---

## 👤 Author

Developed for BinGo - Revolutionizing waste management in Accra, Ghana.
