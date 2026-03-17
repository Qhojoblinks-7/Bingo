
---

# BinGo Customer App 🚛
**Empowering citizens to manage waste with transparency and speed.**

The BinGo Customer app is a high-performance React Native (Expo) application built with a **Stoic Design** philosophy: clean, functional, and highly reliable. Every screen is engineered to move the user from "Waste Problem" to "Clean Solution" in as few taps as possible.

## 🏗️ System Architecture
The app follows a **Hub-and-Spoke** and **Tab-based** navigation architecture using **Expo Router**.

* **The Hub (Tab Navigation):** Provides constant access to core pillars (Home, Activity, Profile).
* **The Spokes (Stack Navigation):** High-focus screens (Request, Top-Up) that slide over the tabs to eliminate distractions during transactions.

---

## 📱 Screen-by-Screen Functionality

### 1. Home Dashboard (`app/(tabs)/index.jsx`)
* **Purpose:** The central command center.
* **Functionality:** * **Wallet Snapshot:** Displays real-time balance fetched from the Django backend.
    * **Contextual Greeting:** Personalizes the user experience.
    * **Smart Trigger:** A high-visibility button that initiates the pickup flow.
* **Flow:** Acts as the entry point for both financial (Top-up) and service (Request) journeys.

### 2. Request Pickup (`app/request/index.jsx`)
* **Purpose:** Data capture for logistics.
* **Functionality:** * **GPS Integration:** Captures Ghana Post GPS digital addresses.
    * **Dynamic Pricing:** A selection grid for bin sizes (Standard, Large, XL) that updates the total cost in real-time.
    * **Instructions:** Optional field for specific rider directions.
* **Flow:** Validates data and checks wallet balance before triggering the **SuccessModal**.

### 3. Activity Feed (`app/(tabs)/activity.jsx`)
* **Purpose:** The "Truth Center" and Ledger.
* **Functionality:** * **Status Toggling:** Switch between "Active" jobs and "History."
    * **Live Tracking:** Visual indicators (Amber/Green) for job states.
* **Flow:** Tapping any record leads to the **Activity Detail** screen for verification.

### 4. Activity Detail (`app/activity/[id].jsx`)
* **Purpose:** Accountability and Verification.
* **Functionality:** * **Proof of Service:** Displays the timestamped photo taken by the rider.
    * **Rider Identity:** Shows the name and contact details of the assigned operator.
* **Flow:** Closes the loop on a service request, providing the user with peace of mind.

### 5. Wallet & Top-Up (`app/topup.jsx`)
* **Purpose:** Financial bridge.
* **Functionality:** * **Quick-Amount Chips:** One-tap selection for common top-up values.
    * **Payment Gateway Selection:** Integration logic for MoMo (MTN, Telecel, AT) and Cards.
* **Flow:** Redirects to a secure portal and returns to the app via a **SuccessModal**.

### 6. User Profile (`app/(tabs)/profile.jsx`)
* **Purpose:** Identity and Preference management.
* **Functionality:** * **Account Management:** Personal info and saved location editing.
    * **System Controls:** Notification toggles and secure Logout.

---

## 🔄 The Unified System Flow
These screens come together to serve one purpose: **Formalizing the informal waste sector.**

1.  **Onboarding:** The user is authenticated into the system.
2.  **Liquidity:** The user ensures their wallet is funded via the **Top-Up** flow.
3.  **Action:** The user initiates a **Request**, which is instantly broadcasted via the Django API to nearby riders.
4.  **Verification:** Once the rider completes the task, the **Activity** system notifies the user.
5.  **Proof:** The user verifies the work through **Activity Details**, ensuring they only pay for completed services.



## 🛠️ Technical Implementation
* **Components:** Reusable UI library (BinGoButton, BinGoInput, BinGoHeader).
* **State Management:** Zustand stores for Auth and Balance.
* **API Layer:** Axios-based communication with the Django REST Framework.
* **Icons:** Lucide-React-Native.

---