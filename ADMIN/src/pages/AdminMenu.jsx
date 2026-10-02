import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config/api';
import { Trash2, Edit, Plus, Check, X, RefreshCw, Image, Sparkles } from 'lucide-react';

const AdminMenu = () => {
  const { adminToken } = useContext(AdminAuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('All');

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [cuisine, setCuisine] = useState('Indian');
  const [imageUrl, setImageUrl] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [isAvailable, setIsAvailable] = useState(true);

  // Toggle show add form
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu`);
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.data);
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

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCategory(item.category);
    setCuisine(item.cuisine || 'Indian');
    setImageUrl(item.imageUrl || '');
    setIsVeg(item.isVeg !== undefined ? item.isVeg : true);
    setSpiceLevel(item.spiceLevel || 'Medium');
    setIsAvailable(item.isAvailable);
    setShowAddForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Main Course');
    setCuisine('Indian');
    setImageUrl('');
    setIsVeg(true);
    setSpiceLevel('Medium');
    setIsAvailable(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          category,
          cuisine,
          imageUrl,
          isVeg,
          spiceLevel,
          isAvailable
        })
      });
      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) => [...prev, data.data]);
        setSuccess('Menu item created successfully!');
        clearForm();
        setShowAddForm(false);
      } else {
        setError(data.message || 'Failed to create menu item');
      }
    } catch (err) {
      setError('Connection error. Could not create menu item.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          category,
          cuisine,
          imageUrl,
          isVeg,
          spiceLevel,
          isAvailable
        })
      });
      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) =>
          prev.map((item) => (item._id === editingId ? data.data : item))
        );
        setSuccess('Menu item updated successfully!');
        setEditingId(null);
        clearForm();
      } else {
        setError(data.message || 'Failed to update menu item');
      }
    } catch (err) {
      setError('Connection error. Could not update menu item.');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
        setSuccess('Menu item deleted.');
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Connection error. Could not delete.');
    }
  };

  const toggleAvailabilityDirect = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isAvailable: !item.isAvailable })
      });
      const data = await response.json();
      if (data.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isAvailable: data.data.isAvailable } : i))
        );
      }
    } catch (err) {
      console.error('Error toggling availability', err);
    }
  };

  const displayedItems = filterCuisine === 'All'
    ? menuItems
    : menuItems.filter(item => item.cuisine === filterCuisine);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--color-gold)' }}>
            Menu Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Configure dishes, prices, Indian & Chinese cuisine tags, photos, and availability.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Cuisine quick filter */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {['All', 'Indian', 'Chinese'].map(c => (
              <button
                key={c}
                onClick={() => setFilterCuisine(c)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: filterCuisine === c ? 'var(--color-gold)' : 'transparent',
                  color: filterCuisine === c ? '#0b0c10' : 'var(--text-muted)'
                }}
              >
                {c === 'Indian' ? '🇮🇳 Indian' : c === 'Chinese' ? '🥢 Chinese' : 'All'}
              </button>
            ))}
          </div>

          {!editingId && !showAddForm && (
            <button onClick={() => { clearForm(); setShowAddForm(true); }} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Plus size={14} /> Add Item
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.86rem', marginBottom: '16px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.86rem', marginBottom: '16px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
          {success}
        </div>
      )}

      {/* Add / Edit Form Panel */}
      {(showAddForm || editingId) && (
        <div className="glass-panel" style={{ padding: 'clamp(16px, 4vw, 24px)', marginBottom: '24px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.25rem' }}>
              {editingId ? 'Edit Dish Details' : 'Add New Culinary Dish'}
            </h3>
            <button
              type="button"
              onClick={editingId ? handleCancelEdit : () => setShowAddForm(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="admin-menu-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Left Form Column */}
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="menu-name">Dish Name</label>
                  <input
                    id="menu-name"
                    type="text"
                    required
                    placeholder="e.g. Butter Chicken / Sichuan Noodles"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="menu-desc">Description & Flavors</label>
                  <textarea
                    id="menu-desc"
                    required
                    rows={3}
                    placeholder="Describe ingredients, tenderness, spices, and preparation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="menu-cuisine">Cuisine Tradition</label>
                    <select
                      id="menu-cuisine"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="form-input"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="Indian">🇮🇳 Indian Cuisine</option>
                      <option value="Chinese">🥢 Chinese Cuisine</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="menu-cat">Menu Category</label>
                    <select
                      id="menu-cat"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-input"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="Starters">Starters / Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Sides">Sides & Breads</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Form Column */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="menu-price">Price (₹)</label>
                    <input
                      id="menu-price"
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      placeholder="e.g. 350"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="menu-spice">Spice Level</label>
                    <select
                      id="menu-spice"
                      value={spiceLevel}
                      onChange={(e) => setSpiceLevel(e.target.value)}
                      className="form-input"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="Mild">🌿 Mild</option>
                      <option value="Medium">🌶️ Medium</option>
                      <option value="Spicy">🌶️🌶️ Hot / Spicy</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="menu-img">Food Image URL</label>
                  <input
                    id="menu-img"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginBottom: 0, width: 'auto' }}>
                    <input
                      id="dish-veg"
                      type="checkbox"
                      checked={isVeg}
                      onChange={(e) => setIsVeg(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="dish-veg" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                      {isVeg ? '🟢 Vegetarian' : '🔴 Non-Veg'}
                    </label>
                  </div>

                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginBottom: 0, width: 'auto' }}>
                    <input
                      id="dish-avail"
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="dish-avail" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Available</label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={editingId ? handleCancelEdit : () => setShowAddForm(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                {editingId ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu List Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 20px', textAlign: 'center', borderRadius: '14px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No dishes found in this category.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4px', borderRadius: '14px' }}>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Cuisine</th>
                  <th>Category</th>
                  <th>Dish Name</th>
                  <th>Price</th>
                  <th>Diet</th>
                  <th>Stock</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#12161f',
                        border: '1px solid var(--border-color)'
                      }}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Image size={15} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: item.cuisine === 'Chinese' ? '#e74c3c' : 'var(--color-gold)',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        padding: '2px 6px',
                        borderRadius: '6px'
                      }}>
                        {item.cuisine === 'Chinese' ? '🥢 Chinese' : '🇮🇳 Indian'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '0.92rem' }}>
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{
                          display: 'inline-block',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: item.isVeg ? '#2ecc71' : '#e74c3c'
                        }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleAvailabilityDirect(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: item.isAvailable ? '#2ecc71' : '#e74c3c',
                          fontWeight: 600,
                          fontSize: '0.78rem'
                        }}
                      >
                        {item.isAvailable ? <Check size={14} /> : <X size={14} />}
                        {item.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 7px', gap: '2px' }}
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 7px', gap: '2px', backgroundColor: 'rgba(230,57,70,0.1)', borderColor: 'rgba(230,57,70,0.3)', color: '#e63946' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 800px) {
          .admin-menu-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminMenu;
