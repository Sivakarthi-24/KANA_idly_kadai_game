/**
 * KANA - Tamil Nadu Idly Kadai
 * Cooking Manager - Manages Stations, Timers, Quality, and Cooked Food
 */

import { DISHES, STATIONS } from './GameConfig.js';
import { upgradeManager } from './UpgradeManager.js';
import { audio } from './AudioManager.js';

export class CookingManager {
  constructor(particleSystem) {
    this.particles = particleSystem;

    // Station states
    this.stations = {};
    Object.keys(STATIONS).forEach(id => {
      if (id !== 'SERVING_COUNTER' && id !== 'INGREDIENT_COUNTER') {
        const stationDef = STATIONS[id];
        const dishDef = DISHES[stationDef.dishId];
        this.stations[id] = {
          id,
          def: stationDef,
          dishDef,
          state: 'IDLE', // IDLE, COOKING, READY, OVERCOOKED
          elapsed: 0,
          totalCookTime: dishDef.cookTime,
          quality: null,
          dishReady: null,
          sizzleTimer: 0
        };
      }
    });

    // Serving Counter Slots (Max 4 prepared dishes ready for waiter pickup)
    this.servingCounter = [];
    this.maxServingSlots = STATIONS.SERVING_COUNTER.maxSlots || 4;
    this.allowedDishIds = null;
  }

  setAllowedDishes(dishIds) {
    this.allowedDishIds = Array.isArray(dishIds) ? dishIds : null;
  }

  reset() {
    Object.keys(this.stations).forEach(id => {
      this.stations[id].state = 'IDLE';
      this.stations[id].elapsed = 0;
      this.stations[id].quality = null;
      this.stations[id].dishReady = null;
    });
    this.servingCounter = [];
  }

  update(dt) {
    Object.keys(this.stations).forEach(id => {
      const station = this.stations[id];
      if (station.state === 'COOKING') {
        station.elapsed += dt;
        const dish = station.dishDef;
        const multiplier = upgradeManager.getCookTimeMultiplier(id);
        const effectiveCookTime = dish.cookTime * multiplier;
        const effectiveOvercook = dish.overcookTime * multiplier;

        // Periodic sounds & particles while cooking
        station.sizzleTimer = (station.sizzleTimer || 0) + dt;
        if (station.sizzleTimer >= 0.45) {
          station.sizzleTimer = 0;
          this.emitCookingParticles(station);
        }

        // Determine if ready
        if (station.elapsed >= effectiveCookTime && station.state === 'COOKING') {
          station.state = 'READY';
          const minPerf = dish.perfectWindow[0] * multiplier;
          const maxPerf = dish.perfectWindow[1] * multiplier;
          station.quality = (station.elapsed >= minPerf && station.elapsed <= maxPerf) ? 'PERFECT' : 'GOOD';
          audio.playBell();
          if (this.particles) {
            this.particles.spawnSparkles(station.def.x, station.def.y - 15, 8);
          }
        }
      } else if (station.state === 'READY') {
        station.elapsed += dt;
        const dish = station.dishDef;
        const multiplier = upgradeManager.getCookTimeMultiplier(id);
        const effectiveOvercook = dish.overcookTime * multiplier;

        // Check if overcooked
        if (station.elapsed >= effectiveOvercook) {
          station.state = 'OVERCOOKED';
          station.quality = 'OVERCOOKED';
          audio.playBurn();
          if (this.particles) {
            this.particles.spawnSmoke(station.def.x, station.def.y - 10, 10);
          }
        } else {
          // Still ready, evaluate current quality
          const minPerf = dish.perfectWindow[0] * multiplier;
          const maxPerf = dish.perfectWindow[1] * multiplier;
          if (station.elapsed >= minPerf && station.elapsed <= maxPerf) {
            station.quality = 'PERFECT';
          } else {
            station.quality = 'GOOD';
          }
        }
      }
    });
  }

