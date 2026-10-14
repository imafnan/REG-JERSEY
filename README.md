# Zenith FC — Official Jersey Registration Portal

A complete, modern, mobile-responsive football jersey registration and squad kit management web application built for **Zenith FC**. Built with React 19, Vite, Tailwind CSS, and Google Firebase Realtime Database with Firebase Authentication.

---

## 🌟 Key Features

### 1. Public Matchwear Showcase & Registration
- **Hero Image Gallery**: Features 3 prominent Zenith FC matchwear photos (Home Kit Front, Player Print Back, and Stitched Crest & Star Detail).
- **Interactive Lightbox Modal**: High-resolution zoom view with Next/Previous navigation, touch swipe support on mobile, image counter, and keyboard shortcuts (`Esc`, `ArrowLeft`, `ArrowRight`).
- **Prominent Official Pricing**: Clear badge displaying **Zenith FC Official Jersey — ৳450** with club guarantee badges.
- **Dynamic Live Kit Preview**: As players type their print name and choose their squad number, a real-time virtual jersey card previews their custom kit heat-pressed typography.
- **Size Chart Guide Modal**: Detailed chest and length measurement guide in inches & centimeters for XS, S, M, L, XL, XXL, and XXXL with one-click size selection.
- **Form Validation & Anti-Spam**: Validates Bangladeshi mobile numbers (`013` to `019`), checks number limits, prevents button spam, and protects form inputs during submission.
- **Digital Registration Voucher**: On successful submission, fires celebration confetti and generates an official printable Zenith FC Player Kit Voucher pass (`/registration-success`).

### 2. Jersey Number Reservation & Concurrency System
- **Atomic Concurrency Protection**: Utilizes Firebase Realtime Database atomic transactions (`runTransaction`) to guarantee that two players submitting the same number at the same millisecond can never collide.
- **Real-Time Availability Indicator**: Live feedback checks number availability as the user types (Available, Multiple Allowed, Taken, or Admin-Reserved).
- **Duplicate Prevention**: If a number is occupied, subsequent registrations are blocked with: *“This jersey number is already registered. Please choose another number.”*
- **Admin Number Controls**:
  - **Single Player Only**: Standard exclusive 1-player allocation.
  - **Allow Multiple Players**: Allows multiple squad members or supporters to register with the same number.
  - **Reserved / Unavailable**: Blocks public registration for specific numbers.
- **Automatic Number Release**: Deleting or editing a registration atomically updates the number's occupancy count.

### 3. Authorized Admin Portal (`/admin`)
- **Protected Routing**: Enforced via `AdminRoute` and Firebase Authentication session persistence.
- **First-Time Admin Setup**: Automatically offers initial super-admin registration if no administrator account exists in the database.
- **Dashboard Telemetry (`/admin`)**:
  - Total registrations & estimated revenue (৳450/jersey).
  - Unique jersey numbers assigned & available numbers counter.
  - Multi-assigned numbers alert.
  - Real-time size distribution progress bars (XS to XXXL).
  - Recent registration timeline.
- **Registration Directory (`/admin/registrations`)**:
  - Searchable by player name, print name, squad number, or mobile.
  - Filter by jersey size and sort by registration date, squad number, or player name.
  - **Export to CSV**: One-click download formatted for garment printing vendors and kit manufacturers.
  - **Action Modals**: View digital voucher, edit details (with concurrency-safe number swapping), and delete with confirmation dialog.
- **Jersey Number Management (`/admin/numbers`)**:
  - Grid view of all squad numbers (0 to 99).
  - Status badges: Available, Occupied, Multiple Allowed, Reserved.
  - One-click toggles: Allow Multiple Players & Reserve/Open.
  - Player Inspector: Modal listing all players registered under any specific number.
- **System Settings (`/admin/settings`)**:
  - Registration Open/Close toggle (displays "Registration Closed" banner on homepage when disabled).
  - Jersey price adjustment (default ৳450).
  - Squad number range (minimum & maximum numbers).
  - Available jersey sizes editor (add or remove sizes).
  - Gallery images configuration.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v3, Lucide React, Canvas Confetti
