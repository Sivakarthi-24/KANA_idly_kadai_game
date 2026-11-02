/**
 * KANA - Tamil Nadu Idly Kadai
 * Restaurant Map Layout, Collisions, and Spatial Coordinates
 */

import { STATIONS, TABLES } from './GameConfig.js';
import { upgradeManager } from './UpgradeManager.js';

export class RestaurantMap {
  constructor() {
    this.width = 920;
    this.height = 580;

    // Station definitions
    this.stations = STATIONS;

    // Pass-through gap between kitchen and dining area
    // Chef can walk between kitchen and dining area via gap at x: 740 - 810 or x: 70 - 130
    this.updateObstacles();
  }

  updateObstacles() {
    const extraTables = upgradeManager.getExtraTablesUnlocked();

    // Active tables based on upgrades
    this.activeTables = TABLES.filter(t => !t.requiresUpgrade || 
      (t.requiresUpgrade === 'EXTRA_TABLE' && extraTables >= 1) ||
      (t.requiresUpgrade === 'EXTRA_TABLE_2' && extraTables >= 2)
    );

    // Bounding boxes for collision
    this.obstacles = [
      // Outer boundaries
      { x: 0, y: 0, width: this.width, height: 75, name: 'TOP_WALL' },
      { x: 0, y: this.height - 15, width: this.width, height: 15, name: 'BOTTOM_WALL' },
      { x: 0, y: 0, width: 25, height: this.height, name: 'LEFT_WALL' },
      { x: this.width - 25, y: 0, width: 25, height: 420, name: 'RIGHT_WALL_TOP' },
      // Entrance is between y: 420 and y: 550
      { x: this.width - 25, y: 550, width: 25, height: 30, name: 'RIGHT_WALL_BOTTOM' },

      // Cooking Top Counter (x: 100 to 760, y: 80 to 140)
      { x: 100, y: 75, width: 660, height: 60, name: 'COOKING_COUNTER' },

      // Serving Counter divider: x: 230 to 720, y: 220 to 248
      { x: 230, y: 220, width: 490, height: 28, name: 'SERVING_COUNTER' },

      // Side Ingredient Prep counter: x: 40 to 140, y: 220 to 248
      { x: 30, y: 220, width: 110, height: 28, name: 'PREP_COUNTER' },

      // Cash Register Counter near entrance: x: 800 to 880, y: 320 to 370
      { x: 800, y: 320, width: 75, height: 45, name: 'CASH_COUNTER' },

      // Dining Tables
      ...this.activeTables.map(t => ({
        x: t.x - t.width / 2,
        y: t.y - t.height / 2,
        width: t.width,
        height: t.height,
        name: `TABLE_${t.id}`
      }))
    ];
  }

  /**
   * Circle-to-AABB collision check
   */
  checkCollision(x, y, radius = 16) {
    for (const obs of this.obstacles) {
      // Find closest point on obstacle box to circle center
      const closestX = Math.max(obs.x, Math.min(x, obs.x + obs.width));
      const closestY = Math.max(obs.y, Math.min(y, obs.y + obs.height));

      const dx = x - closestX;
      const dy = y - closestY;
      const distSq = dx * dx + dy * dy;

      if (distSq < radius * radius) {
        return true; // Collision detected
      }
    }
    return false;
  }

  /**
   * Get nearest interactive station to coordinates (x, y)
   */
  getNearestStation(x, y, maxDist = 65) {
    let nearest = null;
    let minDist = maxDist;

    for (const key of Object.keys(this.stations)) {
      const station = this.stations[key];
      const dx = x - station.x;
      const dy = y - station.y;
      const dist = Math.hypot(dx, dy);

      if (dist < station.interactRadius && dist < minDist) {
        minDist = dist;
        nearest = station;
      }
    }

    return nearest;
  }

  /**
   * Get an available table seat for arriving customer
   */
  getAvailableTableSeat(seatedCustomers) {
    this.updateObstacles();
    const occupiedSeats = new Set();
    seatedCustomers.forEach(c => {
      if (c.seat) occupiedSeats.add(`${c.seat.x},${c.seat.y}`);
    });

    for (const table of this.activeTables) {
      for (const seat of table.seats) {
        const key = `${seat.x},${seat.y}`;
        if (!occupiedSeats.has(key)) {
          return { table, seat };
        }
      }
    }
    return null; // Kadai is full
  }

  getEntrancePoint() {
    return { x: 885, y: 490 };
  }

  getWaiterIdleSpot() {
    return { x: 780, y: 260 };
  }

  getServingPickupSpot() {
    return { x: 480, y: 265 }; // Waiter stands on the dining side of serving counter
  }
}
