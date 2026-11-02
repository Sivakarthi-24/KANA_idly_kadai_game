/**
 * KANA - Tamil Nadu Idly Kadai
 * End Of Day Screen - Daily Performance, Star Ratings, and Financial Breakdown
 */

import { audio } from '../game/AudioManager.js';

export class EndOfDayScreen {
  constructor(container, callbacks) {
    this.container = container;
    this.callbacks = callbacks; // { onNextDay, onRetry, onOpenShop, onMainMenu }
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'end-of-day-screen';
    this.element.className = 'menu-overlay modal-backdrop';
    this.element.style.display = 'none';

    this.element.innerHTML = `
      <div class="menu-card end-day-card">
        <h2 id="eod-title" class="eod-title">DAY COMPLETED!</h2>
        <div id="eod-tamil-title" class="eod-tamil-title">நாள் முடிந்தது!</div>

        <!-- Star Rating -->
        <div class="eod-stars" id="eod-stars">
          ⭐⭐⭐
        </div>

        <!-- Earnings Breakdown Table -->
        <div class="eod-receipt">
          <div class="receipt-row">
            <span>🍛 Food Sales Revenue</span>
            <span id="eod-food-rev">₹0</span>
          </div>
          <div class="receipt-row">
            <span>⭐ Quality Cooking Bonuses</span>
            <span id="eod-quality-rev">₹0</span>
          </div>
          <div class="receipt-row">
            <span>⚡ Fast Delivery Bonuses</span>
            <span id="eod-speed-rev">₹0</span>
          </div>
          <div class="receipt-row">
            <span>💖 Customer Tips</span>
            <span id="eod-tips-rev">₹0</span>
          </div>
          <div class="receipt-divider"></div>
          <div class="receipt-row total-row">
            <span>TOTAL SHIFT EARNINGS</span>
            <span id="eod-total-rev">₹0</span>
          </div>
          <div class="receipt-row target-row">
            <span>Daily Target:</span>
            <span id="eod-target-rev">₹0</span>
          </div>
        </div>

        <!-- Statistics Badges -->
        <div class="eod-stats-grid">
          <div class="eod-stat-chip">
            <span class="stat-num" id="eod-served">0</span>
            <span class="stat-lbl">Dishes Served</span>
          </div>
          <div class="eod-stat-chip">
            <span class="stat-num" id="eod-perfect">0</span>
            <span class="stat-lbl">Perfect Dishes</span>
          </div>
          <div class="eod-stat-chip">
            <span class="stat-num" id="eod-cancelled">0</span>
            <span class="stat-lbl">Cancelled</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="menu-btn-group">
          <button class="game-btn primary-btn" id="btn-eod-next">
            ▶ CONTINUE TO NEXT DAY
          </button>
          <button class="game-btn secondary-btn" id="btn-eod-retry">
            🔄 RETRY DAY
          </button>
          <button class="game-btn shop-btn" id="btn-eod-shop">
            🛍️ VISIT UPGRADES SHOP
          </button>
          <button class="game-btn ghost-btn" id="btn-eod-menu">
            🏠 MAIN MENU
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    this.titleEl = this.element.querySelector('#eod-title');
    this.tamilTitleEl = this.element.querySelector('#eod-tamil-title');
    this.starsEl = this.element.querySelector('#eod-stars');
    this.foodRevEl = this.element.querySelector('#eod-food-rev');
    this.qualityRevEl = this.element.querySelector('#eod-quality-rev');
    this.speedRevEl = this.element.querySelector('#eod-speed-rev');
    this.tipsRevEl = this.element.querySelector('#eod-tips-rev');
    this.totalRevEl = this.element.querySelector('#eod-total-rev');
    this.targetRevEl = this.element.querySelector('#eod-target-rev');
    this.servedEl = this.element.querySelector('#eod-served');
    this.perfectEl = this.element.querySelector('#eod-perfect');
    this.cancelledEl = this.element.querySelector('#eod-cancelled');
    this.nextBtn = this.element.querySelector('#btn-eod-next');

    this.nextBtn.addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onNextDay) this.callbacks.onNextDay();
    });

    this.element.querySelector('#btn-eod-retry').addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onRetry) this.callbacks.onRetry();
    });

    this.element.querySelector('#btn-eod-shop').addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onOpenShop) this.callbacks.onOpenShop();
    });

    this.element.querySelector('#btn-eod-menu').addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onMainMenu) this.callbacks.onMainMenu();
    });
  }

  show(resultData) {
    const { isSuccess, stars, stats, target, nextDayUnlocked } = resultData;

    if (isSuccess) {
      this.titleEl.textContent = 'DAY COMPLETE!';
      this.titleEl.className = 'eod-title success-title';
      this.tamilTitleEl.textContent = 'அருமை! இன்றைய இலக்கு அடைந்தது!';
      let starStr = '';
      for (let i = 0; i < 3; i++) {
        starStr += i < stars ? '⭐' : '☆';
      }
      this.starsEl.textContent = starStr;
      this.nextBtn.style.display = nextDayUnlocked ? 'block' : 'none';
      if (!nextDayUnlocked) {
        this.titleEl.textContent = 'CHAMPION OF CHENNAI TIFFIN!';
        this.tamilTitleEl.textContent = 'நீங்கள் சிறந்த முதன்மை சமையல்காரர்!';
      }
    } else {
      this.titleEl.textContent = 'TARGET MISSED!';
      this.titleEl.className = 'eod-title fail-title';
      this.tamilTitleEl.textContent = 'இலக்கு தவறவிட்டது! மீண்டும் முயற்சிக்கவும்!';
      this.starsEl.textContent = '☆☆☆';
      this.nextBtn.style.display = 'none';
    }

    this.foodRevEl.textContent = `₹${stats.foodRevenue}`;
    this.qualityRevEl.textContent = `+₹${stats.qualityBonuses}`;
    this.speedRevEl.textContent = `+₹${stats.speedBonuses}`;
    this.tipsRevEl.textContent = `+₹${stats.tips}`;
    this.totalRevEl.textContent = `₹${stats.totalEarned}`;
    this.targetRevEl.textContent = `₹${target}`;

    this.servedEl.textContent = stats.ordersServed;
    this.perfectEl.textContent = stats.perfectCount;
    this.cancelledEl.textContent = stats.ordersCancelled;

    this.element.style.display = 'flex';
  }

  hide() {
    if (this.element) this.element.style.display = 'none';
  }
}
