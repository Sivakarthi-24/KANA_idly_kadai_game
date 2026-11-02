/**
 * Loads locally stored Wikimedia Commons photos used by the renderer and menus.
 * Images are shipped in /assets so the game works offline after first clone.
 */

export const ASSET_PATHS = {
  IDLY: 'assets/idly.jpg',
  DOSA: 'assets/dosa.jpg',
  POORI: 'assets/poori.jpg',
  PONGAL: 'assets/pongal.jpg',
  CHAPATI: 'assets/chapati.jpg',
  EGG_DOSA: 'assets/egg_dosa.jpg',
  menuBg: 'assets/menu_bg.jpg',
  bananaLeaf: 'assets/banana_leaf.jpg',
  marigold: 'assets/marigold.jpg',
  tiffin: 'assets/tiffin.jpg'
};

export class AssetManager {
  constructor() {
    this.images = {};
    this.ready = false;
  }

  load() {
    const entries = Object.entries(ASSET_PATHS);
    return Promise.all(entries.map(([key, src]) => this.loadImage(key, src)))
      .then(() => {
        this.ready = true;
        return this.images;
      });
  }

  loadImage(key, src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        resolve(img);
      };
      img.onerror = () => {
        console.warn('Asset failed to load:', src);
        this.images[key] = null;
        resolve(null);
      };
      img.src = src;
    });
  }

  get(key) {
    return this.images[key] || null;
  }
}

export const assets = new AssetManager();
