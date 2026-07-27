
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
* **Functionality:**
    * **Wallet Snapshot:** Displays real-time wallet balance from Supabase.
    * **Contextual Greeting:** Personalizes the user experience.
    * **Smart Triggers:** Quick actions for requesting pickup, topping up, and checking activity.
* **Flow:** Acts as the entry point for both financial (Top-up) and service (Request) journeys.

### 2. Request Pickup (`app/request/index.jsx`)
* **Purpose:** Data capture for logistics.
* **Functionality:**
    * **GPS Integration:** Captures Ghana Post GPS digital addresses.
    * **Dynamic Pricing:** Selection grid for bin sizes (Standard, Large, XL) that updates the total cost in real-time.
    * **Payment Integration:** Wallet deduction and payment-method selection.
* **Flow:** Validates data, checks wallet balance, creates the request in Supabase, updates active state, and shows a success modal.

### 3. Activity Feed (`app/(tabs)/activity.jsx`)
* **Purpose:** The "Truth Center" and Ledger.
* **Functionality:**
    * **Live Feed:** Fetches real pickup requests and top-up transactions from Supabase.
    * **Status Toggling:** Switch between "Active" and "History."
    * **Pull-to-Refresh:** Keeps the ledger current.
* **Flow:** Tapping any record leads to the **Activity Detail** screen for verification.

### 4. Activity Detail (`app/activity/[id].jsx`)
* **Purpose:** Accountability and Verification.
* **Functionality:**
    * **Proof of Service:** Displays timestamped completion evidence.
    * **Rider Identity:** Shows the assigned operator’s name and contact details.
    * **Timeline:** Visual step-through from request to completion.
* **Flow:** Closes the loop on a service request, giving the user confidence before and after payment.

### 5. Wallet & Top-Up (`app/topup.jsx`)
* **Purpose:** Financial liquidity.
* **Functionality:**
    * **Quick-Amount Chips:** One-tap selection for common top-up values.
    * **Payment Gateway Selection:** MoMo (MTN, Telecel, AT) and Cards.
* **Flow:** Records a transaction in Supabase, refreshes the wallet balance, and confirms via success modal.

### 6. User Profile (`app/(tabs)/profile.jsx`)
* **Purpose:** Identity, preferences, and account management.
* **Sub-Screens:**
    * **Edit Profile** — name, phone, email
    * **Saved Locations** — default pickup addresses
    * **Payment Methods** — managed MoMo/card entries
    * **Support** — help center and contact options
    * **Security** — PIN, face ID, change password
    * **Privacy** — data rights, delete account
    * **Data Rights** — consent management and data download requests

### 7. Authentication (`app/login.jsx`, `app/forgot-password.jsx`, `app/verify-email.jsx`)
* **Purpose:** Secure onboarding via Supabase Auth.
* **Functionality:** Email/password sign-in, password reset, and email verification flows.

### 8. Chat & Support (`app/chat/index.jsx`, `app/profile/support.jsx`)
* **Purpose:** User assistance and communication.
* **Functionality:** In-app chat interface, support topic selection, direct call/SMS links.

---

## 🔄 The Unified System Flow
These screens come together to serve one purpose: **Formalizing the informal waste sector.**

1.  **Onboarding:** The user is authenticated via Supabase Auth.
2.  **Liquidity:** The user ensures their wallet is funded via the **Top-Up** flow.
3.  **Action:** The user initiates a **Request**, which is persisted to Supabase and ready for pickup assignment.
4.  **Verification:** Once the task is completed, the **Activity** system reflects the updated status.
5.  **Proof:** The user verifies the work through **Activity Details**, ensuring they only pay for completed services.

---

## 🛠️ Technical Implementation

### State Management
* **Stores:** Zustand-based stores for profile, wallet, requests, activities, active requests, top-ups, support, notifications, theme, and data rights.
* **Persistence:** Supabase Postgres with Row Level Security (RLS).

### API & Data Layer
* **Backend:** Supabase (Auth, Database, Storage).
* **Client:** `@supabase/supabase-js` with `expo-secure-store` for session persistence.
* **Schema:** See `supabase/schema.sql`.

### UI & Navigation
* **Framework:** React Native via Expo.
* **Routing:** Expo Router with tab and stack navigators.
* **Theme:** Dark/light/system themes via custom theme context.
* **Components:** Reusable UI library (`BinGoButton`, `BinGoInput`, `BinGoHeader`, `SuccessModal`, sheets/modals, skeletons).

### Icons & UX
* **Icons:** `@expo/vector-icons` (Ionicons).
* **Feedback:** Haptics, pull-to-refresh, loading skeletons, and success/error modals.

---

## 🚀 Getting Started

### Prerequisites
* Node.js >= 18
* Expo CLI
* A Supabase project

### Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Configure Supabase credentials in `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Apply the database schema:
   ```bash
   supabase db push
   ```
   Or run the SQL manually in the Supabase SQL Editor using `supabase/schema.sql`.

4. Start the app:
   ```bash
   npm start
   ```

---

## 📦 Project Structure (`bingo-customer`)
* `app/` — Expo Router screens and navigation structure
* `components/` — Shared UI components
* `constants/` — Theme and color definitions
* `hooks/` — Custom React hooks (theme, colors, push notifications)
* `lib/` — Supabase client initialization
* `services/` — API and customer service integrations
* `stores/` — Zustand state management
* `supabase/` — Database schema and migrations