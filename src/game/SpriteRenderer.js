/**
 * KANA - Tamil Nadu Idly Kadai
 * Sprite & Scene Canvas Renderer
 * High-quality procedural cartoon rendering for authentic South Indian restaurant atmosphere.
 */

import { assets } from './AssetManager.js';

function ensureRoundRect() {
  if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      const radius = typeof r === 'number' ? r : 6;
      this.moveTo(x + radius, y);
      this.arcTo(x + w, y, x + w, y + h, radius);
      this.arcTo(x + w, y + h, x, y + h, radius);
      this.arcTo(x, y + h, x, y, radius);
      this.arcTo(x, y, x + w, y, radius);
      this.closePath();
    };
  }
}

export class SpriteRenderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    ensureRoundRect();
  }

  render(sceneData) {
    const {
      map,
      player,
      waiter,
      customers,
      cooking,
      particles,
      dayConfig,
      dayTimer
    } = sceneData;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Restaurant Floor & Walls
    this.drawFloorAndWalls(ctx, map);

    // 2. Tamil Nadu Kadai Signboard & Garlands
    this.drawSignboardAndDecor(ctx, map, dayConfig);

    // 3. Furniture & Counters
    this.drawCounters(ctx, map);
    this.drawDiningTables(ctx, map);

    // 4. Cooking Stations with Animations
    this.drawCookingStations(ctx, cooking, player);

    // 5. Serving Counter with Prepared Dishes
    this.drawServingCounterDishes(ctx, cooking);

    // 6. Customers (Seated or walking)
    this.drawCustomers(ctx, customers);

    // 7. Autonomous Waiter (Shinchan energy)
    this.drawWaiter(ctx, waiter);

    // 8. Chief Cook (Player)
    this.drawChef(ctx, player);

    // 9. Particle Effects (Steam, sizzle, stars, floating rupees)
    particles.render(ctx);

    // 10. Cooking Progress Rings and Station Labels
    this.drawStationProgressRings(ctx, cooking);
  }

  drawFloorAndWalls(ctx, map) {
    const w = map.width;
    const h = map.height;

    // Kitchen Floor: Cheerful warm cream/terracotta checkered tiles
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, 240);

    const tileSize = 28;
    for (let x = 0; x < w; x += tileSize) {
      for (let y = 75; y < 240; y += tileSize) {
        if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }

    // Dining Floor: Rich warm South Indian terracotta tiles
    const leaf = assets.get('bananaLeaf');
    if (leaf) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.drawImage(leaf, 0, 240, w, h - 240);
      ctx.restore();
      ctx.fillStyle = 'rgba(254, 243, 199, 0.55)';
      ctx.fillRect(0, 240, w, h - 240);
    } else {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 240, w, h - 240);
    }
    for (let x = 0; x < w; x += tileSize) {
      for (let y = 240; y < h; y += tileSize) {
        if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
          ctx.fillStyle = 'rgba(253, 230, 138, 0.45)';
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }

    // Wall borders
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 72, w, 4); // Kitchen top divider
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 238, w, 4); // Kitchen-Dining boundary floor line

    // Outer restaurant walls
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 24, h); // Left wall
    ctx.fillRect(w - 24, 0, 24, 420); // Right wall top
    ctx.fillRect(w - 24, 545, 24, h - 545); // Right wall bottom
    ctx.fillRect(0, h - 14, w, 14); // Bottom border

    // Entrance Welcome Mat
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(w - 60, 435, 36, 95);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px sans-serif';
    ctx.save();
    ctx.translate(w - 38, 485);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('வரவேற்கிறோம்', -35, 4);
    ctx.restore();
  }

  drawSignboardAndDecor(ctx, map, dayConfig) {
    const w = map.width;

    // Top Header Wall Background
    ctx.fillStyle = '#831843';
    ctx.fillRect(0, 0, w, 75);

    // Traditional South Indian Brass Lamps / Hanging Toran (Marigold & Mango Leaves)
    ctx.fillStyle = '#f59e0b';
    for (let x = 30; x < w - 30; x += 35) {
      // Mango leaf (green triangle)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x + 10, 24);
      ctx.lineTo(x - 10, 24);
      ctx.fill();

      // Marigold flower (photo when available)
      const marigold = assets.get('marigold');
      if (marigold) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, 26, 7, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(marigold, x - 7, 19, 14, 14);
        ctx.restore();
      } else {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(x, 26, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(x, 26, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Golden Signboard Board
    ctx.fillStyle = '#facc15';
    ctx.fillRect(w / 2 - 240, 10, 480, 52);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(w / 2 - 236, 14, 472, 44);

    // Authentic Signboard Text: "KANA" & "தமிழ்நாடு இட்லி கடை"
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px "Trebuchet MS", Arial, sans-serif';
    ctx.fillText('KANA – TAMIL NADU IDLY KADAI', w / 2, 34);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillText('தமிழ்நாடு இட்லி கடை • TRADITIONAL TIFFIN', w / 2, 51);
    ctx.textAlign = 'left';
  }

  drawCounters(ctx, map) {
    // 1. Top Cooking Counter (Stainless Steel with rounded edges)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(100, 75, 660, 60);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(100, 131, 660, 4);

    // 2. Prep & Ingredients Counter (Spices, Chutneys)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(30, 218, 110, 32);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(30, 246, 110, 4);

    // Three colorful chutney bowls on prep counter: White (Coconut), Red (Tomato/Kaara), Green (Mint/Coriander)
    const chutneys = ['#f8fafc', '#dc2626', '#16a34a'];
    chutneys.forEach((color, i) => {
      ctx.fillStyle = '#64748b'; // Stainless steel bowl
      ctx.beginPath();
      ctx.arc(55 + i * 28, 232, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = color; // Chutney inside
      ctx.beginPath();
      ctx.arc(55 + i * 28, 232, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Serving Counter (Pass-through counter between kitchen and dining)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(230, 218, 490, 32);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(230, 246, 490, 4);

    // Banana leaf runner along serving counter
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(240, 222, 470, 24);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(242, 224, 466, 2); // leaf rib

    // 4. Cash Register Counter near entrance
    ctx.fillStyle = '#78350f';
    ctx.fillRect(800, 320, 75, 45);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(805, 325, 65, 35);
    // Brass cash box / register
    ctx.fillStyle = '#d97706';
    ctx.fillRect(815, 328, 45, 26);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('₹ CASH', 818, 345);
  }

  drawDiningTables(ctx, map) {
    for (const table of map.activeTables) {
      const tx = table.x - table.width / 2;
      const ty = table.y - table.height / 2;

      // Table shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath();
      ctx.ellipse(table.x, table.y + 4, table.width / 2 + 6, table.height / 2 + 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wooden Table Top
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(tx, ty, table.width, table.height, 8);
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(tx + 3, ty + 3, table.width - 6, table.height - 6, 6);
      ctx.fill();

      // Fresh Green Banana Leaf placed on table
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.roundRect(table.x - 28, table.y - 14, 56, 28, 4);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(table.x - 28, table.y - 1, 56, 2); // Center vein

      // Stainless Steel Water Tumbler on Table
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(table.x + 32, table.y - 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(table.x + 32, table.y - 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Wooden Chairs for seats
      table.seats.forEach(seat => {
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(seat.x, seat.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(seat.x, seat.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  drawCookingStations(ctx, cooking, player) {
    const stations = cooking.stations;

    Object.keys(stations).forEach(id => {
      const st = stations[id];
      const def = st.def;
      const x = def.x;
      const y = def.y;

      // Pulse aura if player is nearby and can interact
      if (player.nearbyStation && player.nearbyStation.id === id) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 36, 0, Math.PI * 2);
        ctx.fill();
      }

      // Station Base (Stainless steel square with shadow)
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.roundRect(x - 26, y - 22, 52, 44, 6);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(x - 23, y - 19, 46, 38, 4);
      ctx.fill();

      // Specific Station Details
      switch (id) {
        case 'IDLI_STATION':
          this.drawIdliSteamer(ctx, x, y, st);
          break;
        case 'DOSA_STATION':
          this.drawDosaTawa(ctx, x, y, st, false);
          break;
        case 'POORI_STATION':
          this.drawPooriKadai(ctx, x, y, st);
          break;
        case 'PONGAL_STATION':
          this.drawPongalPot(ctx, x, y, st);
          break;
        case 'CHAPATI_STATION':
          this.drawChapatiTawa(ctx, x, y, st);
          break;
        case 'EGG_DOSA_STATION':
          this.drawDosaTawa(ctx, x, y, st, true);
          break;
      }
    });
  }

  drawIdliSteamer(ctx, x, y, st) {
    // Stainless Steel Steamer drum
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Idli plates inside
    if (st.state === 'READY' || st.state === 'OVERCOOKED') {
      // 3 fluffy white idlis visible!
      const idliColor = st.state === 'OVERCOOKED' ? '#78716c' : '#ffffff';
      [[-5, -4], [5, -4], [0, 6]].forEach(([ox, oy]) => {
        ctx.fillStyle = idliColor;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      // Steamer brass knob
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawDosaTawa(ctx, x, y, st, isEgg) {
    // Cast Iron Black Tawa
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, Math.PI * 2);
    ctx.fill();

    // Spatula handle
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 14, y - 2, 9, 4);

    if (st.state === 'COOKING') {
      // Batter spreading from cream to light brown
      const progress = cookingProgress(st);
      ctx.fillStyle = progress > 0.5 ? '#fde047' : '#f8fafc';
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.fill();

      if (isEgg && progress > 0.3) {
        // Yellow yolk in middle
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (st.state === 'READY') {
      // Crispy golden brown roast dosa folded
      ctx.fillStyle = isEgg ? '#f59e0b' : '#d97706';
      ctx.beginPath();
      ctx.ellipse(x, y, 14, 7, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.ellipse(x, y - 1, 11, 4, 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (st.state === 'OVERCOOKED') {
      ctx.fillStyle = '#451a03'; // Burnt dosa
      ctx.beginPath();
      ctx.ellipse(x, y, 14, 7, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPooriKadai(ctx, x, y, st) {
    // Deep iron kadai with golden oil
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d97706'; // Hot frying oil
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();

    if (st.state === 'COOKING') {
      const p = cookingProgress(st);
      const radius = 6 + p * 6; // Poori puffs up!
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (st.state === 'READY') {
      // Golden puffed balloon poori
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(x - 3, y - 3, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (st.state === 'OVERCOOKED') {
      ctx.fillStyle = '#78350f'; // Dark burnt poori
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPongalPot(ctx, x, y, st) {
    // Traditional Brass Uruli / Pot
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();

    if (st.state === 'COOKING' || st.state === 'READY') {
      // Creamy yellow ghee pongal
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();

      // Cashews & peppercorns
      ctx.fillStyle = '#fed7aa'; // cashew
      ctx.fillRect(x - 4, y - 3, 4, 3);
      ctx.fillStyle = '#1e293b'; // black pepper
      ctx.fillRect(x + 2, y + 2, 2.5, 2.5);
    } else if (st.state === 'OVERCOOKED') {
      ctx.fillStyle = '#713f12';
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawChapatiTawa(ctx, x, y, st) {
    // Flat cast tawa
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, Math.PI * 2);
    ctx.fill();

    if (st.state === 'COOKING') {
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
    } else if (st.state === 'READY') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      // Toasted brown blisters
      ctx.fillStyle = '#78350f';
      [[-3, -3], [3, 2], [0, 4]].forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(x + bx, y + by, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (st.state === 'OVERCOOKED') {
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawServingCounterDishes(ctx, cooking) {
    const dishes = cooking.servingCounter;
    const startX = 265;
    const spacing = 110;
    const y = 234;

    dishes.forEach((dish, idx) => {
      const dx = startX + idx * spacing;

      // Stainless Steel Plate (Thali)
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(dx, y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Banana leaf inside plate
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(dx, y, 11, 0, Math.PI * 2);
      ctx.fill();

      // Food item on top
      this.drawFoodIcon(ctx, dx, y, dish.dishId);

      // Quality rating star tag
      if (dish.quality === 'PERFECT') {
        ctx.fillStyle = '#eab308';
        ctx.font = '10px sans-serif';
        ctx.fillText('⭐', dx - 4, y - 14);
      }
    });
  }

  drawCustomers(ctx, customerManager) {
    customerManager.customers.forEach(c => {
      ctx.save();
      const x = c.x;
      const y = c.y;
      const arc = c.archetype;

      // Customer shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x, y + 16, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Customer Body / Clothes
      ctx.fillStyle = arc.clothesColor;
      ctx.beginPath();
      ctx.arc(x, y + 4, 11, 0, Math.PI * 2);
      ctx.fill();

      // Customer Head
      ctx.fillStyle = arc.skinColor;
      ctx.beginPath();
      ctx.arc(x, y - 8, 9, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = arc.hairColor;
      ctx.beginPath();
      ctx.arc(x, y - 12, 8, Math.PI, Math.PI * 2);
      ctx.fill();

      // Face direction / eyes
      const eyeOffset = c.facing === 'left' ? -3 : 3;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(x + eyeOffset, y - 8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Traditional Tilak / Vibhuti for Grandfather
      if (arc.type === 'ELDER') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 3, y - 12, 6, 2);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x, y - 11, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Order speech bubble when customer is waiting to order or waiting for food
      if (c.state === 'WAITING_FOR_ORDER' || c.state === 'WAITING_FOR_FOOD') {
        this.drawCustomerOrderBubble(ctx, c);
      }

      // Eating animation plate on table
      if (c.state === 'EATING') {
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(x, y + 12, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(x, y + 12, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  drawCustomerOrderBubble(ctx, c) {
    const x = c.x;
    const y = c.y - 34;

    // Speech bubble background
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - 22, y - 18, 44, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Bubble pointer down
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 8);
    ctx.lineTo(x, y + 13);
    ctx.lineTo(x + 4, y + 8);
    ctx.fill();

    // Food Icon in bubble
    this.drawFoodIcon(ctx, x - 7, y - 5, c.chosenDishId);

    // Patience indicator mini bar below bubble
    const pRatio = Math.max(0, Math.min(1.0, c.patience / c.maxPatience));
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x - 18, y + 15, 36, 4);

    let pColor = '#10b981';
    if (pRatio < 0.3) pColor = '#ef4444';
    else if (pRatio < 0.6) pColor = '#f59e0b';

    ctx.fillStyle = pColor;
    ctx.fillRect(x - 18, y + 15, 36 * pRatio, 4);
  }

  drawWaiter(ctx, waiter) {
    ctx.save();
    const x = waiter.x;
    const y = waiter.y;

    // Shinchan-inspired cartoon boy waiter shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 15, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Running legs
    const legSwing = Math.sin(waiter.animTime * 14) * 5;
    ctx.fillStyle = '#fde047'; // Yellow shorts
    ctx.fillRect(x - 7, y + 6, 6, 8);
    ctx.fillRect(x + 1, y + 6, 6, 8);

    ctx.fillStyle = '#d97706'; // little shoes
    ctx.fillRect(x - 8 + legSwing, y + 13, 7, 4);
    ctx.fillRect(x + 1 - legSwing, y + 13, 7, 4);

    // Red T-Shirt
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 4, 20, 13, 3);
    ctx.fill();

    // Head (cute chubby cartoon cheeks!)
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(x, y - 11, 9, 0, Math.PI * 2);
    ctx.fill();

    // Black Hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x, y - 15, 8, Math.PI, Math.PI * 2);
    ctx.fill();

    // Big expressive cartoon eyebrows & eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 4, y - 15, 8, 2); // mischievous thick brow
    ctx.beginPath();
    ctx.arc(x + (waiter.facing === 'left' ? -3 : 3), y - 11, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cheerful smile
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x + (waiter.facing === 'left' ? -2 : 2), y - 9, 3, 0, Math.PI);
    ctx.stroke();

    // Carrying Dish on Tray
    if (waiter.carryingDish) {
      // Stainless Steel Tray held above hands
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x - 16, y - 28, 32, 5);
      // Food on tray
      this.drawFoodIcon(ctx, x, y - 34, waiter.carryingDish.dishId);
    } else if (waiter.carryingTicket) {
      // Order notepad held in hand
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + 5, y - 2, 8, 10);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x + 6, y, 6, 2);
    }

    ctx.restore();
  }

  drawChef(ctx, player) {
    ctx.save();
    const x = player.x;
    const y = player.y;

    // Chef shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 17, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking animation bob
    const bob = player.isMoving ? Math.sin(player.animTime * 12) * 2 : 0;
    const cy = y + bob;

    // Dhoti / Veshti (white South Indian waist wrap with gold zari border)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 9, cy + 6, 18, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 9, cy + 14, 18, 2); // Gold border

    // Chef White Coat
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 12, cy - 8, 24, 16, 4);
    ctx.fill();

    // Chef Coat Buttons (Golden)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x - 2, cy - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(x - 2, cy + 2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Chef Head
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(x, cy - 16, 9, 0, Math.PI * 2);
    ctx.fill();

    // Friendly curved South Indian mustache
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(x, cy - 14, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chef Tall White Hat (Puff Toque)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 9, cy - 27, 18, 8, 2);
    ctx.fill();
    // Hat puff
    ctx.beginPath();
    ctx.arc(x, cy - 28, 8, Math.PI, Math.PI * 2);
    ctx.fill();

    // Spatula in hand
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 11, cy - 2, 3, 12);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 10, cy - 7, 5, 6);

    // Held Dish in hands
    if (player.heldDish) {
      // Plate held in front
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(x, cy + 12, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#15803d'; // banana leaf lining
      ctx.beginPath();
      ctx.arc(x, cy + 12, 9, 0, Math.PI * 2);
      ctx.fill();

      this.drawFoodIcon(ctx, x, cy + 12, player.heldDish.dishId);
    }

    ctx.restore();
  }

  drawFoodIcon(ctx, x, y, dishId) {
    const photo = assets.get(dishId);
    if (photo) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(photo, x - 7, y - 7, 14, 14);
      ctx.restore();
      return;
    }

    switch (dishId) {
      case 'IDLY':
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - 3, y - 1, 4, 0, Math.PI * 2);
        ctx.arc(x + 3, y + 1, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'DOSA':
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.ellipse(x, y, 7, 3, -0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'POORI':
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'PONGAL':
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'CHAPATI':
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'EGG_DOSA':
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.ellipse(x, y, 7, 3, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  drawStationProgressRings(ctx, cooking) {
    const stations = cooking.stations;

    Object.keys(stations).forEach(id => {
      const st = stations[id];
      const x = st.def.x;
      const y = st.def.y - 28;

      if (st.state === 'COOKING') {
        const p = cooking.getStationProgress(id);
        // Circular progress ring
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
        ctx.stroke();
      } else if (st.state === 'READY') {
        // Glowing gold badge
        ctx.fillStyle = st.quality === 'PERFECT' ? '#eab308' : '#22c55e';
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓', x, y + 3);
        ctx.textAlign = 'left';
      } else if (st.state === 'OVERCOOKED') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', x, y + 3);
        ctx.textAlign = 'left';
      }
    });
  }
}

function cookingProgress(station) {
  if (!station || station.state === 'IDLE') return 0;
  return Math.min(1.0, station.elapsed / station.dishDef.cookTime);
}
