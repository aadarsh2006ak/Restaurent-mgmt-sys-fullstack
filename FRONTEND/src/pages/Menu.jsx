import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Check, Search, Sparkles, Star, MessageSquare, X } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'Veg', 'NonVeg'
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [addedItemIds, setAddedItemIds] = useState({});

  // Rating Modal state
  const [ratingModalItem, setRatingModalItem] = useState(null);
  const [starRating, setStarRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [ratingError, setRatingError] = useState('');

  const cuisines = [
    { id: 'All', label: 'All Cuisines', icon: '🍽️' },
    { id: 'Indian', label: 'Indian Specials', icon: '🇮🇳' },
    { id: 'Chinese', label: 'Chinese Delights', icon: '🥢' }
  ];

  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Sides'];

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu`);
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

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item._id]: false }));
    }, 1500);
  };

  const openRatingModal = (item) => {
    setRatingModalItem(item);
    setStarRating(5);
    setHoverRating(0);
    setReviewerName(user ? user.name : '');
    setReviewComment('');
    setRatingSuccess('');
    setRatingError('');
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!ratingModalItem) return;

    setRatingSubmitting(true);
    setRatingError('');
    setRatingSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/${ratingModalItem._id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: starRating,
          comment: reviewComment,
          userName: reviewerName || (user ? user.name : 'Valued Guest')
        })
      });

      const data = await response.json();
      if (data.success) {
        setRatingSuccess('Thank you! Your rating has been submitted.');
        // Update local items array with newly updated ratings
        setItems((prevItems) =>
          prevItems.map((it) => (it._id === ratingModalItem._id ? data.data : it))
        );
        setTimeout(() => {
          setRatingModalItem(null);
        }, 1500);
      } else {
        setRatingError(data.message || 'Could not submit rating');
      }
    } catch (err) {
      setRatingError('Connection error. Could not submit review.');
    } finally {
      setRatingSubmitting(false);
    }
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
    if (level === 'Spicy') return <span title="Spicy" style={{ color: '#ff4d4f', fontSize: '0.72rem', fontWeight: 600 }}>🌶️🌶️ Hot</span>;
    if (level === 'Medium') return <span title="Medium Spicy" style={{ color: '#faad14', fontSize: '0.72rem', fontWeight: 600 }}>🌶️ Medium</span>;
    if (level === 'Mild') return <span title="Mild" style={{ color: '#52c41a', fontSize: '0.72rem', fontWeight: 600 }}>🌿 Mild</span>;
    return null;
  };

  return (
    <div className="fade-in page-wrapper">
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-gold)',
          fontSize: '0.82rem',
          letterSpacing: '3px',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <Sparkles size={15} /> CRAFTED TO PERFECTION
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', marginTop: '4px', marginBottom: '10px' }}>
          Our Master Menu
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Discover the vibrant heritage of authentic <strong>Indian</strong> curries & tandoor, alongside wok-tossed <strong>Chinese</strong> specialties.
        </p>
      </div>

      {/* Cuisine Tabs */}
      <div className="cuisine-tabs-container" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '24px'
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
                padding: '10px 20px',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isActive ? '1px solid var(--color-gold)' : '1px solid var(--border-color)',
                backgroundColor: isActive ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#0b0c10' : 'var(--text-primary)',
                boxShadow: isActive ? '0 6px 18px rgba(197, 168, 128, 0.25)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
              <span>{c.label}</span>
              {c.id !== 'All' && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '1px 7px',
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
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Search Bar & Dietary Filter Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          maxWidth: '720px',
          flexWrap: 'wrap'
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1 1 260px'
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
              placeholder="Search dishes (Biryani, Dim Sum, Paneer...)"
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

          {/* Dietary Filter Buttons */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '30px',
            border: '1px solid var(--border-color)',
            padding: '3px'
          }}>
            <button
              onClick={() => setDietaryFilter('All')}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
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
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: dietaryFilter === 'Veg' ? 'rgba(46, 204, 113, 0.2)' : 'transparent',
                color: dietaryFilter === 'Veg' ? '#2ecc71' : 'var(--text-muted)'
              }}
            >
              <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2ecc71' }}></span> Veg
            </button>
            <button
              onClick={() => setDietaryFilter('NonVeg')}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: dietaryFilter === 'NonVeg' ? 'rgba(231, 76, 60, 0.2)' : 'transparent',
                color: dietaryFilter === 'NonVeg' ? '#e74c3c' : 'var(--text-muted)'
              }}
            >
              <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#e74c3c' }}></span> Non-Veg
            </button>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div
          className="category-scroll-pills"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            maxWidth: '100%',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                border: selectedCategory === category ? 'none' : '1px solid var(--border-color)',
                flexShrink: 0
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
            width: '40px',
            height: '40px',
            border: '3px solid rgba(197, 168, 128, 0.15)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading culinary menu...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 20px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '8px' }}>No Dishes Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            No culinary items match your current filter criteria.
          </p>
          <button
            onClick={() => { setSelectedCuisine('All'); setSelectedCategory('All'); setDietaryFilter('All'); setSearchQuery(''); }}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className="menu-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '24px'
          }}
        >
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
                height: '190px',
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
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {/* Cuisine Tag */}
                  <span style={{
                    backgroundColor: 'rgba(11, 12, 16, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--color-gold)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.4px',
                    padding: '3px 8px',
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
                      width: '18px',
                      height: '18px',
                      border: item.isVeg ? '2px solid #2ecc71' : '2px solid #e74c3c',
                      backgroundColor: 'rgba(11, 12, 16, 0.85)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: item.isVeg ? '#2ecc71' : '#e74c3c'
                    }} />
                  </div>
                </div>

                {/* Bottom Tags over Image (Category & Spice) */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '10px',
                  right: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.68rem',
                    color: '#e2e8f0',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(6px)',
                    padding: '2px 7px',
                    borderRadius: '5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.category}
                  </span>
                  {getSpiceBadge(item.spiceLevel)}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: '1.3'
                    }}>
                      {item.name}
                    </h3>

                    {/* Star Rating Badge with Click to Rate */}
                    <button
                      onClick={() => openRatingModal(item)}
                      title="Click to view ratings and rate this dish"
                      style={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: '20px',
                        padding: '2px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        color: '#ffd700',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      <Star size={12} fill="#ffd700" color="#ffd700" />
                      <span>{item.rating || 4.8}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                        ({item.numReviews || (item.reviews ? item.reviews.length : 1)})
                      </span>
                    </button>
                  </div>

                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.84rem',
                    lineHeight: '1.45',
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
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
                  paddingTop: '12px',
                  marginTop: 'auto',
                  gap: '8px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      onClick={() => openRatingModal(item)}
                      className="btn btn-secondary"
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.78rem',
                        borderRadius: '8px',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }}
                      title="Rate Dish"
                    >
                      <Star size={13} style={{ color: '#ffd700' }} />
                    </button>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable}
                      className="btn btn-primary"
                      style={{
                        gap: '6px',
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        borderRadius: '8px'
                      }}
                    >
                      {addedItemIds[item._id] ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : item.isAvailable ? (
                        <>
                          <ShoppingCart size={14} /> Add
                        </>
                      ) : (
                        'Sold Out'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dish Rating & Review Modal */}
      {ratingModalItem && (
        <div
          className="rating-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setRatingModalItem(null)}
        >
          <div
            className="glass-panel fade-in"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(18, 22, 30, 0.95)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  RATE & REVIEW DISH
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {ratingModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setRatingModalItem(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {ratingError && (
              <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '14px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                {ratingError}
              </div>
            )}

            {ratingSuccess && (
              <div style={{ color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '14px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                {ratingSuccess}
              </div>
            )}

            <form onSubmit={handleRatingSubmit}>
              {/* Star Rating selector */}
              <div style={{ textAlign: 'center', margin: '16px 0 20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Select your rating:
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || starRating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStarRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Star
                          size={28}
                          color="#ffd700"
                          fill={isFilled ? '#ffd700' : 'transparent'}
                        />
                      </button>
                    );
                  })}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 'bold', marginTop: '6px', display: 'block' }}>
                  {starRating === 5 ? '⭐⭐⭐⭐⭐ Exceptional!' : starRating === 4 ? '⭐⭐⭐⭐ Great!' : starRating === 3 ? '⭐⭐⭐ Good' : starRating === 2 ? '⭐⭐ Fair' : '⭐ Poor'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reviewer-name">Your Name</label>
                <input
                  id="reviewer-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="review-comment">Feedback / Comments (Optional)</label>
                <textarea
                  id="review-comment"
                  rows={3}
                  placeholder="How was the flavor, spices, and tenderness?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="form-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setRatingModalItem(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ratingSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  {ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .menu-card:hover {
          transform: translateY(-4px);
          border-color: rgba(197, 168, 128, 0.5);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
        }
        .menu-card:hover .card-image {
          transform: scale(1.06);
        }
        @media (max-width: 480px) {
          .category-scroll-pills {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu;
