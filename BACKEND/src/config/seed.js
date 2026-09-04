const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

const seedItems = [
  // ==================== INDIAN DISHES ====================
  // Indian Starters
  {
    name: 'Tandoori Paneer Tikka',
    description: 'Fresh cottage cheese cubes marinated in rich yogurt, Kashmiri chili, ajwain, and grilled in tandoor with bell peppers and onions.',
    price: 14.50,
    category: 'Starters',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Medium',
    isAvailable: true
  },
  {
    name: 'Dilli Wali Samosa Chaat',
    description: 'Crisp golden spiced potato samosas crushed and layered with spiced chickpeas, sweet beaten curd, mint and tamarind chutneys.',
    price: 9.50,
    category: 'Starters',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Medium',
    isAvailable: true
  },
  {
    name: 'Murgh Malai Tikka',
    description: 'Tender chicken morsels steeped in a velvety marinade of cream, cheese, green cardamom, and garlic, char-grilled to juicy tenderness.',
    price: 16.50,
    category: 'Starters',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Mild',
    isAvailable: true
  },
  {
    name: 'Hara Bhara Kebab',
    description: 'Pan-seared spiced patties made of farm-fresh spinach, green peas, and potatoes, studded with roasted cashew nuts and gentle spices.',
    price: 12.00,
    category: 'Starters',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Mild',
    isAvailable: true
  },

  // Indian Main Course
  {
    name: 'Butter Chicken (Murgh Makhani)',
    description: 'Charcoal-grilled tandoori chicken simmered in an indulgent, silky tomato-butter gravy infused with fragrant kasoori methi and honey.',
    price: 22.00,
    category: 'Main Course',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Mild',
    isAvailable: true
  },
  {
    name: 'Shahi Paneer Butter Masala',
    description: 'Soft cottage cheese simmered in a luscious tomato-cashew reduction, tempered with royal Indian spices and a touch of fresh cream.',
    price: 18.50,
    category: 'Main Course',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Medium',
    isAvailable: true
  },
  {
    name: 'Hyderabadi Chicken Dum Biryani',
    description: 'Royal long-grain aged basmati rice cooked on slow dum with marinated farm chicken, saffron threads, fried onions, and fresh mint.',
    price: 24.00,
    category: 'Main Course',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Spicy',
    isAvailable: true
  },
  {
    name: 'Dal Makhani Bukhara Style',
    description: 'Slow-simmered whole black urad lentils and kidney beans cooked for 18 hours with churned white butter, tomatoes, and dairy cream.',
    price: 15.00,
    category: 'Main Course',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Mild',
    isAvailable: true
  },
  {
    name: 'Kashmiri Mutton Rogan Josh',
    description: 'Tender baby lamb cooked in an aromatic gravy infused with authentic Kashmiri deghi chilies, fennel powder, and whole spices.',
    price: 26.50,
    category: 'Main Course',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Medium',
    isAvailable: true
  },

  // Indian Sides & Breads
  {
    name: 'Garlic Butter Naan Basket',
    description: 'Trio of clay oven-baked breads: Roasted garlic butter naan, butter laccha paratha, and tandoori roti brushed with clarified ghee.',
    price: 7.50,
    category: 'Sides',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  },

  // Indian Desserts
  {
    name: 'Gulab Jamun with Shahi Rabri',
    description: 'Warm golden milk-solid dumplings soaked in rose and cardamom syrup, served on a rich layer of chilled saffron pistachio rabri.',
    price: 8.50,
    category: 'Desserts',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  },
  {
    name: 'Kesar Pista Rasmalai',
    description: 'Spongy poached cottage cheese patties steeped in thickened saffron-infused cardamom milk, garnished with pistachio flakes.',
    price: 9.00,
    category: 'Desserts',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  },

  // Indian Beverages
  {
    name: 'Royal Alphonso Mango Lassi',
    description: 'Velvety whipped yogurt smoothie blended with ripe Alphonso mango pulp, green cardamom, and garnished with roasted pistachios.',
    price: 6.50,
    category: 'Beverages',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  },
  {
    name: 'Karak Masala Chai',
    description: 'Full-bodied brewed Assam tea simmered with fresh crushed ginger, cinnamon, green cardamom, cloves, and whole steamed milk.',
    price: 4.50,
    category: 'Beverages',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  },

  // ==================== CHINESE DISHES ====================
  // Chinese Starters
  {
    name: 'Crispy Veg Spring Rolls',
    description: 'Hand-rolled golden pastry stuffed with julienned vegetables, glass noodles, and shiitake mushrooms. Served with sweet chili dip.',
    price: 11.50,
    category: 'Starters',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Mild',
    isAvailable: true
  },
  {
    name: 'Steamed Chicken Dim Sum (Momos)',
    description: 'Delicate translucent steamed dumplings filled with spiced minced chicken, scallions, and water chestnuts with fiery Sichuan dip.',
    price: 13.50,
    category: 'Starters',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Medium',
    isAvailable: true
  },
  {
    name: 'Chilli Chicken (Dry)',
    description: 'Crisp chicken bites wok-tossed on high flame with slit green chilies, minced garlic, spring onions, capsicum, and dark soy sauce.',
    price: 16.50,
    category: 'Starters',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Spicy',
    isAvailable: true
  },
  {
    name: 'Crispy Chilli Garlic Babycorn',
    description: 'Tender baby corn tempura tossed in a sizzling wok with spicy garlic paste, cracked black pepper, red bell peppers, and scallions.',
    price: 12.50,
    category: 'Starters',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Spicy',
    isAvailable: true
  },

  // Chinese Main Course
  {
    name: 'Kung Pao Chicken',
    description: 'Classic Sichuan wok stir-fry featuring diced chicken, roasted peanuts, fiery red chili peppers, zucchini, and a savory-sweet glaze.',
    price: 21.00,
    category: 'Main Course',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Spicy',
    isAvailable: true
  },
  {
    name: 'Veg Hakka Noodles',
    description: 'Wok-tossed thin egg-free wheat noodles stir-fried with shredded cabbage, bell peppers, spring onions, and savory dark soy seasoning.',
    price: 15.00,
    category: 'Main Course',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Mild',
    isAvailable: true
  },
  {
    name: 'Schezwan Wok Fried Rice',
    description: 'Jasmine rice wok-fried with crisp seasonal vegetables, garlic, scallions, and our signature blazing house-made Schezwan chili paste.',
    price: 16.00,
    category: 'Main Course',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Spicy',
    isAvailable: true
  },
  {
    name: 'Veg Manchurian Gravy',
    description: 'Crispy fried minced vegetable dumplings simmered in an aromatic, rich garlic-ginger, soy, and fresh coriander sauce.',
    price: 17.00,
    category: 'Main Course',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'Medium',
    isAvailable: true
  },
  {
    name: 'Sweet & Sour Crispy Chicken',
    description: 'Crispy battered chicken chunks tossed with sweet pineapple, crunchy bell peppers, onions, and our vibrant tangy sweet-sour sauce.',
    price: 20.00,
    category: 'Main Course',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&auto=format&fit=crop&q=80',
    isVeg: false,
    spiceLevel: 'Mild',
    isAvailable: true
  },

  // Chinese Desserts
  {
    name: 'Honey Darsaan with Ice Cream',
    description: 'Crispy fried flat noodles tossed in warm blossom honey and toasted sesame seeds, served with a scoop of creamy vanilla ice cream.',
    price: 9.50,
    category: 'Desserts',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  },

  // Chinese Beverages
  {
    name: 'Imperial Jasmine Blossom Tea',
    description: 'Aromatic green tea infused with naturally scented midnight-harvested jasmine flowers. Served hot in a traditional teapot.',
    price: 5.50,
    category: 'Beverages',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  },
  {
    name: 'Brown Sugar Boba Milk Tea',
    description: 'Freshly brewed premium black milk tea with caramelized brown sugar swirls and chewy, warm tapioca pearls.',
    price: 7.00,
    category: 'Beverages',
    cuisine: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop&q=80',
    isVeg: true,
    spiceLevel: 'None',
    isAvailable: true
  }
];

const seedData = async (forceRefresh = false) => {
  try {
    const menuCount = await MenuItem.countDocuments();
    // If empty or forced refresh
    if (menuCount === 0 || forceRefresh) {
      console.log('Seeding / updating Indian & Chinese menu items...');
      await MenuItem.deleteMany({});
      await MenuItem.insertMany(seedItems);
      console.log(`Successfully seeded ${seedItems.length} Indian & Chinese menu items with images.`);
    }

    // Seed Tables if empty
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      console.log('Seeding initial tables map...');
      const tables = [
        { number: '1', capacity: 2, status: 'Available' },
        { number: '2', capacity: 2, status: 'Available' },
        { number: '3', capacity: 4, status: 'Available' },
        { number: '4', capacity: 4, status: 'Available' },
        { number: '5', capacity: 6, status: 'Available' },
        { number: '6', capacity: 8, status: 'Available' }
      ];
      await Table.create(tables);
      console.log('Tables seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

module.exports = seedData;
