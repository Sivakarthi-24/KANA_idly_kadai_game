/**
 * KANA - Tamil Nadu Idly Kadai
 * Robust LocalStorage Save System
 */

const SAVE_KEY = 'KANA_IDLY_KADAI_SAVE_V1';

const DEFAULT_SAVE = {
  currentDay: 1,
  highestDayUnlocked: 1,
  cashBalance: 0,
  dayStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  upgrades: {
    FASTER_IDLI: 0,
    FASTER_DOSA: 0,
    FASTER_POORI: 0,
    SPEEDY_WAITER: 0,
    EXTRA_TABLE: 0,
    GHEE_QUALITY: 0,
    MARIGOLD_DECOR: 0
  },
  stats: {
    totalRevenue: 0,
    totalTips: 0,
    totalDishesServed: 0,
    perfectDishes: 0
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    reducedMotion: false
  }
};

export class SaveManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE));
      const parsed = JSON.parse(raw);

      // Deep validate and merge defaults to safeguard against corrupted / old schema
      return {
        currentDay: typeof parsed.currentDay === 'number' ? Math.max(1, parsed.currentDay) : 1,
        highestDayUnlocked: typeof parsed.highestDayUnlocked === 'number' ? Math.max(1, parsed.highestDayUnlocked) : 1,
        cashBalance: typeof parsed.cashBalance === 'number' && !isNaN(parsed.cashBalance) ? Math.max(0, Math.floor(parsed.cashBalance)) : 0,
        dayStars: { ...DEFAULT_SAVE.dayStars, ...(parsed.dayStars || {}) },
        upgrades: { ...DEFAULT_SAVE.upgrades, ...(parsed.upgrades || {}) },
        stats: { ...DEFAULT_SAVE.stats, ...(parsed.stats || {}) },
        settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings || {}) }
      };
    } catch (e) {
      console.warn('Failed to load save data, resetting to defaults:', e);
      return JSON.parse(JSON.stringify(DEFAULT_SAVE));
    }
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    this.save();
  }

  addCash(amount) {
    if (typeof amount === 'number' && !isNaN(amount) && amount > 0) {
      this.data.cashBalance += Math.floor(amount);
      this.data.stats.totalRevenue += Math.floor(amount);
      this.save();
    }
  }

  deductCash(amount) {
    if (typeof amount === 'number' && !isNaN(amount) && amount > 0 && this.data.cashBalance >= amount) {
      this.data.cashBalance -= Math.floor(amount);
      this.save();
      return true;
    }
    return false;
  }

  getUpgradeLevel(upgradeId) {
    return this.data.upgrades[upgradeId] || 0;
  }

  setUpgradeLevel(upgradeId, level) {
    this.data.upgrades[upgradeId] = level;
    this.save();
  }

  recordDayCompletion(dayNum, stars, revenue, tips, ordersCount, perfectCount) {
    this.data.dayStars[dayNum] = Math.max(this.data.dayStars[dayNum] || 0, stars);
    if (dayNum >= this.data.highestDayUnlocked && dayNum < 5) {
      this.data.highestDayUnlocked = dayNum + 1;
    }
    // Never rewind unlocked day when replaying an earlier shift
    this.data.currentDay = Math.max(this.data.currentDay || 1, Math.min(5, dayNum + 1));
    this.data.stats.totalTips += tips;
    this.data.stats.totalDishesServed += ordersCount;
    this.data.stats.perfectDishes += perfectCount;
    this.save();
  }

  resetProgress() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }
}

export const saveManager = new SaveManager();
