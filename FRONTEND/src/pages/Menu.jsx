import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Check, Search, Sparkles, Flame, Leaf } from 'lucide-react';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'Veg', 'NonVeg'
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useContext(CartContext);
  const [addedItemIds, setAddedItemIds] = useState({});

  const cuisines = [
    { id: 'All', label: 'All Cuisines', icon: '🍽️' },
    { id: 'Indian', label: 'Indian Specials', icon: '🇮🇳' },
    { id: 'Chinese', label: 'Chinese Delights', icon: '🥢' }
  ];

  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Sides'];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        const data = await response.json();
        if (data.success) {
          setItems(data.data);
        }
      } catch (err) {
        console.error('Error fetching menu', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item._id]: false }));
    }, 1500);
  };

  const filteredItems = items.filter((item) => {
    // Cuisine filter
    if (selectedCuisine !== 'All' && item.cuisine !== selectedCuisine) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    // Dietary filter
    if (dietaryFilter === 'Veg' && !item.isVeg) {
      return false;
    }
    if (dietaryFilter === 'NonVeg' && item.isVeg) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchCuisine = item.cuisine?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCategory && !matchCuisine) {
        return false;
      }
    }
    return true;
  });

  const getSpiceBadge = (level) => {
    if (level === 'Spicy') return <span title="Spicy" style={{ color: '#ff4d4f', fontSize: '0.75rem', fontWeight: 600 }}>🌶️🌶️ Hot</span>;
    if (level === 'Medium') return <span title="Medium Spicy" style={{ color: '#faad14', fontSize: '0.75rem', fontWeight: 600 }}>🌶️ Medium</span>;
    if (level === 'Mild') return <span title="Mild" style={{ color: '#52c41a', fontSize: '0.75rem', fontWeight: 600 }}>🌿 Mild</span>;
    return null;
  };

  return (
    <div className="fade-in" style={{ padding: '0 24px 60px' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-gold)',
          fontSize: '0.85rem',
          letterSpacing: '4px',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          <Sparkles size={16} /> CRAFTED TO PERFECTION
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.2rem', marginTop: '4px', marginBottom: '12px' }}>
          Our Master Menu
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
          Discover the vibrant heritage of authentic <strong>Indian</strong> curries & tandoor, alongside wok-tossed <strong>Chinese</strong> specialties crafted by master chefs.
        </p>
      </div>

      {/* Cuisine Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '28px'
      }}>
        {cuisines.map((c) => {
          const isActive = selectedCuisine === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCuisine(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isActive ? '1px solid var(--color-gold)' : '1px solid var(--border-color)',
                backgroundColor: isActive ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#0b0c10' : 'var(--text-primary)',
                boxShadow: isActive ? '0 8px 20px rgba(197, 168, 128, 0.3)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
              <span>{c.label}</span>
              {c.id !== 'All' && (
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? '#0b0c10' : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? 'var(--color-gold)' : 'var(--text-muted)'
                }}>
                  {items.filter(i => i.cuisine === c.id).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Search Bar & Dietary Filter */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
          maxWidth: '720px',
          flexWrap: 'wrap'
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1 1 300px'
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search dishes (e.g., Biryani, Dim Sum, Paneer, Hakka...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '44px',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Dietary Buttons */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '30px',
            border: '1px solid var(--border-color)',
            padding: '4px'
          }}>
            <button
              onClick={() => setDietaryFilter('All')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: dietaryFilter === 'All' ? 'var(--border-color)' : 'transparent',
                color: dietaryFilter === 'All' ? '#fff' : 'var(--text-muted)'
              }}
            >
              All Diet
            </button>
            <button
              onClick={() => setDietaryFilter('Veg')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: dietaryFilter === 'Veg' ? 'rgba(46, 204, 113, 0.2)' : 'transparent',
                color: dietaryFilter === 'Veg' ? '#2ecc71' : 'var(--text-muted)'
              }}
            >
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71' }}></span> Veg
            </button>
            <button
              onClick={() => setDietaryFilter('NonVeg')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: dietaryFilter === 'NonVeg' ? 'rgba(231, 76, 60, 0.2)' : 'transparent',
                color: dietaryFilter === 'NonVeg' ? '#e74c3c' : 'var(--text-muted)'
              }}
            >
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e74c3c' }}></span> Non-Veg
            </button>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '8px 18px',
                fontSize: '0.82rem',
                borderRadius: '25px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: selectedCategory === category ? 'none' : '1px solid var(--border-color)'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid rgba(197, 168, 128, 0.15)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading culinary menu...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍽️</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>No Dishes Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
            No culinary items match your current filter criteria.
          </p>
          <button
            onClick={() => { setSelectedCuisine('All'); setSelectedCategory('All'); setDietaryFilter('All'); setSearchQuery(''); }}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '30px'
        }}>
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="glass-panel menu-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(26, 32, 44, 0.65)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Image Container with Badges */}
              <div style={{
                height: '210px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#12161f'
              }}>
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  loading="lazy"
                  className="card-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(11, 12, 16, 0.85) 0%, rgba(11, 12, 16, 0.15) 50%, rgba(11, 12, 16, 0.4) 100%)'
                }} />

                {/* Top Badges (Cuisine & Veg/Non-Veg) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {/* Cuisine Tag */}
                  <span style={{
                    backgroundColor: 'rgba(11, 12, 16, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--color-gold)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(197, 168, 128, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {item.cuisine === 'Chinese' ? '🥢 Chinese' : '🇮🇳 Indian'}
                  </span>

                  {/* Veg / Non-Veg Indicator Icon */}
                  <div
                    title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: item.isVeg ? '2px solid #2ecc71' : '2px solid #e74c3c',
                      backgroundColor: 'rgba(11, 12, 16, 0.85)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: item.isVeg ? '#2ecc71' : '#e74c3c'
                    }} />
                  </div>
                </div>

                {/* Bottom Tags over Image (Category & Spice) */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#e2e8f0',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(6px)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.category}
                  </span>
                  {getSpiceBadge(item.spiceLevel)}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: '1.3'
                    }}>
                      {item.name}
                    </h3>
                  </div>

                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.86rem',
                    lineHeight: '1.5',
                    marginBottom: '18px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '14px',
                  marginTop: 'auto'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable}
                    className="btn btn-primary"
                    style={{
                      gap: '8px',
                      padding: '9px 18px',
                      fontSize: '0.85rem',
                      borderRadius: '8px'
                    }}
                  >
                    {addedItemIds[item._id] ? (
                      <>
                        <Check size={16} /> Added
                      </>
                    ) : item.isAvailable ? (
                      <>
                        <ShoppingCart size={15} /> Add to Cart
                      </>
                    ) : (
                      'Sold Out'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .menu-card:hover {
          transform: translateY(-6px);
          border-color: rgba(197, 168, 128, 0.5);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }
        .menu-card:hover .card-image {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};

export default Menu;
