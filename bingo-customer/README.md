---

# BinGo 🚛

![BinGo Logo](./assets/images/logo2.png)

**Clean communities, one tap at a time.**

BinGo is a decentralized, on-demand waste management platform designed to bridge the gap between urban households and independent tricycle waste operators. Built as part of the BeChangeMaker 2026 initiative, BinGo leverages mobile technology to formalize the informal waste sector in Ghana.

## 🌟 The Vision

In many urban centers, waste collection is inconsistent and opaque. BinGo solves this by:

* **On-Demand Scheduling:** No more waiting for "trash days."
* **Digital Escrow:** Secure MoMo payments released only upon "Proof of Service."
* **Verification:** GPS and Photo-based validation to ensure bins are actually emptied.

## 🛠️ Technical Stack

* **Frontend:** React Native (Expo SDK 54) using **JS/JSX**.
* **State Management:** Zustand (for lightweight global state).
* **Data Fetching:** TanStack Query & Axios.
* **Backend:** Django REST Framework (DRF) with PostGIS.
* **Database:** PostgreSQL.
* **UI Architecture:** Custom-built components using `StyleSheet.create`.

## 📂 Project Structure (Frontend)

```
bingo-customer/
├── app/                  # Expo Router (JS/JSX)
│   ├── _layout.js        # Root configuration & Providers
│   ├── index.js          # Landing / Onboarding
│   └── (tabs)/           # Dashboard, History, Profile
├── components/           # Custom Reusable UI Components
│   ├── BinGoButton.jsx   # Shared Action Button
│   └── BinGoInput.jsx    # Validated Input fields
├── constants/            # Design tokens (Colors, Spacing)
├── api/                  # Axios instances & API hooks
└── store/                # Zustand stores for User & Jobs

```

## 🚀 Key Features

1. **Smart Request:** Automatically captures user location via GPS (no manual address typing needed).
2. **Rider Match:** Connects the request to the nearest available tricycle operator.
3. **Status Timeline:** Real-time updates from "Assigned" to "At the Gate" to "Completed."
4. **Proof of Service:** View a timestamped photo of your emptied bin before payment is finalized.

## 🔧 Getting Started

1. **Clone the repo:**
```bash
git clone https://github.com/yourusername/bingo-customer.git

```


2. **Install dependencies:**
```bash
bun install

```


3. **Configure Environment:**
Create a `.env` file and add your Django API URL:
```text
EXPO_PUBLIC_API_URL=http://your-local-ip:8000

```


4. **Start Developing:**
```bash
npx expo start

```



## 🤝 Social Impact (SDGs)

* **Goal 11:** Sustainable Cities and Communities.
* **Goal 8:** Decent Work and Economic Growth (Empowering tricycle riders).
* **Goal 3:** Good Health and Well-being (Reducing illegal dumping).

---
