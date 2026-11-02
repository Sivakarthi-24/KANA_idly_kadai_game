/**
 * KANA - Tamil Nadu Idly Kadai
 * Main Application Entry Point & UI/Game Lifecycle Wiring
 */

import { GameScene } from './game/GameScene.js';
import { HUD } from './ui/HUD.js';
import { MainMenu } from './ui/MainMenu.js';
import { PauseMenu } from './ui/PauseMenu.js';
import { SettingsMenu } from './ui/SettingsMenu.js';
import { EndOfDayScreen } from './ui/EndOfDayScreen.js';
import { UpgradesShopUI } from './ui/UpgradesShopUI.js';
import { TouchControls } from './ui/TouchControls.js';
import { audio } from './game/AudioManager.js';
import { assets } from './game/AssetManager.js';
import { saveManager } from './game/SaveManager.js';

window.addEventListener('DOMContentLoaded', async () => {
  const bootStatus = document.getElementById('boot-status');
  try {
    await assets.load();
  } catch (err) {
    console.warn('Some assets failed to load, using cartoon fallbacks.', err);
  }
  if (bootStatus) bootStatus.remove();

  const savedSettings = saveManager.get('settings');
  if (savedSettings) {
    audio.setSoundEnabled(savedSettings.soundEnabled !== false);
    audio.setMusicEnabled(savedSettings.musicEnabled !== false);
  }
  const canvas = document.getElementById('game-canvas');
  const uiContainer = document.getElementById('ui-overlay');

  if (!canvas || !uiContainer) {
    console.error('Canvas or UI container element not found');
    return;
  }

  // Set internal canvas resolution
  canvas.width = 920;
  canvas.height = 580;

  // Initialize UI components
  let hud = null;
  let mainMenu = null;
  let pauseMenu = null;
  let settingsMenu = null;
  let endOfDayScreen = null;
  let shopUI = null;
  let touchControls = null;

  // Initialize GameScene
  const scene = new GameScene(canvas, {
    onHUDUpdate: (data) => {
      if (hud) hud.update(data);
    },
    onDayComplete: (resultData) => {
      if (hud) hud.hide();
      if (endOfDayScreen) endOfDayScreen.show(resultData);
    }
  });

  // UI callbacks
  hud = new HUD(uiContainer, () => {
    // Pause button clicked
    scene.pause();
    pauseMenu.show();
  });
  hud.hide();

  mainMenu = new MainMenu(uiContainer, {
    onStartGame: (dayNum) => {
      mainMenu.hide();
      hud.show();
      scene.startDay(dayNum);
    },
    onOpenShop: () => {
      shopUI.show();
    },
    onOpenSettings: () => {
      settingsMenu.show();
    }
  });

  pauseMenu = new PauseMenu(uiContainer, {
    onResume: () => {
      pauseMenu.hide();
      scene.resume();
    },
    onRestartDay: () => {
      pauseMenu.hide();
      hud.show();
      scene.restartDay();
    },
    onOpenSettings: () => {
      settingsMenu.show();
    },
    onQuitToMain: () => {
      pauseMenu.hide();
      scene.stop();
      hud.hide();
      mainMenu.show();
    }
  });

  settingsMenu = new SettingsMenu(uiContainer, () => {});

  shopUI = new UpgradesShopUI(uiContainer, () => {});

  endOfDayScreen = new EndOfDayScreen(uiContainer, {
    onNextDay: () => {
      endOfDayScreen.hide();
      hud.show();
      scene.startDay(Math.min(5, scene.currentDayNum + 1));
    },
    onRetry: () => {
      endOfDayScreen.hide();
      hud.show();
      scene.startDay(scene.currentDayNum);
    },
    onOpenShop: () => {
      shopUI.show();
    },
    onMainMenu: () => {
      endOfDayScreen.hide();
      mainMenu.show();
    }
  });

  // Touch controls for mobile / tablet
  touchControls = new TouchControls(uiContainer, () => {
    scene.player.interact();
  });

  // Feed touch vector to player controller
  setInterval(() => {
    if (touchControls && scene.player) {
      const v = touchControls.getVector();
      scene.player.setVirtualInput(v.x, v.y);
    }
  }, 16);

  // Global Keyboard event listeners
  window.addEventListener('keydown', (e) => {
    // Prevent default scroll behavior for arrow keys and spacebar during gameplay
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      if (scene.isRunning && !scene.isPaused) {
        e.preventDefault();
      }
    }

    if (e.code === 'Escape') {
      if (scene.isRunning) {
        if (scene.isPaused) {
          pauseMenu.hide();
          scene.resume();
        } else {
          scene.pause();
          pauseMenu.show();
        }
      }
      return;
    }

    if (scene.isRunning && !scene.isPaused) {
      scene.handleKeyDown(e.code);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (scene.isRunning) {
      scene.handleKeyUp(e.code);
    }
  });

  // Start with audio enabled on first user gesture
  const initAudioOnUserInteraction = () => {
    audio.ensureContext();
    window.removeEventListener('click', initAudioOnUserInteraction);
    window.removeEventListener('keydown', initAudioOnUserInteraction);
    window.removeEventListener('touchstart', initAudioOnUserInteraction);
  };
  window.addEventListener('click', initAudioOnUserInteraction);
  window.addEventListener('keydown', initAudioOnUserInteraction);
  window.addEventListener('touchstart', initAudioOnUserInteraction);

  // Show main menu initially
  mainMenu.show();
});
