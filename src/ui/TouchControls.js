/**
 * KANA - Tamil Nadu Idly Kadai
 * Touch Controls - Responsive Virtual Joystick & Action Buttons for Mobile/Tablet
 */

export class TouchControls {
  constructor(container, onInteract) {
    this.container = container;
    this.onInteract = onInteract;
    this.element = null;
    this.vx = 0;
    this.vy = 0;
    this.activeTouchId = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'touch-controls-layer';
    this.element.className = 'touch-controls-container';

    this.element.innerHTML = `
      <!-- Virtual Joystick -->
      <div class="virtual-joystick-base" id="joystick-base">
        <div class="virtual-joystick-stick" id="joystick-stick"></div>
      </div>

      <!-- Action Button -->
      <div class="touch-action-btn" id="touch-action-btn">
        <span class="touch-action-icon">🍳</span>
        <span class="touch-action-label">COOK [E]</span>
      </div>
    `;

    this.container.appendChild(this.element);

    const base = this.element.querySelector('#joystick-base');
    const stick = this.element.querySelector('#joystick-stick');
    const actionBtn = this.element.querySelector('#touch-action-btn');

    const baseRadius = 55;

    const handleTouchMove = (touch) => {
      const rect = base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = touch.clientX - centerX;
      const dy = touch.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist === 0) {
        this.vx = 0;
        this.vy = 0;
        stick.style.transform = `translate(0px, 0px)`;
        return;
      }

      const clampedDist = Math.min(dist, baseRadius);
      const normX = dx / dist;
      const normY = dy / dist;

      this.vx = normX * (clampedDist / baseRadius);
      this.vy = normY * (clampedDist / baseRadius);

      stick.style.transform = `translate(${normX * clampedDist}px, ${normY * clampedDist}px)`;
    };

    base.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.activeTouchId = touch.identifier;
      handleTouchMove(touch);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (this.activeTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.activeTouchId) {
          handleTouchMove(e.changedTouches[i]);
          break;
        }
      }
    }, { passive: false });

    const endTouch = (e) => {
      if (this.activeTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.activeTouchId) {
          this.activeTouchId = null;
          this.vx = 0;
          this.vy = 0;
          stick.style.transform = `translate(0px, 0px)`;
          break;
        }
      }
    };

    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);

    // Action button
    actionBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      actionBtn.classList.add('active');
      if (this.onInteract) this.onInteract();
    }, { passive: false });

    actionBtn.addEventListener('touchend', () => {
      actionBtn.classList.remove('active');
    });

    // Check if touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || window.innerWidth < 850) {
      this.element.style.display = 'flex';
    }
  }

  getVector() {
    return { x: this.vx, y: this.vy };
  }
}
