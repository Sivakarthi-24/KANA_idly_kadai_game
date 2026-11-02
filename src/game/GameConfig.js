/**
 * KANA - Tamil Nadu Idly Kadai
 * Central Game Configuration & Constants
 */

export const DISHES = {
  IDLY: {
    id: 'IDLY',
    name: 'Idly',
    tamilName: 'இட்லி',
    price: 10,
    cookTime: 4.2, // seconds
    perfectWindow: [3.8, 5.0], // between 3.8s and 5.0s is Perfect
    overcookTime: 7.0, // after 7s it becomes overcooked
    stationId: 'IDLI_STATION',
    icon: 'idly',
    color: '#f8fafc',
    description: 'Soft steamed rice cakes served with sambar & chutneys'
  },
  DOSA: {
    id: 'DOSA',
    name: 'Dosa',
    tamilName: 'தோசை',
    price: 20,
    cookTime: 4.5,
    perfectWindow: [4.0, 5.4],
    overcookTime: 7.2,
    stationId: 'DOSA_STATION',
    icon: 'dosa',
    color: '#eab308',
    description: 'Crispy golden crepe prepared on hot cast iron tawa'
  },
  POORI: {
    id: 'POORI',
    name: 'Poori',
    tamilName: 'பூரி',
    price: 20,
    cookTime: 3.8,
    perfectWindow: [3.4, 4.6],
    overcookTime: 6.5,
    stationId: 'POORI_STATION',
    icon: 'poori',
    color: '#f59e0b',
    description: 'Fluffy golden puffed deep-fried bread with potato masala'
  },
  PONGAL: {
    id: 'PONGAL',
    name: 'Pongal',
    tamilName: 'பொங்கல்',
    price: 15,
    cookTime: 5.0,
    perfectWindow: [4.5, 6.0],
    overcookTime: 8.0,
    stationId: 'PONGAL_STATION',
    icon: 'pongal',
    color: '#fde047',
    description: 'Hot fragrant ghee ven pongal seasoned with pepper & cashews'
  },
  CHAPATI: {
    id: 'CHAPATI',
    name: 'Chapati',
    tamilName: 'சப்பாத்தி',
    price: 15,
    cookTime: 4.0,
    perfectWindow: [3.6, 4.8],
    overcookTime: 6.8,
    stationId: 'CHAPATI_STATION',
    icon: 'chapati',
    color: '#d97706',
    description: 'Soft hand-rolled whole wheat flatbread tossed on tawa'
  },
  EGG_DOSA: {
    id: 'EGG_DOSA',
    name: 'Egg Dosa',
    tamilName: 'முட்டை தோசை',
    price: 25,
    cookTime: 5.2,
    perfectWindow: [4.7, 6.2],
    overcookTime: 8.2,
    stationId: 'EGG_DOSA_STATION',
    icon: 'egg_dosa',
    color: '#fbbf24',
    description: 'Crispy roast dosa topped with spiced cracked farm egg'
  }
};

export const STATIONS = {
  IDLI_STATION: {
    id: 'IDLI_STATION',
    name: 'Idli Steamer',
    tamilName: 'இட்லி கொப்பரை',
    dishId: 'IDLY',
    x: 170,
    y: 110,
    width: 65,
    height: 48,
    interactRadius: 52
  },
  DOSA_STATION: {
    id: 'DOSA_STATION',
    name: 'Dosa Tawa',
    tamilName: 'தோசைக் கல்',
    dishId: 'DOSA',
    x: 270,
    y: 110,
    width: 65,
    height: 48,
    interactRadius: 52
  },
  POORI_STATION: {
    id: 'POORI_STATION',
    name: 'Poori Fryer',
    tamilName: 'பூரி வாணலி',
    dishId: 'POORI',
    x: 370,
    y: 110,
    width: 65,
    height: 48,
    interactRadius: 52
  },
  PONGAL_STATION: {
    id: 'PONGAL_STATION',
    name: 'Pongal Pot',
    tamilName: 'பொங்கல் பாத்திரம்',
    dishId: 'PONGAL',
    x: 470,
    y: 110,
    width: 65,
    height: 48,
    interactRadius: 52
  },
  CHAPATI_STATION: {
    id: 'CHAPATI_STATION',
    name: 'Chapati Tawa',
    tamilName: 'சப்பாத்தி கல்',
    dishId: 'CHAPATI',
    x: 570,
    y: 110,
    width: 65,
    height: 48,
    interactRadius: 52
  },
  EGG_DOSA_STATION: {
    id: 'EGG_DOSA_STATION',
    name: 'Egg Dosa Tawa',
    tamilName: 'முட்டை தோசை',
    dishId: 'EGG_DOSA',
    x: 670,
    y: 110,
    width: 65,
    height: 48,
    interactRadius: 52
  },
  SERVING_COUNTER: {
    id: 'SERVING_COUNTER',
    name: 'Serving Counter',
    tamilName: 'பரிமாறும் மேடை',
    x: 420,
    y: 230,
    width: 280,
    height: 38,
    interactRadius: 58,
    maxSlots: 4
  },
  INGREDIENT_COUNTER: {
    id: 'INGREDIENT_COUNTER',
    name: 'Batter & Spices Counter',
    tamilName: 'மசாலா மேடை',
    x: 100,
    y: 230,
    width: 100,
    height: 38,
    interactRadius: 52
  }
};

