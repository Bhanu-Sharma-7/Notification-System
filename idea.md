# 📐 Pastel Neo-Brutalist Math Game — Product Blueprint (`idea.md`)

## 1. App Concept & Overview
Ek 100% offline-first, engaging aur addictive Math Calculation Game jisme children, students, aur casual gamers apni mental math speed aur accuracy ko boost kar sakein. Poora app **Pastel Neo-Brutalist** design philosophy par based hai — bold deep charcoal borders (`#18181B`), warm cozy cream background (`#F5F2EB`), unblurred tactile drop-shadows, aur chunky typography (`LuckiestGuy` & `Bungee`).

**Zero Server Cost Guarantee:** Sabhi computations on-the-fly client-side hoti hain, aur game progression/streaks locally `@react-native-async-storage/async-storage` ke zariye persist hoti hain (₹0 ongoing cost).

---

## 2. Design System & Aesthetics
- **Theme:** Pastel Neo-Brutalist
- **Base Canvas:** `#F5F2EB` (Warm Cream)
- **Primary Borders:** `2.5px solid #18181B` (Deep Charcoal)
- **Tactile Shadows:** Unblurred sharp offset shadows (`shadowOffset: { width: 3, height: 3 }`, opacity 1, radius 0, elevation 4).
- **Physical Press Feedback:** Har interactive element (buttons, cards, badges) active press state par physical tactile button jaisa translate shift (`translateX: 2, translateY: 2`, shadow reduction) provide karega.
- **Pastel Palette:**
  - Mint Green: `#70C1B3` (Success, Correct Answers)
  - Soft Coral: `#FFAAA6` (Alerts, Wrong Answers, Danger, Low Timer)
  - Butter Yellow: `#FFE169` (Streaks, Primary Action Highlights, Power-ups)
  - Soft Peach: `#FFE5D9` (Cards & Secondary Surfaces)
  - Lavender: `#E8EAFF` (Badges & Categories)
  - White: `#FFFFFF` (Surface Contrast)
- **Typography:**
  - Display / Headings: `LuckiestGuy`
  - UI Labels / Badges: `Bungee`
  - Numbers & Subtitles: System Sans / Monospace

---

## 3. Core Features & Gamification Architecture
1. **Procedural Question Engine:**
   - **Arithmetic:** Multi-row Addition, Subtraction (guaranteed non-negative), Multiplication, and Whole-number Division.
   - **Advanced:** Trigonometry identities, Squares ($x^2$), Square Roots ($\sqrt{x}$), Cubes ($x^3$), and Percentages ($x\%$).
   - **Options:** 4 options (1 correct answer + 3 smart plausible distractors), shuffled.

2. **Game Modes:**
   - **Classic Practice:** Relaxed, untimed mode for steady learning.
   - **Blitz Speedrun (60s Time Attack):** Intense 60-second challenge with chunky animated countdown timer, speed multipliers, and blitz high score record.

3. **Power-ups & Streak Protection (Zero Server Cost):**
   - **50-50 Eliminator:** Removes 2 wrong options instantly to help solve tough questions.
   - **Streak Freeze:** Consumable power-up that shields daily streaks against missed days or wrong streaks.
   - Power-ups inventory persisted in `AsyncStorage`.

4. **Gamification & Rewards:**
   - **Dynamic XP System:** Base XP (10) + Streak Multiplier (`Math.min(streak, 5) * 2`).
   - **Level Progression:** Dynamic Level calculation (`Math.floor(XP / 100) + 1`).
   - **Celebration Modal:** Pop-up celebration dialog on leveling up with confetti/visual flair and haptic celebration.
   - **Daily Streaks:** Tracks active days, consecutive streaks, and best streak records.
   - **8+ Unlockable Badges:** Rookie Solver, Streak Master, Quick Thinker, Sharpshooter, Century Club, Grandmaster, Daily Grinder, Math Ninja.

5. **Audio Effects & Sound Engine:**
   - Clean, lightweight sound cues (success chime, error buzz, tactile tap) synchronized with haptics.
   - Global sound mute toggle (`🔊 / 🔇`) in top navigation header.

6. **Built-in Pastel Calculator Utility:**
   - Quick-access bottom sheet / modal scratchpad calculator with tactile keys for scratch calculations.

7. **Monetization Architecture:**
   - Neo-brutalist styled `NeoAdBanner` card placeholder ready for Google AdMob insertion.

---

## 4. Golden Rule: Future Updates & Synchronization
> ⚠️ **CRITICAL RULE:**
> Jab bhi aage chalkar hum is app mein koi naya feature, mechanic, category, ya architectural change karenge — **sabse pehle `idea.md` ko update kiya jayega** taaki project vision, documentation, aur code hamesha 100% synchronized rahein.
