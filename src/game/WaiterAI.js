/**
 * KANA - Tamil Nadu Idly Kadai
 * Waiter AI - Autonomous Mischievous Waiter (Shinchan Energetic Personality)
 * Full autonomous state machine for order taking and food delivery.
 */

import { upgradeManager } from './UpgradeManager.js';
import { audio } from './AudioManager.js';

export class WaiterAI {
  constructor(restaurantMap, customerManager, orderManager, cookingManager, particleSystem) {
    this.map = restaurantMap;
    this.customers = customerManager;
    this.orders = orderManager;
    this.cooking = cookingManager;
    this.particles = particleSystem;

    this.baseSpeed = 120;
    this.x = 780;
    this.y = 260;
    this.targetX = 780;
    this.targetY = 260;

    this.state = 'IDLE';
    this.stateTimer = 0;
    this.currentCustomer = null;
    this.carryingDish = null;
    this.carryingTicket = false;
    this.facing = 'left';
    this.animTime = 0;
  }

  reset() {
    this.x = 780;
    this.y = 260;
    this.targetX = 780;
    this.targetY = 260;
    this.state = 'IDLE';
    this.stateTimer = 0;
    this.currentCustomer = null;
    this.carryingDish = null;
    this.carryingTicket = false;
  }

  update(dt) {
    this.animTime += dt;
    const speed = this.baseSpeed * upgradeManager.getWaiterSpeedMultiplier();

    switch (this.state) {
      case 'IDLE': {
        this.stateTimer += dt;
        // 1. Check if there is ready food on serving counter that matches an active customer
        const readyMatch = this.findMatchingReadyDish();
        if (readyMatch) {
          this.currentCustomer = readyMatch.customer;
          this.targetDishId = readyMatch.dishId;
          this.state = 'APPROACH_SERVING_COUNTER';
          const pickup = this.map.getServingPickupSpot();
          this.targetX = pickup.x;
          this.targetY = pickup.y;
          break;
        }

        // 2. Check if any seated customer is waiting to place an order
        const customerToOrder = this.findCustomerWaitingToOrder();
        if (customerToOrder) {
          this.currentCustomer = customerToOrder;
          this.state = 'APPROACH_CUSTOMER_ORDER';
          this.targetX = customerToOrder.x + 24;
          this.targetY = customerToOrder.y;
          break;
        }

        // Otherwise chill at idle waiting spot
        const idleSpot = this.map.getWaiterIdleSpot();
        if (Math.hypot(this.x - idleSpot.x, this.y - idleSpot.y) > 10) {
          this.moveTo(idleSpot.x, idleSpot.y, speed, dt);
        }
        break;
      }

      case 'APPROACH_CUSTOMER_ORDER': {
        if (!this.currentCustomer || this.currentCustomer.state !== 'WAITING_FOR_ORDER') {
          this.state = 'IDLE';
          this.currentCustomer = null;
          break;
        }

        const reached = this.moveTo(this.currentCustomer.x + 24, this.currentCustomer.y, speed, dt);
        if (reached) {
          this.state = 'TAKE_ORDER';
          this.stateTimer = 0.5; // Quick order writing scribble animation
          audio.playClick();
        }
        break;
      }

      case 'TAKE_ORDER': {
        this.stateTimer -= dt;
        if (this.stateTimer <= 0) {
          if (this.currentCustomer && this.currentCustomer.state === 'WAITING_FOR_ORDER') {
            // Customer places order
            const order = this.orders.createOrder(
              this.currentCustomer,
              this.currentCustomer.chosenDishId,
              this.currentCustomer.maxPatience
            );
            this.currentCustomer.order = order;
            this.currentCustomer.state = 'WAITING_FOR_FOOD';
            this.carryingTicket = true;

            // Waiter runs to kitchen ticket desk
            this.state = 'WALK_TO_KITCHEN_TICKET';
            const pickup = this.map.getServingPickupSpot();
            this.targetX = pickup.x;
            this.targetY = pickup.y;
          } else {
            this.state = 'IDLE';
            this.currentCustomer = null;
          }
        }
        break;
      }

      case 'WALK_TO_KITCHEN_TICKET': {
        const pickup = this.map.getServingPickupSpot();
        const reached = this.moveTo(pickup.x, pickup.y, speed, dt);
        if (reached) {
          this.carryingTicket = false;
          if (this.particles) {
            this.particles.spawnSparkles(this.x, this.y - 15, 4);
          }
          // After delivering ticket, return to IDLE to check for dishes or other customers
          this.state = 'IDLE';
          this.currentCustomer = null;
        }
        break;
      }

      case 'APPROACH_SERVING_COUNTER': {
        const pickup = this.map.getServingPickupSpot();
        const reached = this.moveTo(pickup.x, pickup.y, speed, dt);
        if (reached) {
          // Attempt to pick up the dish
          const dish = this.cooking.pickupDishForOrder(this.targetDishId);
          if (dish) {
            this.carryingDish = dish;
            if (this.currentCustomer && this.currentCustomer.order) {
              this.orders.markDelivering(this.currentCustomer.order.id);
            }
            this.state = 'WALK_TO_CUSTOMER_DELIVERY';
            if (this.currentCustomer) {
              this.targetX = this.currentCustomer.x + 24;
              this.targetY = this.currentCustomer.y;
            } else {
              this.state = 'IDLE';
            }
          } else {
            // Dish was already taken or missing
            this.state = 'IDLE';
            this.currentCustomer = null;
          }
        }
        break;
      }

      case 'WALK_TO_CUSTOMER_DELIVERY': {
        if (!this.currentCustomer || this.currentCustomer.state !== 'WAITING_FOR_FOOD') {
          // Customer left or cancelled while waiter was walking
          // Put dish back or discard
          if (this.carryingDish) {
            this.cooking.servingCounter.push(this.carryingDish);
            this.carryingDish = null;
          }
          this.state = 'IDLE';
          this.currentCustomer = null;
          break;
        }

        const reached = this.moveTo(this.currentCustomer.x + 24, this.currentCustomer.y, speed, dt);
        if (reached) {
          // Serve food to customer
          this.state = 'SERVE_FOOD';
          this.stateTimer = 0.3;
        }
        break;
      }

      case 'SERVE_FOOD': {
        this.stateTimer -= dt;
        if (this.stateTimer <= 0) {
          if (this.currentCustomer && this.carryingDish) {
            this.customers.deliverFoodToCustomer(this.currentCustomer.id, this.carryingDish);
            this.carryingDish = null;
          }
          this.currentCustomer = null;
          this.state = 'IDLE';
        }
        break;
      }
    }
  }

  moveTo(targetX, targetY, speed, dt) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);
    const step = speed * dt;

    if (dist <= step) {
      this.x = targetX;
      this.y = targetY;
      return true;
    }

    this.x += (dx / dist) * step;
    this.y += (dy / dist) * step;
    this.facing = dx < 0 ? 'left' : 'right';
    return false;
  }

  findCustomerWaitingToOrder() {
    return this.customers.customers.find(c => c.state === 'WAITING_FOR_ORDER');
  }

  findMatchingReadyDish() {
    for (const dish of this.cooking.servingCounter) {
      const match = this.customers.customers.find(
        c => c.state === 'WAITING_FOR_FOOD' && c.chosenDishId === dish.dishId
      );
      if (match) {
        return { customer: match, dishId: dish.dishId };
      }
    }
    return null;
  }
}