export const TABLES = [
  { id: 1, x: 190, y: 390, width: 90, height: 50, seats: [{ x: 160, y: 390 }, { x: 220, y: 390 }] },
  { id: 2, x: 370, y: 390, width: 90, height: 50, seats: [{ x: 340, y: 390 }, { x: 400, y: 390 }] },
  { id: 3, x: 550, y: 390, width: 90, height: 50, seats: [{ x: 520, y: 390 }, { x: 580, y: 390 }] },
  { id: 4, x: 730, y: 390, width: 90, height: 50, seats: [{ x: 700, y: 390 }, { x: 760, y: 390 }] },
  { id: 5, x: 280, y: 490, width: 90, height: 50, seats: [{ x: 250, y: 490 }, { x: 310, y: 490 }], requiresUpgrade: 'EXTRA_TABLE' },
  { id: 6, x: 640, y: 490, width: 90, height: 50, seats: [{ x: 610, y: 490 }, { x: 670, y: 490 }], requiresUpgrade: 'EXTRA_TABLE_2' }
];

export const UPGRADES = {
  FASTER_IDLI: {
    id: 'FASTER_IDLI',
    name: 'Turbo Idli Steamer',
    description: 'Increases steam pressure, cutting Idli cooking time by 25%',
    icon: '♨️',
    maxLevel: 3,
    costs: [120, 240, 400],
    effects: [0.85, 0.70, 0.55] // cook time multiplier
  },
  FASTER_DOSA: {
    id: 'FASTER_DOSA',
    name: 'Cast Iron Dosa Burner',
    description: 'Commercial high-flame burner reduces Dosa cooking time',
    icon: '🍳',
    maxLevel: 3,
    costs: [150, 300, 480],
    effects: [0.85, 0.70, 0.55]
  },
  FASTER_POORI: {
    id: 'FASTER_POORI',
    name: 'Hot Oil Kadai Thermostat',
    description: 'Maintains ideal oil heat to puff Pooris rapidly',
    icon: '🥘',
    maxLevel: 2,
    costs: [160, 320],
    effects: [0.80, 0.65]
  },
  SPEEDY_WAITER: {
    id: 'SPEEDY_WAITER',
    name: 'Shinchan Running Shoes',
    description: 'Our energetic waiter moves 30% faster around tables',
    icon: '👟',
    maxLevel: 3,
    costs: [180, 350, 550],
    effects: [1.25, 1.50, 1.80] // speed multiplier
  },
  EXTRA_TABLE: {
    id: 'EXTRA_TABLE',
    name: 'Banana Leaf Dining Table',
    description: 'Adds an extra 2-seater dining table to seat more customers',
    icon: '🪑',
    maxLevel: 2,
    costs: [200, 400],
    effects: [1, 2] // tables unlocked
  },
  GHEE_QUALITY: {
    id: 'GHEE_QUALITY',
    name: 'Pure Desi Ghee & Spices',
    description: 'Delicious aroma gives happy customers +40% higher tips',
    icon: '✨',
    maxLevel: 2,
    costs: [140, 280],
    effects: [1.35, 1.70] // tip multiplier
  },
  MARIGOLD_DECOR: {
    id: 'MARIGOLD_DECOR',
    name: 'Marigold Garland & Lights',
    description: 'Welcoming South Indian ambiance increases customer patience by +25%',
    icon: '🌼',
    maxLevel: 2,
    costs: [130, 260],
    effects: [1.20, 1.40] // patience multiplier
  }
};

