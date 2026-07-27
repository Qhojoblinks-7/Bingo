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
- Wallet top-up and digital payments
- Activity history and proof of service
- Saved locations and payment methods
- Support and data privacy controls
- Email authentication and verification

**Tech Stack:**
- Expo SDK 54
- React Native
- Zustand (State Management)
- Supabase (Auth, Database, Storage)

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
         │    Supabase     │
         │  Auth + DB      │
         └────────┬────────┘
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
    ┌─────────────┐  ┌─────────────┐
    │ PostgreSQL  │  │  Storage    │
    │  (+ RLS)    │  │ (proof img) │
    └─────────────┘  └─────────────┘
```

---

## 🌟 The Vision

In many urban centers, waste collection is inconsistent and opaque. BinGo solves this by:

- **On-Demand Scheduling:** No more waiting for "trash days."
- **Digital Wallet:** Secure balance stored in Supabase, used for transparent payments.
- **Verification:** Proof-of-service photos and rider identity shown to customers.
- **Geofencing:** Automatic pickup assignment to nearby pilots.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React Native (Expo SDK 54) |
| State Management | Zustand |
| Customer Backend | Supabase (Auth + Postgres + Storage) |
| Navigation | Expo Router |
| Maps / Location | react-native-maps, expo-location |

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
- A Supabase project

### Customer App Setup

```bash
cd bingo-customer
npm install
```

Create a `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Apply the database schema from [`bingo-customer/supabase/schema.sql`](bingo-customer/supabase/schema.sql) in the Supabase SQL Editor, then run:

```bash
npx expo start
```

### Pilot App Setup

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
