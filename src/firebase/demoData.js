export const demoProducts = [
  // Leather Money Bag
  {
    id: '1',
    name: 'Classic Leather Wallet',
    price: 1299,
    category: 'Leather Money Bag',
    description: 'Genuine leather wallet with multiple card slots',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Leather+Wallet&font=inter',
      'https://placehold.co/600x400/2d3748/FFFFFF?text=Wallet+Inside&font=inter'
    ],
    sizes: ['Standard'],
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Premium Money Clip',
    price: 899,
    category: 'Leather Money Bag',
    description: 'Sleek leather money clip with RFID protection',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Money+Clip&font=inter'
    ],
    sizes: ['Standard'],
    inStock: true,
    featured: false
  },

  // Chelsea Boot
  {
    id: '3',
    name: 'Black Leather Chelsea',
    price: 3999,
    category: 'Chelsea Boot',
    description: 'Premium full-grain leather Chelsea boots',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Black+Chelsea&font=inter',
      'https://placehold.co/600x400/2d3748/FFFFFF?text=Boot+Side&font=inter'
    ],
    sizes: [40, 41, 42, 43, 44],
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Brown Suede Chelsea',
    price: 4299,
    category: 'Chelsea Boot',
    description: 'Soft suede finish with elastic side panels',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Suede+Chelsea&font=inter'
    ],
    sizes: [39, 40, 41, 42, 43],
    inStock: true,
    featured: true
  },

  // Oxford Shoe
  {
    id: '5',
    name: 'Classic Black Oxford',
    price: 3499,
    category: 'Oxford Shoe',
    description: 'Formal Oxford shoes for professional wear',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Black+Oxford&font=inter'
    ],
    sizes: [40, 41, 42, 43],
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'Brown Brogue Oxford',
    price: 3799,
    category: 'Oxford Shoe',
    description: 'Stylish brogue detailing with leather sole',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Brogue+Oxford&font=inter'
    ],
    sizes: [39, 40, 41, 42],
    inStock: true,
    featured: false
  },

  // Leather Belt
  {
    id: '7',
    name: 'Classic Leather Belt',
    price: 799,
    category: 'Leather Belt',
    description: 'Genuine leather belt with metal buckle',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Leather+Belt&font=inter'
    ],
    sizes: ['32', '34', '36', '38'],
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'Reversible Belt Black/Brown',
    price: 999,
    category: 'Leather Belt',
    description: 'Two-tone reversible leather belt',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Reversible+Belt&font=inter'
    ],
    sizes: ['34', '36', '38', '40'],
    inStock: true,
    featured: false
  },

  // Leather Converse
  {
    id: '9',
    name: 'Leather High Top Converse',
    price: 2999,
    category: 'Leather Converse',
    description: 'Leather version of classic Converse',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Leather+Converse&font=inter'
    ],
    sizes: [39, 40, 41, 42, 43],
    inStock: true,
    featured: true
  },

  // Casual Shoe
  {
    id: '10',
    name: 'Casual Leather Loafers',
    price: 2499,
    category: 'Casual Shoe',
    description: 'Comfortable leather loafers for everyday wear',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Leather+Loafers&font=inter'
    ],
    sizes: [40, 41, 42, 43],
    inStock: true,
    featured: true
  },
  {
    id: '11',
    name: 'Leather Sneakers',
    price: 2799,
    category: 'Casual Shoe',
    description: 'Stylish leather sneakers with rubber sole',
    images: [
      'https://placehold.co/600x400/1a202c/FFFFFF?text=Leather+Sneakers&font=inter'
    ],
    sizes: [41, 42, 43, 44],
    inStock: false,
    featured: false
  }
];

export const categories = [
  'All Products',
  'Leather Money Bag',
  'Chelsea Boot', 
  'Oxford Shoe',
  'Leather Belt',
  'Leather Converse',
  'Casual Shoe'
];

// Product details জন্য extended data
export const productDetails = {
  '1': {
    id: '1',
    name: 'Classic Leather Wallet',
    price: 1299,
    category: 'Leather Money Bag',
    description: 'Genuine leather wallet with multiple card slots and cash compartment.',
    longDescription: 'This classic leather wallet combines elegance with functionality. Featuring 8 card slots, 2 ID windows, and a spacious cash compartment. The leather develops a unique patina over time.',
    images: [
      'https://placehold.co/800x600/1a202c/FFFFFF?text=Wallet+Front&font=inter',
      'https://placehold.co/800x600/2d3748/FFFFFF?text=Wallet+Back&font=inter',
      'https://placehold.co/800x600/4a5568/FFFFFF?text=Wallet+Inside&font=inter',
      'https://placehold.co/800x600/718096/FFFFFF?text=Wallet+Details&font=inter'
    ],
    sizes: ['Standard'],
    colors: ['Brown', 'Black'],
    features: ['Genuine Cowhide Leather', '8 Card Slots', '2 ID Windows', 'RFID Protection', '1 Year Warranty'],
    specifications: {
      'Material': 'Full Grain Leather',
      'Dimensions': '11 x 9 cm',
      'Weight': '120 grams',
      'Closure': 'Magnetic Snap',
      'Made in': 'Bangladesh'
    },
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 124
  },
  '3': {
    id: '3',
    name: 'Black Leather Chelsea Boot',
    price: 3999,
    category: 'Chelsea Boot',
    description: 'Premium full-grain leather Chelsea boots with elastic side panels.',
    longDescription: 'Handcrafted from premium full-grain leather, these Chelsea boots offer both style and comfort. Perfect for both formal and casual occasions.',
    images: [
      'https://placehold.co/800x600/1a202c/FFFFFF?text=Chelsea+Front&font=inter',
      'https://placehold.co/800x600/2d3748/FFFFFF?text=Chelsea+Side&font=inter',
      'https://placehold.co/800x600/4a5568/FFFFFF?text=Chelsea+Back&font=inter',
      'https://placehold.co/800x600/718096/FFFFFF?text=Chelsea+Top&font=inter'
    ],
    sizes: [40, 41, 42, 43, 44],
    colors: ['Black', 'Dark Brown'],
    features: ['Full Grain Leather', 'Elastic Side Panels', 'Rubber Sole', 'Cushioned Insole', 'Goodyear Welt'],
    specifications: {
      'Material': 'Premium Leather',
      'Sole': 'Durable Rubber',
      'Closure': 'Elastic Goring',
      'Style': 'Chelsea Boot',
      'Care': 'Leather Conditioner'
    },
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 89
  }
};