export const DAYS = [
  {
    day: 1,
    title: 'Small Morning Kadai',
    tamilTitle: 'காலை உணவகம்',
    description: 'Learn the morning routine! Serve fresh hot Idly and crispy Dosa.',
    dishesAllowed: ['IDLY', 'DOSA'],
    targetRevenue: 100,
    starThresholds: [100, 140, 180],
    customerPatience: 55, // seconds
    customerSpawnMinInterval: 8,
    customerSpawnMaxInterval: 14,
    maxSimultaneousCustomers: 3,
    dayDuration: 90 // seconds
  },
  {
    day: 2,
    title: 'Busy Breakfast Rush',
    tamilTitle: 'சுவையான காலை நேரம்',
    description: 'The aroma spreads! Poori and Pongal join the morning menu.',
    dishesAllowed: ['IDLY', 'DOSA', 'POORI', 'PONGAL'],
    targetRevenue: 240,
    starThresholds: [240, 310, 380],
    customerPatience: 50,
    customerSpawnMinInterval: 6,
    customerSpawnMaxInterval: 11,
    maxSimultaneousCustomers: 4,
    dayDuration: 100
  },
  {
    day: 3,
    title: 'College Canteen Rush',
    tamilTitle: 'கல்லூரி கூட்டம்',
    description: 'Students flood in! Chapati and Egg Dosa are on high demand.',
    dishesAllowed: ['IDLY', 'DOSA', 'POORI', 'PONGAL', 'CHAPATI', 'EGG_DOSA'],
    targetRevenue: 420,
    starThresholds: [420, 520, 640],
    customerPatience: 45,
    customerSpawnMinInterval: 4.5,
    customerSpawnMaxInterval: 8.5,
    maxSimultaneousCustomers: 5,
    dayDuration: 110
  },
  {
    day: 4,
    title: 'Sunday Family Feast',
    tamilTitle: 'குடும்ப திருவிழா',
    description: 'Full house with families. Keep multiple stoves running simultaneously!',
    dishesAllowed: ['IDLY', 'DOSA', 'POORI', 'PONGAL', 'CHAPATI', 'EGG_DOSA'],
    targetRevenue: 650,
    starThresholds: [650, 800, 950],
    customerPatience: 42,
    customerSpawnMinInterval: 3.8,
    customerSpawnMaxInterval: 7.0,
    maxSimultaneousCustomers: 6,
    dayDuration: 120
  },
  {
    day: 5,
    title: 'Famous Chennai Tiffin Center',
    tamilTitle: 'புகழ்பெற்ற சென்னை டிபன்',
    description: 'The pinnacle of South Indian hospitality! Rapid orders, master chef perfection.',
    dishesAllowed: ['IDLY', 'DOSA', 'POORI', 'PONGAL', 'CHAPATI', 'EGG_DOSA'],
    targetRevenue: 950,
    starThresholds: [950, 1150, 1400],
    customerPatience: 38,
    customerSpawnMinInterval: 3.0,
    customerSpawnMaxInterval: 6.0,
    maxSimultaneousCustomers: 8,
    dayDuration: 130
  }
];

export const CUSTOMER_ARCHETYPES = [
  {
    type: 'STUDENT',
    name: 'College Student',
    speed: 70,
    patienceMod: 1.05,
    tipMod: 0.9,
    clothesColor: '#38bdf8',
    skinColor: '#d97706',
    hairColor: '#1e293b',
    preferredDishes: ['EGG_DOSA', 'DOSA', 'POORI']
  },
  {
    type: 'OFFICE',
    name: 'IT Techie',
    speed: 85,
    patienceMod: 0.85,
    tipMod: 1.35,
    clothesColor: '#6366f1',
    skinColor: '#b45309',
    hairColor: '#0f172a',
    preferredDishes: ['IDLY', 'PONGAL', 'DOSA']
  },
  {
    type: 'ELDER',
    name: 'Grandfather Periyavar',
    speed: 55,
    patienceMod: 1.25,
    tipMod: 1.15,
    clothesColor: '#f8fafc',
    skinColor: '#92400e',
    hairColor: '#cbd5e1',
    preferredDishes: ['IDLY', 'PONGAL', 'CHAPATI']
  },
  {
    type: 'FOODIE',
    name: 'Food Blogger',
    speed: 75,
    patienceMod: 0.95,
    tipMod: 1.5,
    clothesColor: '#ec4899',
    skinColor: '#d97706',
    hairColor: '#334155',
    preferredDishes: ['EGG_DOSA', 'POORI', 'DOSA']
  },
  {
    type: 'FAMILY',
    name: 'Local Regular',
    speed: 65,
    patienceMod: 1.1,
    tipMod: 1.2,
    clothesColor: '#10b981',
    skinColor: '#b45309',
    hairColor: '#1e293b',
    preferredDishes: ['POORI', 'IDLY', 'DOSA', 'CHAPATI']
  }
];
