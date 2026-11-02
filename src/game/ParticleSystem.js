/**
 * KANA - Tamil Nadu Idly Kadai
 * Particle System - Steam, Sizzle, Sparkles, Hearts, and Floating Text
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
  }

  update(dt) {
    // 1. Update visual particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.scale += (p.growth || 0) * dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 2. Update floating reward texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y -= 25 * dt;
      t.life -= dt;

      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  spawnSteam(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 100) return;
      this.particles.push({
        type: 'STEAM',
        x: x + (Math.random() * 16 - 8),
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: -25 - Math.random() * 20,
        radius: 4 + Math.random() * 4,
        growth: 4,
        alpha: 0.6,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2
      });
    }
  }

  spawnSizzle(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 100) return;
      this.particles.push({
        type: 'SIZZLE',
        x: x + (Math.random() * 24 - 12),
        y: y + (Math.random() * 10 - 5),
        vx: (Math.random() - 0.5) * 35,
        vy: -20 - Math.random() * 30,
        radius: 2 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#f59e0b' : '#fbbf24',
        life: 0.3 + Math.random() * 0.25,
        maxLife: 0.5
      });
    }
  }

  spawnOilSplatter(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 100) return;
      this.particles.push({
        type: 'OIL',
        x: x + (Math.random() * 14 - 7),
        y: y,
        vx: (Math.random() - 0.5) * 40,
        vy: -40 - Math.random() * 30,
        radius: 2.5,
        color: '#f59e0b',
        life: 0.4,
        maxLife: 0.4
      });
    }
  }

  spawnSparkles(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 100) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 35;
      this.particles.push({
        type: 'SPARKLE',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 2,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8
      });
    }
  }

  spawnSmoke(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 100) return;
      this.particles.push({
        type: 'SMOKE',
        x: x + (Math.random() * 14 - 7),
        y: y,
        vx: (Math.random() - 0.5) * 15,
        vy: -30 - Math.random() * 15,
        radius: 5 + Math.random() * 4,
        growth: 6,
        life: 0.9,
        maxLife: 0.9
      });
    }
  }

  spawnHearts(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length > 100) return;
      this.particles.push({
        type: 'HEART',
        x: x + (Math.random() * 16 - 8),
        y: y + (Math.random() * 10 - 5),
        vx: (Math.random() - 0.5) * 20,
        vy: -35 - Math.random() * 20,
        radius: 6,
        life: 0.9,
        maxLife: 0.9
      });
    }
  }

  spawnFloatingText(x, y, text, color = '#10b981') {
    if (this.floatingTexts.length > 25) return;
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 1.5,
      maxLife: 1.5
    });
  }

  render(ctx) {
    // 1. Draw particles
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;

      if (p.type === 'STEAM') {
        ctx.fillStyle = 'rgba(240, 248, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'SMOKE') {
        ctx.fillStyle = 'rgba(75, 85, 99, 0.65)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'SIZZLE' || p.type === 'OIL') {
        ctx.fillStyle = p.color || '#f59e0b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'SPARKLE') {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'HEART') {
        ctx.fillStyle = '#ec4899';
        ctx.font = '14px Arial';
        ctx.fillText('❤️', p.x - 7, p.y);
      }

      ctx.restore();
    }

    // 2. Draw floating text
    for (const t of this.floatingTexts) {
      const alpha = Math.max(0, t.life / t.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = t.color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, t.x - 20, t.y);
      ctx.restore();
    }
  }
}
