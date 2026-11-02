/**
 * KANA - Tamil Nadu Idly Kadai
 * Settings Menu - Audio toggles, Controls info, and Save Reset
 */

import { saveManager } from '../game/SaveManager.js';
import { audio } from '../game/AudioManager.js';

export class SettingsMenu {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'settings-menu';
    this.element.className = 'game-modal';
    this.element.style.display = 'none';

    const settings = saveManager.get('settings') || { soundEnabled: true, musicEnabled: true, reducedMotion: false };
    audio.setSoundEnabled(settings.soundEnabled !== false);
    audio.setMusicEnabled(settings.musicEnabled !== false);

    this.element.innerHTML = `
      <div class="modal-card settings-card">
        <h2>⚙️ Kadai Settings</h2>

        <div class="settings-list">
          <div class="setting-row">
            <span>🔊 Sound Effects</span>
            <label class="switch">
              <input type="checkbox" id="setting-sound" ${settings.soundEnabled ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-row">
            <span>🎵 Music & Jingles</span>
            <label class="switch">
              <input type="checkbox" id="setting-music" ${settings.musicEnabled ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-row">
            <span>💨 Reduced Animations</span>
            <label class="switch">
              <input type="checkbox" id="setting-motion" ${settings.reducedMotion ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-controls-box">
          <h3>🎮 Controls</h3>
          <p><strong>Move Chief Cook:</strong> W, A, S, D or Arrow Keys</p>
          <p><strong>Cook / Interact / Collect:</strong> [E] or [Spacebar]</p>
          <p><strong>Pause:</strong> [Escape] or Top Right Button</p>
          <p><strong>Touchscreen:</strong> On-screen Virtual Joystick & Action button</p>
        </div>

        <div class="danger-zone">
          <button class="game-btn danger-btn" id="btn-reset-save">
            ⚠️ RESET PROGRESS
          </button>
        </div>

        <button class="game-btn modal-close-btn" id="btn-close-settings">
          SAVE & CLOSE
        </button>
      </div>
    `;

    this.container.appendChild(this.element);

    const soundInput = this.element.querySelector('#setting-sound');
    const musicInput = this.element.querySelector('#setting-music');
    const motionInput = this.element.querySelector('#setting-motion');

    soundInput.addEventListener('change', (e) => {
      audio.setSoundEnabled(e.target.checked);
      this.updateSettings({ soundEnabled: e.target.checked });
      if (e.target.checked) audio.playClick();
    });

    musicInput.addEventListener('change', (e) => {
      audio.setMusicEnabled(e.target.checked);
      this.updateSettings({ musicEnabled: e.target.checked });
      if (e.target.checked) audio.playClick();
    });

    motionInput.addEventListener('change', (e) => {
      this.updateSettings({ reducedMotion: e.target.checked });
    });

    this.element.querySelector('#btn-reset-save').addEventListener('click', () => {
      if (confirm('Are you sure you want to completely reset all saved progress and Rupees? This cannot be undone.')) {
        saveManager.resetProgress();
        alert('Kadai progress has been reset.');
        location.reload();
      }
    });

    this.element.querySelector('#btn-close-settings').addEventListener('click', () => {
      audio.playClick();
      this.hide();
      if (this.onClose) this.onClose();
    });
  }

  updateSettings(partial) {
    const current = saveManager.get('settings');
    saveManager.set('settings', { ...current, ...partial });
  }

  show() {
    if (this.element) this.element.style.display = 'flex';
  }

  hide() {
    if (this.element) this.element.style.display = 'none';
  }
}
