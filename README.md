# CredVault 🔐  
*A secure and elegant password manager built with React Native + Expo*

---

## 📖 Overview  
CredVault is a mobile-first password manager designed to keep your credentials safe and accessible with a **PIN-protected lock screen**, **biometric authentication**, and **toast-powered user feedback**.  
This project is structured for maintainability, scalability, and developer happiness — with clear phases, robust validation planned (using Zod), and a polished user experience.

---

## 🚀 Tech Stack
- **React Native + Expo** – Fast development, smooth native experience
- **Expo Router** – File-based navigation
- **React Context + AsyncStorage** – State persistence and hydration
- **React Native Gesture Handler (planned)** – Gesture-based interactions (swipe-to-delete)
- **Biometric Authentication** – Fingerprint/FaceID unlock
- **Custom Numpad** – Clean and focused unlock screen
- **Toast System** – Feedback for add/update/delete actions

---

## ✅ Current Features (Phase 2 – Progress)

### 🔑 Authentication & Security
- [x] Custom PIN unlock screen
- [x] Biometric unlock (manual trigger via icon)
- [x] Lock screen resets inactivity timer
- [ ] Auto-lock timer pause when modal is open (planned)

### 📋 Credential Management
- [x] Add new credential with validation (basic)
- [x] Toast notification on add success
- [x] Delete credential via modal confirmation
- [x] Toast notification on delete success
- [ ] Edit credential flow (planned)
- [ ] Swipe-to-delete gesture (planned)

### 🧩 Infrastructure & State
- [x] AsyncStorage-based persistence
- [x] State hydration at app launch
- [x] Context-driven store for credentials
- [ ] Zod-based validation for robust input handling (planned)

### 🛠 Utility & UX
- [x] Toast utility abstraction (`toast.add.success`, `toast.delete.error`, etc.)
- [x] Custom numpad UI with logo on unlock screen
- [ ] Global modal context to handle open/close state (planned)

### 🔄 Recovery & Reset
- [x] Forget PIN flow (clears PIN + returns to setup screen)
- [ ] Factory reset flow (clears all credentials + PIN) (planned)

---

## 📅 Roadmap (Upcoming Features)
- 🔄 **Auto-trigger biometric** at app start (PIN as fallback in background)
- 🧹 **Swipe-to-delete** for a smoother UX
- 🧪 **Zod validation** for add/edit forms
- ⏸ **Pause inactivity timer** while modals are open
- 🎨 **UI Polishing & Theming** (Phase 3)
- 🌐 **Multi-language support** (French/Wolof)

---

## 🛠 Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/credvault.git
   cd credvault