  emitCookingParticles(station) {
    if (!this.particles) return;
    const x = station.def.x;
    const y = station.def.y;

    if (station.id === 'IDLI_STATION') {
      audio.playSteamHiss(0.3);
      this.particles.spawnSteam(x, y - 10, 3);
    } else if (station.id === 'DOSA_STATION' || station.id === 'EGG_DOSA_STATION') {
      audio.playSizzle(0.3);
      this.particles.spawnSizzle(x, y, 3);
    } else if (station.id === 'POORI_STATION') {
      audio.playPooriPuff();
      this.particles.spawnOilSplatter(x, y, 3);
    } else if (station.id === 'PONGAL_STATION') {
      audio.playSteamHiss(0.2);
      this.particles.spawnSteam(x, y - 12, 2);
    } else if (station.id === 'CHAPATI_STATION') {
      audio.playSizzle(0.25);
      this.particles.spawnSteam(x, y - 8, 2);
    }
  }

  /**
   * Chef interacts with a station
   */
  interactStation(stationId, chefHeldItem) {
    // 1. Serving Counter Interaction
    if (stationId === 'SERVING_COUNTER') {
      if (chefHeldItem) {
        if (this.servingCounter.length < this.maxServingSlots) {
          this.servingCounter.push(chefHeldItem);
          audio.playClick();
          return { action: 'PLACED_ON_COUNTER', remainingItem: null };
        } else {
          return { action: 'COUNTER_FULL', remainingItem: chefHeldItem };
        }
      }
      return { action: 'NOTHING_TO_PLACE', remainingItem: chefHeldItem };
    }

    if (stationId === 'INGREDIENT_COUNTER') {
      if (chefHeldItem) {
        audio.playClick();
        return { action: 'DISCARDED_DISH', remainingItem: null };
      }
      return { action: 'NONE', remainingItem: chefHeldItem };
    }

    // 2. Cooking Station Interaction
    const station = this.stations[stationId];
    if (!station) return { action: 'NONE', remainingItem: chefHeldItem };

    if (station.state === 'IDLE') {
      if (chefHeldItem) {
        return { action: 'HANDS_FULL', remainingItem: chefHeldItem };
      }
      if (this.allowedDishIds && !this.allowedDishIds.includes(station.dishDef.id)) {
        return { action: 'DISH_LOCKED', remainingItem: chefHeldItem };
      }
      // Start cooking
      station.state = 'COOKING';
      station.elapsed = 0;
      station.quality = null;
      station.dishReady = null;

      if (station.id === 'IDLI_STATION') audio.playSteamHiss(0.5);
      else if (station.id === 'POORI_STATION') audio.playPooriPuff();
      else audio.playSizzle(0.5);

      return { action: 'STARTED_COOKING', remainingItem: chefHeldItem };
    }

    if (station.state === 'READY' || station.state === 'OVERCOOKED') {
      // Collect dish
      if (chefHeldItem) {
        return { action: 'HANDS_FULL', remainingItem: chefHeldItem };
      }

      const quality = station.quality || (station.state === 'OVERCOOKED' ? 'OVERCOOKED' : 'GOOD');
      const preparedDish = {
        dishId: station.dishDef.id,
        dishName: station.dishDef.name,
        tamilName: station.dishDef.tamilName,
        price: station.dishDef.price,
        quality: quality,
        icon: station.dishDef.icon,
        color: station.dishDef.color,
        cookedAt: Date.now()
      };

      // Reset station
      station.state = 'IDLE';
      station.elapsed = 0;
      station.quality = null;

      audio.playClick();
      return { action: 'COLLECTED_DISH', remainingItem: preparedDish };
    }

    return { action: 'STILL_COOKING', remainingItem: chefHeldItem };
  }

  /**
   * Waiter picks up a matching prepared dish from the serving counter
   */
  pickupDishForOrder(orderedDishId) {
    const idx = this.servingCounter.findIndex(d => d.dishId === orderedDishId);
    if (idx !== -1) {
      const dish = this.servingCounter.splice(idx, 1)[0];
      return dish;
    }
    return null;
  }

  isDishReadyOnCounter(orderedDishId) {
    return this.servingCounter.some(d => d.dishId === orderedDishId);
  }

  getStationProgress(stationId) {
    const station = this.stations[stationId];
    if (!station || station.state === 'IDLE') return 0;
    const mult = upgradeManager.getCookTimeMultiplier(stationId);
    const cookTime = station.dishDef.cookTime * mult;
    return Math.min(1.0, station.elapsed / cookTime);
  }
}
