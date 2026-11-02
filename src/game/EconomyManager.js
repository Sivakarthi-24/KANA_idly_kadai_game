/**
 * KANA - Tamil Nadu Idly Kadai
 * Economy Manager - Authoritative Financial & Rewards Calculations
 */

import { saveManager } from './SaveManager.js';
import { upgradeManager } from './UpgradeManager.js';
import { audio } from './AudioManager.js';

export class EconomyManager {
  constructor() {
    this.resetDayStats();
  }

  resetDayStats() {
    this.dayStats = {
      foodRevenue: 0,
      qualityBonuses: 0,
      speedBonuses: 0,
      tips: 0,
      totalEarned: 0,
      ordersServed: 0,
      ordersCancelled: 0,
      perfectCount: 0
    };
    this.paidOrderIds = new Set();
    this.cancelledOrderIds = new Set();
  }

  /**
   * Authoritative transaction validation for an order
   */
  processCompletedOrder(order, qualityRating, patienceRatio) {
    if (!order || !order.id) {
      console.error('Invalid order passed to EconomyManager');
      return null;
    }

    if (this.paidOrderIds.has(order.id)) {
      console.warn(`Order ${order.id} has already been paid! Preventing duplicate payment.`);
      return null;
    }

    if (order.status === 'CANCELLED') {
      console.warn(`Attempted to pay for cancelled order ${order.id}`);
      return null;
    }

    // Mark as paid
    this.paidOrderIds.add(order.id);

    // 1. Base selling price (fixed as per game spec)
    const basePrice = order.price || 10;

    // 2. Quality bonus
    let qualityBonus = 0;
    if (qualityRating === 'PERFECT') {
      qualityBonus = basePrice >= 20 ? 5 : 3;
      this.dayStats.perfectCount++;
    } else if (qualityRating === 'GOOD') {
      qualityBonus = 1;
    } else {
      qualityBonus = 0; // Overcooked gets 0 bonus
    }

    // 3. Speed bonus (based on customer patience remaining)
    let speedBonus = 0;
    if (patienceRatio >= 0.70) {
      speedBonus = 3;
    } else if (patienceRatio >= 0.40) {
      speedBonus = 1;
    }

    // 4. Tip calculation (influenced by satisfaction, quality, and upgrades)
    let baseTip = 0;
    const tipMult = upgradeManager.getTipMultiplier();

    if (qualityRating === 'PERFECT') {
      if (patienceRatio >= 0.75) {
        baseTip = Math.round(6 * tipMult);
      } else if (patienceRatio >= 0.45) {
        baseTip = Math.round(4 * tipMult);
      } else {
        baseTip = Math.round(2 * tipMult);
      }
    } else if (qualityRating === 'GOOD') {
      if (patienceRatio >= 0.60) {
        baseTip = Math.round(3 * tipMult);
      } else if (patienceRatio >= 0.30) {
        baseTip = Math.round(1 * tipMult);
      }
    } else {
      // Overcooked dish -> no tip
      baseTip = 0;
    }

    const tip = Math.max(0, baseTip);
    const orderTotal = basePrice + qualityBonus + speedBonus + tip;

    // Update day stats
    this.dayStats.foodRevenue += basePrice;
    this.dayStats.qualityBonuses += qualityBonus;
    this.dayStats.speedBonuses += speedBonus;
    this.dayStats.tips += tip;
    this.dayStats.totalEarned += orderTotal;
    this.dayStats.ordersServed += 1;

    // Credit to persistent balance
    saveManager.addCash(orderTotal);

    // Sound effect
    audio.playCoin();
    if (qualityRating === 'PERFECT') {
      setTimeout(() => audio.playPerfect(), 180);
    }

    return {
      orderId: order.id,
      dishName: order.dishName,
      basePrice,
      qualityBonus,
      speedBonus,
      tip,
      totalEarned: orderTotal,
      qualityRating
    };
  }

  recordCancelledOrder(order) {
    if (!order || !order.id) return;
    if (this.paidOrderIds.has(order.id)) return;
    if (this.cancelledOrderIds.has(order.id)) return;
    this.cancelledOrderIds.add(order.id);
    this.dayStats.ordersCancelled += 1;
  }

  getDayStats() {
    return { ...this.dayStats };
  }

  getCurrentCash() {
    return saveManager.get('cashBalance');
  }
}

export const economyManager = new EconomyManager();
