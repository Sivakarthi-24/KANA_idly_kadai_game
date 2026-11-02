/**
 * KANA - Tamil Nadu Idly Kadai
 * Player Controller - Chief Cook Movement, Animations, and Kitchen Station Interactions
 */

export class PlayerController {
  constructor(restaurantMap, cookingManager) {
    this.map = restaurantMap;
    this.cooking = cookingManager;

    // Initial position in kitchen corridor
    this.x = 420;
    this.y = 175;
    this.radius = 16;
    this.speed = 190; // Pixels per second

    // Held dish in hands
    this.heldDish = null;

    // Movement state
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    this.virtualInput = { x: 0, y: 0 }; // For mobile touch joystick
    this.facing = 'down'; // up, down, left, right
    this.isMoving = false;
    this.animTime = 0;

    // Interaction prompt
    this.currentPrompt = null;
    this.nearbyStation = null;
  }

  reset() {
    this.x = 420;
    this.y = 175;
    this.heldDish = null;
    this.facing = 'down';
    this.isMoving = false;
    this.animTime = 0;
  }

  setKey(key, pressed) {
    if (key === 'KeyW' || key === 'ArrowUp') this.keys.up = pressed;
    if (key === 'KeyS' || key === 'ArrowDown') this.keys.down = pressed;
    if (key === 'KeyA' || key === 'ArrowLeft') this.keys.left = pressed;
    if (key === 'KeyD' || key === 'ArrowRight') this.keys.right = pressed;
  }

  setVirtualInput(vx, vy) {
    this.virtualInput.x = vx;
    this.virtualInput.y = vy;
  }

  update(dt) {
    // Determine movement direction vector
    let dx = 0;
    let dy = 0;

    if (this.keys.left) dx -= 1;
    if (this.keys.right) dx += 1;
    if (this.keys.up) dy -= 1;
    if (this.keys.down) dy += 1;

    // Blend in mobile virtual joystick if active
    if (Math.abs(this.virtualInput.x) > 0.1 || Math.abs(this.virtualInput.y) > 0.1) {
      dx = this.virtualInput.x;
      dy = this.virtualInput.y;
    }

    const mag = Math.hypot(dx, dy);
    this.isMoving = mag > 0.05;

    if (this.isMoving) {
      this.animTime += dt;
      const normX = dx / mag;
      const normY = dy / mag;

      // Update facing direction
      if (Math.abs(normX) > Math.abs(normY)) {
        this.facing = normX > 0 ? 'right' : 'left';
      } else {
        this.facing = normY > 0 ? 'down' : 'up';
      }

      // Frame-rate independent collision sliding movement
      const step = this.speed * dt;
      const targetX = this.x + normX * step;
      const targetY = this.y + normY * step;

      // Try full movement first
      if (!this.map.checkCollision(targetX, targetY, this.radius)) {
        this.x = targetX;
        this.y = targetY;
      } else {
        // Try horizontal sliding
        if (!this.map.checkCollision(targetX, this.y, this.radius)) {
          this.x = targetX;
        }
        // Try vertical sliding
        if (!this.map.checkCollision(this.x, targetY, this.radius)) {
          this.y = targetY;
        }
      }
    } else {
      this.animTime = 0;
    }

    // Check nearest interactive station
    this.nearbyStation = this.map.getNearestStation(this.x, this.y, 65);
    this.updatePrompt();
  }

  updatePrompt() {
    if (!this.nearbyStation) {
      this.currentPrompt = null;
      return;
    }

    const s = this.nearbyStation;
    if (s.id === 'SERVING_COUNTER') {
      if (this.heldDish) {
        this.currentPrompt = `Press [E] to Place ${this.heldDish.dishName} on Counter`;
      } else {
        this.currentPrompt = `Serving Counter (${this.cooking.servingCounter.length}/4 Dishes)`;
      }
      return;
    }

    if (s.id === 'INGREDIENT_COUNTER') {
      this.currentPrompt = this.heldDish
        ? `Press [E] to Discard ${this.heldDish.dishName}`
        : 'Spices & Chutneys Counter';
      return;
    }

    // Cooking Station
    const stState = this.cooking.stations[s.id];
    if (!stState) {
      this.currentPrompt = null;
      return;
    }

    if (stState.state === 'IDLE') {
      if (this.cooking.allowedDishIds && !this.cooking.allowedDishIds.includes(stState.dishDef.id)) {
        this.currentPrompt = `${stState.dishDef.name} unlocks on a later day`;
      } else if (this.heldDish) {
        this.currentPrompt = 'Hands full — place dish on the Serving Counter first';
      } else {
        this.currentPrompt = `Press [E] to Cook ${stState.dishDef.name} (₹${stState.dishDef.price})`;
      }
    } else if (stState.state === 'COOKING') {
      this.currentPrompt = `Cooking ${stState.dishDef.name}...`;
    } else if (stState.state === 'READY') {
      const q = stState.quality || 'READY';
      this.currentPrompt = `Press [E] to Collect ${stState.dishDef.name} [${q}]!`;
    } else if (stState.state === 'OVERCOOKED') {
      this.currentPrompt = `Press [E] to Clear ${stState.dishDef.name} [OVERCOOKED]`;
    }
  }

  interact() {
    if (!this.nearbyStation) return null;

    const result = this.cooking.interactStation(this.nearbyStation.id, this.heldDish);
    if (result.action === 'COLLECTED_DISH') {
      this.heldDish = result.remainingItem;
    } else if (result.action === 'PLACED_ON_COUNTER' || result.action === 'DISCARDED_DISH') {
      this.heldDish = null;
    }
    this.updatePrompt();
    return result;
  }
}
