/**
 * KANA - Tamil Nadu Idly Kadai
 * Upgrades Shop UI - Interactive Equipment & Restaurant Upgrades
 */

import { UPGRADES } from '../game/GameConfig.js';
import { upgradeManager } from '../game/UpgradeManager.js';
import { saveManager } from '../game/SaveManager.js';
import { audio } from '../game/AudioManager.js';

export class UpgradesShopUI {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'upgrades-shop';
    this.element.className = 'game-modal';
    this.element.style.display = 'none';

    this.element.innerHTML = `
      <div class="modal-card shop-modal-card">
        <div class="shop-header">
          <h2>🛍️ Kadai Upgrades Shop</h2>
          <div class="shop-cash-badge">
            <span>Your Savings:</span>
            <strong id="shop-current-cash">₹0</strong>
          </div>
        </div>

        <div class="shop-grid" id="shop-items-grid">
          <!-- Upgrades rendered here -->
        </div>

        <button class="game-btn modal-close-btn" id="btn-close-shop">
          RETURN TO KADAI
        </button>
      </div>
    `;

    this.container.appendChild(this.element);

    this.cashEl = this.element.querySelector('#shop-current-cash');
    this.gridEl = this.element.querySelector('#shop-items-grid');

    this.element.querySelector('#btn-close-shop').addEventListener('click', () => {
      audio.playClick();
      this.hide();
      if (this.onClose) this.onClose();
    });
  }

  show() {
    if (!this.element) return;
    this.refresh();
    this.element.style.display = 'flex';
  }

  hide() {
    if (this.element) this.element.style.display = 'none';
  }

  refresh() {
    const cash = saveManager.get('cashBalance');
    this.cashEl.textContent = `₹${cash}`;
    this.gridEl.innerHTML = '';

    Object.keys(UPGRADES).forEach(upgradeId => {
      const info = upgradeManager.getUpgradeInfo(upgradeId);
      const card = document.createElement('div');
      card.className = 'shop-card';

      const canBuy = upgradeManager.canAfford(upgradeId);

      card.innerHTML = `
        <div class="shop-card-icon">${info.icon}</div>
        <div class="shop-card-content">
          <div class="shop-card-top">
            <span class="shop-item-name">${info.name}</span>
            <span class="shop-level-pill ${info.isMax ? 'maxed' : ''}">
              ${info.isMax ? 'MAX LEVEL' : `Lvl ${info.currentLevel}/${info.maxLevel}`}
            </span>
          </div>
          <p class="shop-item-desc">${info.description}</p>
          <div class="shop-card-action">
            <span class="shop-item-price">${info.isMax ? 'Completed' : `₹${info.cost}`}</span>
            <button class="game-btn shop-buy-btn" data-id="${upgradeId}" ${!canBuy ? 'disabled' : ''}>
              ${info.isMax ? 'MAXED' : 'UPGRADE'}
            </button>
          </div>
        </div>
      `;

      const buyBtn = card.querySelector('.shop-buy-btn');
      if (!info.isMax) {
        buyBtn.addEventListener('click', () => {
          const res = upgradeManager.purchase(upgradeId);
          if (res.success) {
            this.refresh();
          } else {
            alert(res.reason);
          }
        });
      }

      this.gridEl.appendChild(card);
    });
  }
}
