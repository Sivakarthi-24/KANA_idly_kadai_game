/**
 * KANA - Tamil Nadu Idly Kadai
 * Customer Manager - Customer Spawning, Seating, Ordering, Patience, and Eating
 */

import { CUSTOMER_ARCHETYPES } from './GameConfig.js';
import { upgradeManager } from './UpgradeManager.js';
import { audio } from './AudioManager.js';

let customerCounter = 1;

export class CustomerManager {
  constructor(restaurantMap, orderManager, economyManager, particleSystem) {
    this.map = restaurantMap;
    this.orderManager = orderManager;
    this.economy = economyManager;
    this.particles = particleSystem;

    this.customers = [];
    this.spawnTimer = 0;
    this.nextSpawnInterval = 4.0;
  }

  reset() {
    this.customers = [];
    this.spawnTimer = 0;
    customerCounter = 1;
  }

  update(dt, currentDayConfig, spawnEnabled = true) {
    if (!currentDayConfig) return;

    // 1. Spawning customers
    this.spawnTimer += dt;
    const maxCustomers = currentDayConfig.maxSimultaneousCustomers;
    const activeCount = this.customers.filter(c => c.state !== 'LEAVING_OUT').length;

    if (spawnEnabled && this.spawnTimer >= this.nextSpawnInterval && activeCount < maxCustomers) {
      this.spawnTimer = 0;
      const minI = currentDayConfig.customerSpawnMinInterval;
      const maxI = currentDayConfig.customerSpawnMaxInterval;
      this.nextSpawnInterval = minI + Math.random() * (maxI - minI);

      this.trySpawnCustomer(currentDayConfig);
    }

    // 2. Update existing customers
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const customer = this.customers[i];
      this.updateCustomer(customer, dt, currentDayConfig);

      // Clean up customers who exited the restaurant
      if (customer.state === 'LEAVING_OUT' && customer.x >= this.map.getEntrancePoint().x) {
        this.customers.splice(i, 1);
      }
    }
  }

  trySpawnCustomer(dayConfig) {
    const seatInfo = this.map.getAvailableTableSeat(this.customers);
    if (!seatInfo) return; // All seats occupied

    // Pick random archetype
    const archetype = CUSTOMER_ARCHETYPES[Math.floor(Math.random() * CUSTOMER_ARCHETYPES.length)];

    // Filter available dishes for this day
    const validDishes = archetype.preferredDishes.filter(d => dayConfig.dishesAllowed.includes(d));
    const chosenDishId = validDishes.length > 0 
      ? validDishes[Math.floor(Math.random() * validDishes.length)]
      : dayConfig.dishesAllowed[Math.floor(Math.random() * dayConfig.dishesAllowed.length)];

    const entrance = this.map.getEntrancePoint();
    const patienceMult = upgradeManager.getPatienceMultiplier() * archetype.patienceMod;
    const basePatience = dayConfig.customerPatience * patienceMult;

    const customer = {
      id: customerCounter++,
      archetype,
      x: entrance.x,
      y: entrance.y,
      targetX: seatInfo.seat.x,
      targetY: seatInfo.seat.y,
      table: seatInfo.table,
      seat: seatInfo.seat,
      state: 'WALKING_TO_SEAT', // WALKING_TO_SEAT, THINKING, WAITING_FOR_ORDER, WAITING_FOR_FOOD, EATING, READY_TO_PAY, LEAVING, LEAVING_OUT
      chosenDishId,
      order: null,
      maxPatience: basePatience,
      patience: basePatience,
      thinkTimer: 1.2,
      eatTimer: 4.0,
      deliveredDish: null,
      facing: 'left',
      animTime: 0
    };

    this.customers.push(customer);
  }

  updateCustomer(c, dt, dayConfig) {
    c.animTime += dt;

    switch (c.state) {
      case 'WALKING_TO_SEAT': {
        const dx = c.targetX - c.x;
        const dy = c.targetY - c.y;
        const dist = Math.hypot(dx, dy);
        const step = c.archetype.speed * dt;

        if (dist <= step) {
          c.x = c.targetX;
          c.y = c.targetY;
          c.state = 'THINKING';
          c.thinkTimer = 1.2;
        } else {
          c.x += (dx / dist) * step;
          c.y += (dy / dist) * step;
          c.facing = dx < 0 ? 'left' : 'right';
        }
        break;
      }

      case 'THINKING': {
        c.thinkTimer -= dt;
        if (c.thinkTimer <= 0) {
          c.state = 'WAITING_FOR_ORDER';
          // Now ready for waiter to take order
        }
        break;
      }

      case 'WAITING_FOR_ORDER': {
        // Customer is waiting for waiter to collect order
        c.patience -= dt;
        if (c.patience <= 0) {
          this.customerGiveUp(c);
        }
        break;
      }

      case 'WAITING_FOR_FOOD': {
        // Customer waiting for kitchen/waiter to deliver
        c.patience -= dt;
        if (c.patience <= 0) {
          this.customerGiveUp(c);
        }
        break;
      }

      case 'EATING': {
        c.eatTimer -= dt;
        if (c.eatTimer <= 0) {
          // Finished meal! Leave payment
          c.state = 'LEAVING';
          const entrance = this.map.getEntrancePoint();
          c.targetX = entrance.x;
          c.targetY = entrance.y;

          // Process payout
          if (c.order) {
            const patienceRatio = Math.max(0, c.patience / c.maxPatience);
            const quality = c.deliveredDish ? c.deliveredDish.quality : 'GOOD';
            const transaction = this.economy.processCompletedOrder(c.order, quality, patienceRatio);
            this.orderManager.markPaid(c.order.id);

            // Floating rewards particles
            if (this.particles && transaction) {
              this.particles.spawnFloatingText(
                c.x, c.y - 30,
                `+₹${transaction.totalEarned} (${quality}!)`,
                '#10b981'
              );
              this.particles.spawnHearts(c.x, c.y - 20, 5);
            }
          }
        }
        break;
      }

      case 'LEAVING': {
        // Walking out to entrance
        const dx = c.targetX - c.x;
        const dy = c.targetY - c.y;
        const dist = Math.hypot(dx, dy);
        const step = c.archetype.speed * dt;

        if (dist <= step) {
          c.x = c.targetX;
          c.y = c.targetY;
          c.state = 'LEAVING_OUT';
        } else {
          c.x += (dx / dist) * step;
          c.y += (dy / dist) * step;
          c.facing = dx < 0 ? 'left' : 'right';
        }
        break;
      }
    }
  }

  customerGiveUp(c) {
    if (c.state === 'LEAVING' || c.state === 'LEAVING_OUT') return;
    c.state = 'LEAVING';
    const entrance = this.map.getEntrancePoint();
    c.targetX = entrance.x;
    c.targetY = entrance.y;

    if (c.order) {
      c.order.status = 'CANCELLED';
      this.economy.recordCancelledOrder(c.order);
    }

    audio.playCustomerAngry();
    if (this.particles) {
      this.particles.spawnFloatingText(c.x, c.y - 25, 'Cancelled! 😡', '#ef4444');
    }
  }

  /**
   * Waiter delivers food to seated customer
   */
  deliverFoodToCustomer(customerId, preparedDish) {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer || customer.state !== 'WAITING_FOR_FOOD') return false;

    customer.deliveredDish = preparedDish;
    customer.state = 'EATING';
    customer.eatTimer = 3.8;

    if (customer.order) {
      this.orderManager.markServed(customer.order.id, preparedDish.quality);
    }

    audio.playCustomerHappy();
    if (this.particles) {
      this.particles.spawnSparkles(customer.x, customer.y - 15, 6);
    }

    return true;
  }
}
