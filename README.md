# KANA – Tamil Nadu Idly Kadai (தமிழ்நாடு இட்லி கடை)

A rich, authentic, family-friendly South Indian breakfast cooking simulation and restaurant management HTML5 browser game.

---

## 🌟 Game Highlights

- **Authentic South Indian Kadai Experience**: Sizzling hot cast iron tawas, multi-tiered idli steamers, puffed poori frying, fragrant ven pongal in brass urulis, banana leaf dining tables, marigold garlands, and authentic Tamil signage.
- **Direct Interactive Cooking Mechanics**:
  - **Idly (₹10)**: Steam batter in stainless drum, watch steam gauge, collect fluffy idlis in the Perfect Window.
  - **Dosa (₹20)**: Spread batter on hot tawa, hear sizzle, fold golden crepe.
  - **Poori (₹20)**: Fry dough in hot oil kadai, watch it puff into a golden dome, scoop with slotted ladle.
  - **Pongal (₹15)**: Cook ghee rice & lentils in brass vessel, garnish with roasted cashews & pepper.
  - **Chapati (₹15)**: Hand-rolled whole wheat bread tossed and puffed on flat tawa.
  - **Egg Dosa (₹25)**: Roast dosa topped with spiced farm egg spread.
- **Autonomous Cartoon Waiter (Shinchan Energy)**:
  - Detects arriving customers.
  - Collects customer orders & brings order tickets to the kitchen queue.
  - Picks up prepared dishes from the Serving Counter.
  - Delivers food to customers and collects customer payments & tips.
- **Customer System**:
  - College Students, IT Techies, Grandfathers (Periyavar), Food Bloggers, and Regulars.
  - Individual patience meters, satisfaction reactions, eating animations, and tips.
- **Financial System**:
  - Base food sales + Perfect Cooking Quality Bonus + Speed Bonus + Tips.
  - Single authoritative transaction verification (zero double charges, zero payment on cancelled orders).
- **5-Day Campaign & Progression**:
  - Day 1: Small Morning Kadai
  - Day 2: Busy Breakfast Rush
  - Day 3: College Canteen Rush
  - Day 4: Sunday Family Feast
  - Day 5: Famous Chennai Tiffin Center
- **Equipment Upgrades Shop**:
  - Turbo Idli Steamer (-25% cook time)
  - Cast Iron Dosa Burner (-25% cook time)
  - Hot Oil Kadai Thermostat
  - Shinchan Running Shoes (+30% waiter speed)
  - Banana Leaf Dining Tables (add extra seats)
  - Pure Desi Ghee & Spices (+40% tips)
  - Marigold Garland & Lights (+25% customer patience)
- **Zero-Dependency Architecture**:
  - Pure HTML5 Canvas, modern ES Modules, CSS3, and Web Audio API procedural sound synthesizer (no external audio files required, zero latency, 100% offline-compatible).
  - Responsive layout for desktop and touchscreens (with mobile virtual joystick and action button).
  - Persistent save system via `localStorage`.

---

## 🎮 Controls

### Desktop Keyboard
- **Move Chief Cook**: `W`, `A`, `S`, `D` or `Arrow Keys` (Up, Down, Left, Right)
- **Cook / Collect / Place Dish**: `E` or `Spacebar`
- **Pause Game**: `Escape` or Click the Pause button

### Mobile / Tablet
- **Movement**: Virtual analog joystick on bottom-left of screen.
- **Action**: Large green `COOK [E]` button on bottom-right of screen.
- **Pause**: Pause icon at top-right.

---

## 🖼️ Assets

Dish and restaurant photos are stored in `assets/` and were downloaded from [Wikimedia Commons](https://commons.wikimedia.org/). See `assets/ATTRIBUTION.txt`. Tamil display fonts load from Google Fonts.

---

## 🚀 How to Run Locally

### Option 1: Python HTTP Server (Recommended)
1. Open terminal in the project directory:
   ```bash
   cd "D:\Kana game project"
   ```
2. Start local web server:
   ```bash
   py -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Option 2: VS Code Live Server
1. Open the `Kana game project` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **"Open with Live Server"**.

---

## 🌐 Free Public Web Deployment

The game is built as a 100% static client-side web application. It requires zero server runtimes, databases, or environment keys, making it deployable on any static hosting service.

### Deploy to Vercel (Recommended)
1. Push this folder to a GitHub repository, or install Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```
2. Set Framework Preset: **Other** / **Static Site**.
3. Output Directory: `.` (root directory).
4. Deploy! Your game will be live with an HTTPS URL (e.g. `https://kana-idly-kadai.vercel.app`).

### Deploy to Netlify
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the `Kana game project` folder directly into the browser window.
3. Your game is live in seconds on a free HTTPS URL.

### Deploy to GitHub Pages
1. Push this folder to a GitHub repository (do not open `index.html` as a file — the game uses ES modules).
2. Go to repository **Settings** → **Pages**.
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**. The game is hosted at `https://<username>.github.io/<repo-name>/`.

---

## 📁 Project Architecture

```
Kana game project/
├── index.html              # Main HTML5 entry point & canvas container
├── style.css               # South Indian visual styling, responsive layouts & modals
├── package.json            # Project metadata & npm preview script
├── vercel.json             # Vercel static deployment config
├── netlify.toml            # Netlify static deployment config
├── README.md               # Game documentation & deployment guide
└── src/
    ├── main.js             # Game bootstrap, keyboard/touch routing, state glue
    ├── game/
    │   ├── GameConfig.js       # Central data: dishes, prices, stations, days, upgrades
    │   ├── GameScene.js        # Core game loop (requestAnimationFrame), shift timers
    │   ├── RestaurantMap.js    # Floor plan, collision boxes, table & station layout
    │   ├── PlayerController.js # Chief cook movement, collision sliding, interaction zone
    │   ├── WaiterAI.js         # Autonomous Shinchan waiter state machine & delivery pathing
    │   ├── CustomerManager.js  # Customer spawning, archetypes, patience & eating
    │   ├── CookingManager.js   # 6 cooking stations, active timers, quality windows
    │   ├── OrderManager.js     # Order tickets lifecycle, queue management
    │   ├── EconomyManager.js   # Validated payments, base price, quality/speed bonuses, tips
    │   ├── UpgradeManager.js   # Upgrades shop logic & gameplay multipliers
    │   ├── SaveManager.js      # Robust localStorage persistence & schema safety
    │   ├── AudioManager.js     # Pure Web Audio API sound synthesizer
    │   ├── ParticleSystem.js   # Steam puffs, sizzle sparks, floating stars & rupee badges
    │   └── SpriteRenderer.js   # Procedural canvas cartoon graphics engine
    └── ui/
        ├── HUD.js              # Top bar, active order cards queue, interaction prompt
        ├── MainMenu.js         # South Indian Kadai title screen & modals
        ├── PauseMenu.js        # Pause, restart day, quit
        ├── SettingsMenu.js     # Audio toggles, controls diagram, progress reset
        ├── EndOfDayScreen.js   # Shift financial receipt & star rating recap
        ├── UpgradesShopUI.js   # Interactive upgrades catalog modal
        └── TouchControls.js    # Virtual joystick & action button for mobile
```

---

## 📜 License
MIT License. Created for South Indian cuisine lovers and arcade game fans worldwide.
