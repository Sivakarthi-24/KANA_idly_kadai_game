/**
 * KANA - Tamil Nadu Idly Kadai
 * Pause Menu
 */

import { audio } from '../game/AudioManager.js';

export class PauseMenu {
  constructor(container, callbacks) {
    this.container = container;
    this.callbacks = callbacks; // { onResume, onRestartDay, onOpenSettings, onQuitToMain }
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'pause-menu';
    this.element.className = 'menu-overlay modal-backdrop';
    this.element.style.display = 'none';

    this.element.innerHTML = `
      <div class="menu-card modal-card">
        <h2>⏸️ Kadai Paused</h2>
        <div class="menu-btn-group">
          <button class="game-btn primary-btn" id="btn-pause-resume">
            ▶ RESUME COOKING
          </button>
          <button class="game-btn secondary-btn" id="btn-pause-restart">
            🔄 RESTART DAY
          </button>
          <button class="game-btn secondary-btn" id="btn-pause-settings">
            ⚙️ SETTINGS
          </button>
          <button class="game-btn ghost-btn" id="btn-pause-quit">
            🏠 QUIT TO MAIN MENU
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);

    this.element.querySelector('#btn-pause-resume').addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onResume) this.callbacks.onResume();
    });

    this.element.querySelector('#btn-pause-restart').addEventListener('click', () => {
      audio.playClick();
      if (confirm('Restart the current day? Progress in this shift will be reset.')) {
        if (this.callbacks.onRestartDay) this.callbacks.onRestartDay();
      }
    });

    this.element.querySelector('#btn-pause-settings').addEventListener('click', () => {
      audio.playClick();
      if (this.callbacks.onOpenSettings) this.callbacks.onOpenSettings();
    });

    this.element.querySelector('#btn-pause-quit').addEventListener('click', () => {
      audio.playClick();
      if (confirm('Quit shift and return to Main Menu? Current day earnings will not be saved.')) {
        if (this.callbacks.onQuitToMain) this.callbacks.onQuitToMain();
      }
    });
  }

  show() {
    if (this.element) this.element.style.display = 'flex';
  }

  hide() {
    if (this.element) this.element.style.display = 'none';
  }
}
