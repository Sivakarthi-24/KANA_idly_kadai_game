/**
 * KANA - Tamil Nadu Idly Kadai
 * Upgrade Manager - Handles Upgrades, Purchases, & Stat Multipliers
 */

import { UPGRADES } from './GameConfig.js';
import { saveManager } from './SaveManager.js';
import { audio } from './AudioManager.js';

export class UpgradeManager {
  constructor() {
    this.upgrades = UPGRADES;
  }

  getUpgradeInfo(upgradeId) {
    const config = this.upgrades[upgradeId];
    if (!config) return null;
    const currentLevel = saveManager.getUpgradeLevel(upgradeId);
    const isMax = currentLevel >= config.maxLevel;
    const nextCost = isMax ? null : config.costs[currentLevel];

    return {
      id: upgradeId,
      name: config.name,
      description: config.description,
      icon: config.icon,
      currentLevel,
      maxLevel: config.maxLevel,
      isMax,
      cost: nextCost
    };
  }

  canAfford(upgradeId) {
    const info = this.getUpgradeInfo(upgradeId);
    if (!info || info.isMax) return false;
    return saveManager.get('cashBalance') >= info.cost;
  }

  purchase(upgradeId) {
    const info = this.getUpgradeInfo(upgradeId);
    if (!info || info.isMax) return { success: false, reason: 'Already at maximum level' };

    if (saveManager.get('cashBalance') < info.cost) {
      return { success: false, reason: 'Insufficient Rupees' };
    }

    const deducted = saveManager.deductCash(info.cost);
    if (deducted) {
      const newLevel = info.currentLevel + 1;
      saveManager.setUpgradeLevel(upgradeId, newLevel);
      audio.playUpgradeSuccess();
      return { success: true, newLevel, cost: info.cost };
    }

    return { success: false, reason: 'Transaction error' };
  }

  // Multipliers queried during gameplay
  getCookTimeMultiplier(stationId) {
    if (stationId === 'IDLI_STATION') {
      const lvl = saveManager.getUpgradeLevel('FASTER_IDLI');
      if (lvl > 0) return this.upgrades.FASTER_IDLI.effects[lvl - 1];
    }
    if (stationId === 'DOSA_STATION' || stationId === 'EGG_DOSA_STATION') {
      const lvl = saveManager.getUpgradeLevel('FASTER_DOSA');
      if (lvl > 0) return this.upgrades.FASTER_DOSA.effects[lvl - 1];
    }
    if (stationId === 'POORI_STATION') {
      const lvl = saveManager.getUpgradeLevel('FASTER_POORI');
      if (lvl > 0) return this.upgrades.FASTER_POORI.effects[lvl - 1];
    }
    return 1.0;
  }

  getWaiterSpeedMultiplier() {
    const lvl = saveManager.getUpgradeLevel('SPEEDY_WAITER');
    if (lvl > 0) return this.upgrades.SPEEDY_WAITER.effects[lvl - 1];
    return 1.0;
  }

  getTipMultiplier() {
    const lvl = saveManager.getUpgradeLevel('GHEE_QUALITY');
    if (lvl > 0) return this.upgrades.GHEE_QUALITY.effects[lvl - 1];
    return 1.0;
  }

  getPatienceMultiplier() {
    const lvl = saveManager.getUpgradeLevel('MARIGOLD_DECOR');
    if (lvl > 0) return this.upgrades.MARIGOLD_DECOR.effects[lvl - 1];
    return 1.0;
  }

  getExtraTablesUnlocked() {
    return saveManager.getUpgradeLevel('EXTRA_TABLE');
  }
}

export const upgradeManager = new UpgradeManager();