- **Build Tool**: Vite 8
- **Backend & Database**: Google Firebase Realtime Database
- **Authentication**: Firebase Authentication (Email & Password)
- **Design System**: Athletic Football Aesthetic (Deep Emerald Green `#064e3b`, Solid Black `#0a0f0d`, Crisp White, Athletic Oswald/Montserrat typography)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd "Jersey Reg"
npm install
```

### 3. Environment Configuration
The project is preconfigured with the Zenith FC Firebase project credentials. You can customize them in `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSyA2RaoAAIb3Iz_t1ix6Bf2ZB-_PS53FZaQ
VITE_FIREBASE_AUTH_DOMAIN=football-jersey-a6f45.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://football-jersey-a6f45-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=football-jersey-a6f45
VITE_FIREBASE_STORAGE_BUCKET=football-jersey-a6f45.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=596486974613
VITE_FIREBASE_APP_ID=1:596486974613:web:6e6aac5ba6c6fa85297f9c
```

### 4. Running Locally
Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Firebase Realtime Database Security Rules

Copy the rules below into the **Firebase Console > Realtime Database > Rules** tab, or deploy via Firebase CLI:

```json
{
  "rules": {
    "settings": {
      ".read": true,
      ".write": "auth != null && (root.child('admins').child(auth.uid).exists() || !root.child('admins').exists())"
    },
    "jerseyNumbers": {
      ".read": true,
      "$number": {
        ".read": true,
        ".write": "auth != null || (newData.child('count').isNumber() && (!data.exists() || data.child('allowMultiple').val() === true || (data.child('count').val() == 0 && newData.child('count').val() == 1)))",
        ".indexOn": ["count", "reserved", "allowMultiple"]
      }
    },
    "registrations": {
      ".read": "auth != null && (root.child('admins').child(auth.uid).exists() || !root.child('admins').exists())",
      "$registrationId": {
        ".read": "auth != null",
        ".write": "(auth != null) || (!data.exists() && newData.exists() && root.child('settings/registrationOpen').val() !== false && newData.hasChildren(['fullName', 'jerseyName', 'jerseyNumber', 'mobileNumber', 'jerseySize']))",
        ".validate": "newData.hasChildren(['fullName', 'jerseyName', 'jerseyNumber', 'mobileNumber', 'jerseySize'])",
        "fullName": { ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 60" },
        "jerseyName": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 14" },
        "jerseyNumber": { ".validate": "newData.isNumber()" },
        "mobileNumber": { ".validate": "newData.isString() && newData.val().length >= 11 && newData.val().length <= 15" },
        "jerseySize": { ".validate": "newData.isString()" }
      },
      ".indexOn": ["jerseyNumber", "createdAt", "jerseySize"]
    },
    "admins": {
      ".read": "auth != null",
      ".write": "auth != null && (!data.exists() || root.child('admins').child(auth.uid).exists() || !root.child('admins').exists())"
    }
  }
}
```

---

## 📱 Routes Overview

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage: Hero image gallery, official price (৳450), live jersey card preview, registration form |
| `/registration-success` | Public | Digital voucher player pass with print/save support |
| `/admin/login` | Public | Secure staff sign-in & initial super-admin setup |
| `/admin` | Admin Only | Dashboard analytics, order telemetry, and size distribution |
| `/admin/registrations` | Admin Only | Searchable/sortable player registry, CSV export, edit/delete actions |
| `/admin/numbers` | Admin Only | Squad number management (multi-player & reservation toggles) |
| `/admin/settings` | Admin Only | Registration open/close toggle, price editor, sizes & gallery settings |

---

## 🚢 Deployment (Vercel & Netlify)

### Deploying to Vercel
1. Push the project to GitHub or GitLab.
2. In Vercel, select **New Project** and import the repository.
3. Set Framework Preset to **Vite**.
4. Add the environment variables from `.env`.
5. Deploy!

### Deploying to Netlify
1. Create a `_redirects` file in `public/`:
   ```text
   /*    /index.html   200
   ```
2. In Netlify, connect the repository with Build Command `npm run build` and Publish Directory `dist`.
3. Set the environment variables in Site Configuration > Environment variables.
#   R E G - J E R S E Y  
 