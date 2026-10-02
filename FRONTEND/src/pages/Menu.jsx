import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import {
  ShoppingCart,
  Check,
  Search,
  Sparkles,
  Star,
  Plus,
  Minus,
  MessageSquare,
  X,
  ArrowRight,
  Flame,
  Leaf
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'Veg', 'NonVeg'
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems, addToCart, updateQuantity, getCartCount, getCartTotal } = useContext(CartContext);
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
    }, 1200);
  };

  const getItemQuantityInCart = (itemId) => {
    const found = cartItems.find((i) => i._id === itemId);
    return found ? found.quantity : 0;
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
        setItems((prevItems) =>
          prevItems.map((it) => (it._id === ratingModalItem._id ? data.data : it))
        );
        setTimeout(() => {
          setRatingModalItem(null);
        }, 1200);
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
    if (selectedCuisine !== 'All' && item.cuisine !== selectedCuisine) {
      return false;
    }
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (dietaryFilter === 'Veg' && !item.isVeg) {
      return false;
    }
    if (dietaryFilter === 'NonVeg' && item.isVeg) {
      return false;
    }
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

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <div className="fade-in page-wrapper">
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-gold)',
          fontSize: '0.8rem',
          letterSpacing: '2.5px',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <Sparkles size={14} /> CRAFTED TO PERFECTION
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', margin: '4px 0 8px' }}>
          Our Master Menu
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', fontSize: '0.92rem', lineHeight: '1.5' }}>
          Authentic <strong>North & South Indian</strong> tandoor and curries, alongside fresh wok-tossed <strong>Chinese</strong> specialties.
        </p>
      </div>

      {/* Cuisine Tabs */}
      <div className="cuisine-tabs-strip hide-scrollbar">
        {cuisines.map((c) => {
          const isActive = selectedCuisine === c.id;
          const count = c.id === 'All' ? items.length : items.filter(i => i.cuisine === c.id).length;

          return (
            <button
              key={c.id}
              onClick={() => setSelectedCuisine(c.id)}
              className={`cuisine-pill-btn ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
              <span>{c.label}</span>
              <span className="cuisine-pill-count">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters Container */}
      <div className="menu-controls-wrapper">
        <div className="search-and-diet-row">
          {/* Search Input */}
          <div className="search-input-box">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes (Biryani, Dim Sum, Paneer...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input search-input-field"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dietary Filter Buttons */}
          <div className="dietary-filter-group">
            <button
              onClick={() => setDietaryFilter('All')}
              className={`diet-btn ${dietaryFilter === 'All' ? 'active' : ''}`}
            >
              All Diet
            </button>
            <button
              onClick={() => setDietaryFilter('Veg')}
              className={`diet-btn veg ${dietaryFilter === 'Veg' ? 'active' : ''}`}
            >
              <span className="diet-dot veg" /> Veg
            </button>
            <button
              onClick={() => setDietaryFilter('NonVeg')}
              className={`diet-btn non-veg ${dietaryFilter === 'NonVeg' ? 'active' : ''}`}
            >
              <span className="diet-dot non-veg" /> Non-Veg
            </button>
          </div>
        </div>

        {/* Category Pill Tabs with smooth touch scrolling */}
        <div className="category-scroll-strip hide-scrollbar">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-pill ${isActive ? 'active' : ''}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            border: '3px solid rgba(197, 168, 128, 0.15)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Loading culinary masterpieces...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 20px', maxWidth: '480px', margin: '20px auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '8px' }}>No Dishes Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
            No culinary items match your filter. Try clearing filters or searching for something else.
          </p>
          <button
            onClick={() => { setSelectedCuisine('All'); setSelectedCategory('All'); setDietaryFilter('All'); setSearchQuery(''); }}
            className="btn btn-primary btn-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="menu-dishes-grid">
          {filteredItems.map((item) => {
            const quantityInCart = getItemQuantityInCart(item._id);
            const isAdded = addedItemIds[item._id];

            return (
              <div
                key={item._id}
                className="glass-panel dish-card"
              >
                {/* Image Container with Badges */}
                <div className="dish-image-wrap">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    loading="lazy"
                    className="dish-card-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="dish-img-overlay" />

                  {/* Top Badges (Cuisine & Veg/Non-Veg) */}
                  <div className="dish-top-badges">
                    <span className="cuisine-badge-pill">
                      {item.cuisine === 'Chinese' ? '🥢 Chinese' : '🇮🇳 Indian'}
                    </span>

                    <div
                      title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      className={`diet-indicator-box ${item.isVeg ? 'veg' : 'non-veg'}`}
                    >
                      <span className={`diet-indicator-center ${item.isVeg ? 'veg' : 'non-veg'}`} />
                    </div>
                  </div>

                  {/* Category Pill on Image */}
                  <span className="dish-category-tag">
                    {item.category}
                  </span>
                </div>

                {/* Card Content Area */}
                <div className="dish-card-body">
                  <div className="dish-title-row">
                    <h3 className="dish-name">{item.name}</h3>
                    <span className="dish-price">₹{item.price.toFixed(2)}</span>
                  </div>

                  <p className="dish-desc">
                    {item.description}
                  </p>

                  {/* Meta Details & Customer Rating row */}
                  <div className="dish-meta-row">
                    {/* Spice Level */}
                    {item.spiceLevel && (
                      <span className={`spice-level-tag ${item.spiceLevel.toLowerCase()}`}>
                        <Flame size={12} /> {item.spiceLevel}
                      </span>
                    )}

                    {/* Customer Rating */}
                    <button
                      type="button"
                      onClick={() => openRatingModal(item)}
                      className="rating-pill-btn"
                      title="Click to view ratings or leave a review"
                    >
                      <Star size={12} fill="#ffd700" color="#ffd700" />
                      <span>{item.averageRating ? item.averageRating.toFixed(1) : 'New'}</span>
                      <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({item.ratingCount || 0})</span>
                    </button>
                  </div>

                  {/* Card Bottom: Add to Cart Action */}
                  <div className="dish-card-footer">
                    {quantityInCart > 0 ? (
                      <div className="dish-stepper-wrap">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, quantityInCart - 1)}
                          className="stepper-btn minus"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-qty-text">{quantityInCart}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, quantityInCart + 1)}
                          className="stepper-btn plus"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'} dish-add-btn`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={15} /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={15} /> Add to Order
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Mobile Cart Summary Bar (When cart has items and on mobile) */}
      {cartCount > 0 && (
        <div className="floating-mobile-cart-bar fade-in">
          <Link to="/cart" className="floating-cart-btn-inner">
            <div className="floating-cart-left">
              <div className="floating-cart-icon-box">
                <ShoppingCart size={18} />
                <span className="floating-cart-badge">{cartCount}</span>
              </div>
              <div className="floating-cart-info">
                <span className="floating-cart-items-text">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                <span className="floating-cart-total-text">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="floating-cart-cta">
              <span>View Cart</span>
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      )}

      {/* Rating & Review Modal */}
      {ratingModalItem && (
        <div
          className="rating-modal-overlay fade-in"
          onClick={() => setRatingModalItem(null)}
        >
          <div
            className="glass-panel rating-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rating-modal-header">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Dish Feedback
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '2px' }}>
                  Rate {ratingModalItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRatingModalItem(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {ratingError && (
              <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                {ratingError}
              </div>
            )}

            {ratingSuccess && (
              <div style={{ color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                {ratingSuccess}
              </div>
            )}

            <form onSubmit={handleRatingSubmit}>
              {/* Star Rating selector */}
              <div style={{ textAlign: 'center', margin: '14px 0 18px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Select your star rating:
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
                          transform: isFilled ? 'scale(1.18)' : 'scale(1)',
                          transition: 'transform 0.15s ease'
                        }}
                        aria-label={`Rate ${star} star`}
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
                <span style={{ fontSize: '0.84rem', color: '#ffd700', fontWeight: 'bold', marginTop: '6px', display: 'block' }}>
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
                <label className="form-label" htmlFor="review-comment">Review / Feedback (Optional)</label>
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setRatingModalItem(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '9px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ratingSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '9px' }}
                >
                  {ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Responsive Styles */}
      <style>{`
        .cuisine-tabs-strip {
          display: flex;
          justifyContent: center;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 2px 14px;
          margin-bottom: 12px;
          -webkit-overflow-scrolling: touch;
        }

        .cuisine-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 40px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid var(--border-color);
          background-color: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          white-space: nowrap;
          flex-shrink: 0;
          min-height: 40px;
        }

        .cuisine-pill-btn.active {
          border-color: var(--color-gold);
          background-color: var(--color-gold);
          color: #0b0c10;
          box-shadow: 0 4px 16px rgba(197, 168, 128, 0.25);
        }

        .cuisine-pill-count {
          font-size: 0.72rem;
          padding: 1px 7px;
          border-radius: 12px;
          background-color: rgba(255, 255, 255, 0.08);
          color: inherit;
        }

        .cuisine-pill-btn.active .cuisine-pill-count {
          background-color: #0b0c10;
          color: var(--color-gold);
        }

        .menu-controls-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          width: 100%;
        }

        .search-and-diet-row {
          display: flex;
          justifyContent: center;
          align-items: center;
          gap: 12px;
          width: 100%;
          max-width: 760px;
          flex-wrap: wrap;
        }

        .search-input-box {
          position: relative;
          flex: 1 1 280px;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input-field {
          padding-left: 42px;
          padding-right: 36px;
          border-radius: 30px;
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          font-size: 0.9rem;
          height: 42px;
        }

        .search-clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }

        .dietary-filter-group {
          display: flex;
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 30px;
          border: 1px solid var(--border-color);
          padding: 3px;
          flex-shrink: 0;
        }

        .diet-btn {
          padding: 6px 12px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 600;
          background: transparent;
          color: var(--text-muted);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .diet-btn.active {
          background-color: var(--border-color);
          color: #ffffff;
        }

        .diet-btn.veg.active {
          background-color: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
        }

        .diet-btn.non-veg.active {
          background-color: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
        }

        .diet-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .diet-dot.veg { background-color: #2ecc71; }
        .diet-dot.non-veg { background-color: #e74c3c; }

        .category-scroll-strip {
          display: flex;
          justifyContent: center;
          gap: 8px;
          overflow-x: auto;
          max-width: 100%;
          padding: 2px 4px 6px;
          -webkit-overflow-scrolling: touch;
        }

        .category-pill {
          padding: 6px 14px;
          font-size: 0.78rem;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
          background-color: transparent;
          color: var(--color-gold);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .category-pill.active {
          background-color: var(--color-gold);
          color: #0b0c10;
          border-color: var(--color-gold);
          box-shadow: 0 2px 10px rgba(197, 168, 128, 0.2);
        }

        .menu-dishes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
          gap: 20px;
        }

        .dish-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          background-color: rgba(20, 24, 33, 0.75);
          backdrop-filter: blur(12px);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .dish-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-color-active);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
        }

        .dish-image-wrap {
          height: 180px;
          width: 100%;
          position: relative;
          overflow: hidden;
          background-color: #12161f;
        }

        .dish-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .dish-card:hover .dish-card-img {
          transform: scale(1.06);
        }

        .dish-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(11, 12, 16, 0.9) 0%, rgba(11, 12, 16, 0.15) 50%, rgba(11, 12, 16, 0.4) 100%);
        }

        .dish-top-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cuisine-badge-pill {
          background-color: rgba(11, 12, 16, 0.85);
          backdrop-filter: blur(6px);
          color: var(--color-gold);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          padding: 3px 8px;
          border-radius: 16px;
          border: 1px solid rgba(197, 168, 128, 0.3);
        }

        .diet-indicator-box {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(11, 12, 16, 0.85);
          backdrop-filter: blur(4px);
        }

        .diet-indicator-box.veg { border: 1.5px solid #2ecc71; }
        .diet-indicator-box.non-veg { border: 1.5px solid #e74c3c; }

        .diet-indicator-center {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .diet-indicator-center.veg { background-color: #2ecc71; }
        .diet-indicator-center.non-veg { background-color: #e74c3c; }

        .dish-category-tag {
          position: absolute;
          bottom: 8px;
          left: 10px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--color-gold);
          font-weight: 700;
          background: rgba(11, 12, 16, 0.8);
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid rgba(197, 168, 128, 0.2);
        }

        .dish-card-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .dish-title-row {
          display: flex;
          justifyContent: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 6px;
        }

        .dish-name {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .dish-price {
          color: var(--color-gold);
          font-weight: 800;
          font-size: 1.05rem;
          flex-shrink: 0;
        }

        .dish-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .dish-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 12px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .spice-level-tag {
          font-size: 0.7rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .spice-level-tag.mild { color: #52c41a; background: rgba(82, 196, 26, 0.1); }
        .spice-level-tag.medium { color: #faad14; background: rgba(250, 173, 20, 0.1); }
        .spice-level-tag.spicy, .spice-level-tag.hot { color: #ff4d4f; background: rgba(255, 77, 79, 0.1); }

        .rating-pill-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 215, 0, 0.25);
          color: #ffd700;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .rating-pill-btn:hover {
          background: rgba(255, 215, 0, 0.15);
        }

        .dish-card-footer {
          margin-top: auto;
        }

        .dish-add-btn {
          width: 100%;
          padding: 9px 12px;
          font-size: 0.85rem;
          gap: 6px;
          border-radius: 8px;
        }

        .dish-stepper-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color-active);
          border-radius: 8px;
          padding: 3px 6px;
        }

        .stepper-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .stepper-btn:hover {
          background: rgba(197, 168, 128, 0.15);
        }

        .stepper-qty-text {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        /* Floating Mobile Cart Bar */
        .floating-mobile-cart-bar {
          display: none;
          position: fixed;
          bottom: 68px;
          left: 16px;
          right: 16px;
          z-index: 890;
          max-width: 500px;
          margin: 0 auto;
        }

        .floating-cart-btn-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #c5a880 0%, #a68456 100%);
          color: #0b0c10;
          padding: 10px 16px;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(197, 168, 128, 0.4);
          text-decoration: none;
          font-weight: 700;
        }

        .floating-cart-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .floating-cart-icon-box {
          position: relative;
          background: rgba(11, 12, 16, 0.15);
          padding: 6px;
          border-radius: 8px;
          display: flex;
        }

        .floating-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #0b0c10;
          color: var(--color-gold);
          font-size: 0.6rem;
          font-weight: 800;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-cart-info {
          display: flex;
          flex-direction: column;
        }

        .floating-cart-items-text {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.85;
        }

        .floating-cart-total-text {
          font-size: 1rem;
          line-height: 1.1;
        }

        .floating-cart-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          background: rgba(11, 12, 16, 0.12);
          padding: 6px 12px;
          border-radius: 8px;
        }

        /* Rating Modal */
        .rating-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .rating-modal-content {
          max-width: 440px;
          width: 100%;
          padding: 22px;
          border-radius: 16px;
          border: 1px solid var(--border-color-active);
          background: rgba(20, 24, 33, 0.96);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
          max-height: 90vh;
          overflow-y: auto;
        }

        .rating-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 12px;
          margin-bottom: 14px;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }

        @media (max-width: 768px) {
          .floating-mobile-cart-bar {
            display: block !important;
          }
          .cuisine-tabs-strip {
            justify-content: flex-start;
          }
          .category-scroll-strip {
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .search-and-diet-row {
            flex-direction: column;
            align-items: stretch;
          }
          .dietary-filter-group {
            width: 100%;
            justify-content: space-around;
          }
          .diet-btn {
            flex: 1;
            justify-content: center;
          }
          .menu-dishes-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu;
