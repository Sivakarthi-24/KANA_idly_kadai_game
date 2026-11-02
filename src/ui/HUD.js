/**
 * KANA - Tamil Nadu Idly Kadai
 * HUD - In-Game Interface (Rupee Balance, Day Target, Orders Queue, Interaction Prompts)
 */

export class HUD {
  constructor(containerElement, onPauseClick) {
    this.container = containerElement;
    this.onPauseClick = onPauseClick;
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'game-hud';
    this.element.className = 'hud-container';
    this.element.innerHTML = `
      <!-- Top Status Bar -->
      <div class="hud-top-bar">
        <div class="hud-stat-box balance-box">
          <span class="hud-icon">💰</span>
          <div class="hud-stat-info">
            <span class="hud-label">CASH BALANCE</span>
            <span class="hud-val gold-text" id="hud-balance">₹0</span>
          </div>
        </div>

        <div class="hud-stat-box day-box">
          <span class="hud-icon">📅</span>
          <div class="hud-stat-info">
            <span class="hud-label" id="hud-day-title">Day 1: Small Morning Kadai</span>
            <div class="hud-progress-wrapper">
              <div class="hud-progress-bar" id="hud-target-bar" style="width: 0%"></div>
              <span class="hud-progress-text" id="hud-target-text">₹0 / ₹100 Target</span>
            </div>
          </div>
        </div>

        <div class="hud-stat-box timer-box">
          <span class="hud-icon">⏰</span>
          <div class="hud-stat-info">
            <span class="hud-label">BREAKFAST RUSH</span>
            <span class="hud-val timer-val" id="hud-timer">90s</span>
          </div>
        </div>

        <button class="hud-btn pause-btn" id="hud-pause-btn" title="Pause Game">
          ⏸️
        </button>
      </div>

      <!-- Active Order Queue Cards Bar -->
      <div class="hud-order-queue" id="hud-order-queue">
        <!-- Order cards dynamically inserted here -->
      </div>

      <!-- Bottom Interaction & Held Item Bar -->
      <div class="hud-bottom-bar">
        <div class="hud-held-item" id="hud-held-item" style="display: none;">
          <span class="held-label">Holding:</span>
          <span class="held-dish" id="hud-held-name">Dosa</span>
        </div>
        <div class="hud-prompt-badge" id="hud-prompt" style="display: none;">
          <span class="key-pill">E</span>
          <span id="hud-prompt-text">Interact</span>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    this.balanceEl = this.element.querySelector('#hud-balance');
    this.dayTitleEl = this.element.querySelector('#hud-day-title');
    this.targetBarEl = this.element.querySelector('#hud-target-bar');
    this.targetTextEl = this.element.querySelector('#hud-target-text');
    this.timerEl = this.element.querySelector('#hud-timer');
    this.queueEl = this.element.querySelector('#hud-order-queue');
    this.heldItemEl = this.element.querySelector('#hud-held-item');
    this.heldNameEl = this.element.querySelector('#hud-held-name');
    this.promptEl = this.element.querySelector('#hud-prompt');
    this.promptTextEl = this.element.querySelector('#hud-prompt-text');

    this.element.querySelector('#hud-pause-btn').addEventListener('click', () => {
      if (this.onPauseClick) this.onPauseClick();
    });

    this.lastOrderSignature = null;
  }

  show() {
    if (this.element) this.element.style.display = 'block';
  }

  hide() {
    if (this.element) this.element.style.display = 'none';
  }

  update(data) {
    if (!this.element) return;

    // Balance
    this.balanceEl.textContent = `₹${data.cashBalance}`;

    // Day & Target
    this.dayTitleEl.textContent = `Day ${data.currentDay}: ${data.dayTitle}`;
    const target = data.targetRevenue || 1;
    const pct = Math.min(100, Math.round((data.totalDayEarned / target) * 100));
    this.targetBarEl.style.width = `${pct}%`;
    this.targetTextEl.textContent = `₹${data.totalDayEarned} / ₹${data.targetRevenue} Target`;

    // Timer
    this.timerEl.textContent = `${data.timeRemaining}s`;
    if (data.timeRemaining <= 15) {
      this.timerEl.classList.add('urgent-timer');
    } else {
      this.timerEl.classList.remove('urgent-timer');
    }

    // Held item
    if (data.heldDish) {
      this.heldItemEl.style.display = 'inline-flex';
      this.heldNameEl.textContent = `${data.heldDish.dishName} (${data.heldDish.quality})`;
    } else {
      this.heldItemEl.style.display = 'none';
    }

    // Interaction prompt
    if (data.interactionPrompt) {
      this.promptEl.style.display = 'inline-flex';
      this.promptTextEl.textContent = data.interactionPrompt;
    } else {
      this.promptEl.style.display = 'none';
    }

    // Orders Queue
    this.renderOrders(data.activeOrders);
  }

  renderOrders(activeOrders) {
    const signature = (activeOrders || [])
      .map(o => `${o.id}:${o.status}:${Math.round(o.patienceRemaining)}`)
      .join('|');
    if (signature === this.lastOrderSignature) return;
    this.lastOrderSignature = signature;

    if (!activeOrders || activeOrders.length === 0) {
      this.queueEl.innerHTML = '<div class="no-orders-hint">Waiting for orders...</div>';
      return;
    }

    this.queueEl.innerHTML = '';
    activeOrders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const pRatio = Math.max(0, Math.min(1, order.patienceRemaining / order.totalPatience));
      let pColor = '#10b981';
      if (pRatio < 0.3) {
        pColor = '#ef4444';
        card.classList.add('urgent-order');
      } else if (pRatio < 0.6) {
        pColor = '#f59e0b';
      }

      card.innerHTML = `
        <div class="order-card-header">
          <span class="order-id">#${order.id}</span>
          <span class="order-price">₹${order.price}</span>
        </div>
        <div class="order-dish-name">${order.dishName}</div>
        <div class="order-tamil-name">${order.tamilName || ''}</div>
        <div class="order-status-badge ${order.status.toLowerCase()}">${formatStatus(order.status)}</div>
        <div class="order-patience-track">
          <div class="order-patience-fill" style="width: ${pRatio * 100}%; background: ${pColor};"></div>
        </div>
      `;

      this.queueEl.appendChild(card);
    });
  }
}

function formatStatus(status) {
  switch (status) {
    case 'ORDERED': return 'Order Taken';
    case 'WAITING_FOR_COOK': return 'Kitchen Cooking';
    case 'OUT_FOR_DELIVERY': return 'Delivering';
    case 'SERVED': return 'Served!';
    default: return status;
  }
}
