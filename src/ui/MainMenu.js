/**
 * KANA - Tamil Nadu Idly Kadai
 * Main Menu - South Indian Restaurant Title Screen, Navigation & Modals
 */

import { saveManager } from '../game/SaveManager.js';
import { audio } from '../game/AudioManager.js';

export class MainMenu {
  constructor(container, callbacks) {
    this.container = container;
    this.callbacks = callbacks; // { onStartGame, onOpenShop, onOpenSettings }
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'main-menu';
    this.element.className = 'menu-overlay main-menu-bg';

    const savedDay = saveManager.get('currentDay');
    const cash = saveManager.get('cashBalance');

    this.element.innerHTML = `
      <div class="menu-card main-menu-card">
        <!-- Traditional South Indian Restaurant Signboard Header -->
        <div class="main-title-badge">
          <img class="menu-hero-photo" src="assets/tiffin.jpg" alt="South Indian tiffin breakfast">
          <div class="tamil-title-sub">தமிழ்நாடு பாரம்பரிய உணவகம்</div>
          <h1 class="main-title">KANA</h1>
          <div class="tamil-title-main">தமிழ்நாடு இட்லி கடை</div>
          <div class="title-sub-text">TAMIL NADU IDLY KADAI • SOUTH INDIAN TIFFIN</div>
        </div>

        <div class="main-status-banner">
          <span>💰 Rupee Savings: <strong>₹${cash}</strong></span>
          <span>📅 Unlocked Day: <strong>${savedDay} / 5</strong></span>
        </div>

        <!-- Menu Action Buttons -->
        <div class="menu-btn-group">
          <button class="game-btn primary-btn" id="btn-play-day">
            <span class="btn-icon">🍳</span> START DAY ${savedDay}
          </button>
          
          <button class="game-btn shop-btn" id="btn-menu-shop">
            <span class="btn-icon">🛍️</span> UPGRADES KADAI SHOP
          </button>

          <button class="game-btn secondary-btn" id="btn-menu-how">
            <span class="btn-icon">📖</span> HOW TO PLAY
          </button>

          <button class="game-btn secondary-btn" id="btn-menu-settings">
            <span class="btn-icon">⚙️</span> SETTINGS
          </button>

          <button class="game-btn ghost-btn" id="btn-menu-credits">
            <span class="btn-icon">✨</span> CREDITS
          </button>
        </div>
      </div>

      <!-- How To Play Modal -->
      <div class="game-modal" id="modal-how" style="display: none;">
        <div class="modal-card">
          <h2>📖 How to Run the Kadai</h2>
          <div class="tutorial-steps">
            <div class="tut-step">
              <span class="tut-num">1</span>
              <div>
                <strong>Customers Arrive & Order:</strong> Customers sit at tables. Our energetic waiter Shinchan takes their order tickets to the kitchen.
              </div>
            </div>
            <div class="tut-step">
              <span class="tut-num">2</span>
              <div>
                <strong>Chief Cook Moves & Cooks:</strong> Walk using <strong>W A S D</strong> or <strong>Arrow Keys</strong>. Approach any cooking station and press <strong>[E]</strong> or <strong>Space</strong> to start cooking!
              </div>
            </div>
            <div class="tut-step">
              <span class="tut-num">3</span>
              <div>
                <strong>Timing is Everything:</strong> Collect dishes inside the <strong>PERFECT WINDOW</strong> for massive quality bonuses! Don't let them burn.
              </div>
            </div>
            <div class="tut-step">
              <span class="tut-num">4</span>
              <div>
                <strong>Place on Serving Counter:</strong> Take the finished dish to the Serving Counter [E]. Shinchan picks it up and delivers it hot to the customer!
              </div>
            </div>
            <div class="tut-step">
              <span class="tut-num">5</span>
              <div>
                <strong>Earn Rupees & Tips:</strong> Earn base food sales + speed bonuses + quality bonuses + customer tips! Use earnings to upgrade your kadai equipment.
              </div>
            </div>
          </div>
          <button class="game-btn modal-close-btn" id="btn-close-how">GOT IT!</button>
        </div>
      </div>

      <!-- Credits Modal -->
      <div class="game-modal" id="modal-credits" style="display: none;">
        <div class="modal-card">
          <h2>✨ KANA: Tamil Nadu Idly Kadai</h2>
          <p class="credits-body">
            A celebration of traditional South Indian breakfast culture and hospitality!
            <br><br>
            <strong>Dishes Featured:</strong><br>
            • Steamed Fluffy Idly (₹10)<br>
            • Crispy Golden Dosa (₹20)<br>
            • Balloon Puffed Poori Masala (₹20)<br>
            • Ghee Ven Pongal (₹15)<br>
            • Soft Tawa Chapati (₹15)<br>
            • Spiced Egg Dosa (₹25)<br><br>
            Built with HTML5 Canvas, Web Audio API, and Modern JavaScript.
          </p>
          <button class="game-btn modal-close-btn" id="btn-close-credits">CLOSE</button>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    // Event listeners
    this.element.querySelector('#btn-play-day').addEventListener('click', () => {
      audio.playClick();
      const day = saveManager.get('currentDay');
      if (this.callbacks.onStartGame) this.callbacks.onStartGame(day);
    });

    this.element.querySelector('#btn-menu-shop').addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onOpenShop) this.callbacks.onOpenShop();
    });

    this.element.querySelector('#btn-menu-how').addEventListener('click', () => {
      audio.playClick();
      this.element.querySelector('#modal-how').style.display = 'flex';
    });

    this.element.querySelector('#btn-close-how').addEventListener('click', () => {
      audio.playClick();
      this.element.querySelector('#modal-how').style.display = 'none';
    });

    this.element.querySelector('#btn-menu-settings').addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onOpenSettings) this.callbacks.onOpenSettings();
    });

    this.element.querySelector('#btn-menu-credits').addEventListener('click', () => {
      audio.playClick();
      this.element.querySelector('#modal-credits').style.display = 'flex';
    });

    this.element.querySelector('#btn-close-credits').addEventListener('click', () => {
      audio.playClick();
      this.element.querySelector('#modal-credits').style.display = 'none';
    });
  }

  show() {
    if (this.element) {
      const savedDay = saveManager.get('currentDay');
      const cash = saveManager.get('cashBalance');
      const playBtn = this.element.querySelector('#btn-play-day');
      if (playBtn) playBtn.innerHTML = `<span class="btn-icon">🍳</span> START DAY ${savedDay}`;
      const statusBanner = this.element.querySelector('.main-status-banner');
      if (statusBanner) {
        statusBanner.innerHTML = `
          <span>💰 Rupee Savings: <strong>₹${cash}</strong></span>
          <span>📅 Unlocked Day: <strong>${savedDay} / 5</strong></span>
        `;
      }
      this.element.style.display = 'flex';
    }
  }

  hide() {
    if (this.element) this.element.style.display = 'none';
  }
}
