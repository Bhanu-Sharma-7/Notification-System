# 📐 Pastel Neo-Brutalist Math Game — Product Blueprint (`idea.md`)

## 1. App Concept & Overview
Ek 100% offline-first, engaging Math Calculation Game jisme players apni mental math skills ko test aur boost kar sakte hain. Poora app **Pastel Neo-Brutalist** design philosophy par based hai — bold black borders, vibrant pastel surfaces, hard drop-shadows, aur quirky chunky typography. Zero server cost model ke sath local-first architecture par run karega.

---

## 2. Design System & Aesthetics
- **Theme:** Pastel Neo-Brutalist
- **Base Background:** `#F5F2EB` (Warm Cream Canvas)
- **Borders:** `2.5px solid #000000` on cards, buttons, modals, and input fields
- **Drop Shadows:** Sharp, unblurred offset shadows (e.g., `box-shadow: 4px 4px 0px #000000` or RN shadow offset `width: 4, height: 4`, opacity: 1, radius: 0)
- **Pastel Palette:**
  - Primary Pink: `#FFB5D5`
  - Mint Green: `#B4F8C8`
  - Butter Yellow: `#FBE7A1`
  - Soft Sky Blue: `#A0E7E5`
  - Lavender Purple: `#D3B8FE`
  - Coral Orange: `#FFAAA6`
- **Typography:**
  - Headings / Display: Chunky fonts (e.g., `LuckiestGuy`, `Bungee`, or similar heavy display fonts)
  - Body / Calculations: Clean, high-legibility monospaced or modern sans-serif (e.g., `Space Mono` or `Inter`)

---

## 3. Core Features
1. **Category & Difficulty Selector:**
   - **Arithmetic Tier:** Addition, Subtraction, Multiplication, Division, Mixed operations.
   - **Advanced Tier:** Exponents, Square roots, Fractions, Percentages, Trigonometry basics, Algebraic formulas.
   - **Difficulty Levels:** Easy, Medium, Hard, Insane (Customizable timers & question limits).

2. **On-The-Fly Random Question Engine:**
   - Algorithmic, procedural question generator based on selected category & difficulty.
   - Guarantees infinite, non-repeating questions without requiring pre-baked JSON lists or internet connectivity.

3. **Built-in Pastel Calculator Utility:**
   - Pop-up or dedicated tab Pastel Neo-Brutalist scratchpad calculator for quick checks or practice mode.

4. **Gamification, Streaks & Local Storage:**
   - Daily streaks, high scores, accuracy stats, XP level progression, and unlockable avatar badges.
   - Data stored locally via `@react-native-async-storage/async-storage` (100% offline, zero server cost).

5. **Monetization Architecture (Ready for Ads):**
   - Clean placeholders/wrappers for Google AdMob (Banner ads on game over/menus, Interstitial ads after game sessions/streaks).
   - Non-intrusive placement matching Neo-Brutalist card styling.

---

## 4. Architecture & Tech Stack
- **Framework:** React Native + Expo SDK (Expo Router)
- **Language:** TypeScript
- **State Management:** React hooks / Context API + AsyncStorage persistence
- **Audio & Haptics:** Expo Haptics + Expo AV for tactile feedback

---

## 5. Golden Rule: Future Updates & Synchronization
> ⚠️ **CRITICAL RULE:**
> Jab bhi aage chalkar hum is app mein koi naya feature, mechanic, category, ya architectural change karenge — **sabse pehle `idea.md` ko update kiya jayega** taaki project vision, documentation, aur code hamesha 100% synchronized rahein.
