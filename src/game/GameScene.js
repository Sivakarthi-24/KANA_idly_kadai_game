/**
 * KANA - Tamil Nadu Idly Kadai
 * GameScene - Core Game Loop, State Orchestration, Day Timer & Level Transitions
 */

import { DAYS } from './GameConfig.js';
import { RestaurantMap } from './RestaurantMap.js';
import { PlayerController } from './PlayerController.js';
import { WaiterAI } from './WaiterAI.js';
import { CustomerManager } from './CustomerManager.js';
import { CookingManager } from './CookingManager.js';
import { OrderManager } from './OrderManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { SpriteRenderer } from './SpriteRenderer.js';
import { economyManager } from './EconomyManager.js';
import { saveManager } from './SaveManager.js';
import { audio } from './AudioManager.js';

export class GameScene {
  constructor(canvas, uiCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ui = uiCallbacks; // { onHUDUpdate, onDayComplete, onGameOver, onPromptUpdate }

    this.particles = new ParticleSystem();
    this.map = new RestaurantMap();
    this.cooking = new CookingManager(this.particles);
    this.economy = economyManager;
    this.orders = new OrderManager(this.economy);
    this.customers = new CustomerManager(this.map, this.orders, this.economy, this.particles);
    this.waiter = new WaiterAI(this.map, this.customers, this.orders, this.cooking, this.particles);
    this.player = new PlayerController(this.map, this.cooking);
    this.renderer = new SpriteRenderer(this.canvas, this.ctx);

    this.currentDayNum = 1;
    this.currentDayConfig = DAYS[0];
    this.dayDuration = 90;
    this.dayTimer = 90;

    this.isRunning = false;
    this.isPaused = false;
    this.isFinishing = false;
    this.lastFrameTime = performance.now();
    this.animationFrameId = null;
    this.loop = this.loop.bind(this);
  }

  startDay(dayNum) {
    const clamped = Math.max(1, Math.min(5, dayNum || 1));
    this.currentDayNum = clamped;
    const config = DAYS.find(d => d.day === clamped) || DAYS[0];
    this.currentDayConfig = config;
    this.dayDuration = config.dayDuration;
    this.dayTimer = config.dayDuration;
    this.isFinishing = false;

    // Reset systems
    this.particles.reset();
    this.map.updateObstacles();
    this.cooking.reset();
    this.cooking.setAllowedDishes(config.dishesAllowed);
    this.economy.resetDayStats();
    this.orders.reset();
    this.customers.reset();
    this.waiter.reset();
    this.player.reset();

    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();

    // Start requestAnimationFrame loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  restartDay() {
    this.startDay(this.currentDayNum);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.lastFrameTime = performance.now();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1); // Clamp delta time to 100ms
    this.lastFrameTime = currentTime;

    if (!this.isPaused) {
      this.update(dt);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  update(dt) {
    // 1. Day Timer countdown
    this.dayTimer -= dt;

    // 2. Update Game Entities
    this.player.update(dt);
    this.cooking.update(dt);
    this.customers.update(dt, this.currentDayConfig, this.dayTimer > 0);
    this.waiter.update(dt);
    this.orders.update(dt, (expiredOrder) => {
      // Order patience ran out
      const customer = this.customers.customers.find(c => c.id === expiredOrder.customerId);
      if (customer) {
        this.customers.customerGiveUp(customer);
      }
    });
    this.particles.update(dt);

    // 3. Update HUD and UI callbacks
    if (this.ui && this.ui.onHUDUpdate) {
      this.ui.onHUDUpdate({
        cashBalance: saveManager.get('cashBalance'),
        dayRevenue: this.economy.dayStats.foodRevenue + this.economy.dayStats.qualityBonuses + this.economy.dayStats.speedBonuses,
        dayTips: this.economy.dayStats.tips,
        totalDayEarned: this.economy.dayStats.totalEarned,
        targetRevenue: this.currentDayConfig.targetRevenue,
        currentDay: this.currentDayNum,
        dayTitle: this.currentDayConfig.title,
        tamilTitle: this.currentDayConfig.tamilTitle,
        timeRemaining: Math.max(0, Math.ceil(this.dayTimer)),
        activeOrders: this.orders.getActiveOrders(),
        heldDish: this.player.heldDish,
        interactionPrompt: this.player.currentPrompt
      });
    }

    // 4. Check for Day End condition
    if (this.dayTimer <= 0 && !this.isFinishing) {
      // Stop customer arrivals and allow active seated eaters to finish or wrap day
      const activeEaters = this.customers.customers.filter(c => c.state === 'EATING' || c.state === 'WAITING_FOR_FOOD');
      if (activeEaters.length === 0 || this.dayTimer <= -10) {
        this.finishDay();
      }
    }
  }

  render() {
    this.renderer.render({
      map: this.map,
      player: this.player,
      waiter: this.waiter,
      customers: this.customers,
      cooking: this.cooking,
      particles: this.particles,
      dayConfig: this.currentDayConfig,
      dayTimer: this.dayTimer
    });
  }

  finishDay() {
    if (this.isFinishing) return;
    this.isFinishing = true;
    this.stop();
    const stats = this.economy.getDayStats();
    const target = this.currentDayConfig.targetRevenue;
    const earned = stats.totalEarned;
    const isSuccess = earned >= target;

    // Compute star rating
    let stars = 0;
    if (isSuccess) {
      const thresholds = this.currentDayConfig.starThresholds;
      if (earned >= thresholds[2]) stars = 3;
      else if (earned >= thresholds[1]) stars = 2;
      else stars = 1;

      // Record progress
      saveManager.recordDayCompletion(
        this.currentDayNum,
        stars,
        stats.foodRevenue,
        stats.tips,
        stats.ordersServed,
        stats.perfectCount
      );

      audio.playVictoryJingle();
    } else {
      audio.playCustomerAngry();
    }

    if (this.ui && this.ui.onDayComplete) {
      this.ui.onDayComplete({
        dayNum: this.currentDayNum,
        isSuccess,
        stars,
        stats,
        target,
        nextDayUnlocked: isSuccess && this.currentDayNum < 5
      });
    }
  }

  handleKeyDown(code) {
    this.player.setKey(code, true);

    if (code === 'KeyE' || code === 'Space') {
      this.player.interact();
    }
  }

  handleKeyUp(code) {
    this.player.setKey(code, false);
  }
}
