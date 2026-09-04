import React, { useState, useEffect, useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Trash2, Edit, Plus, Check, X, RefreshCw, Image, Eye } from 'lucide-react';

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
      const response = await fetch('http://localhost:5000/api/menu');
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
      const response = await fetch('http://localhost:5000/api/menu', {
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
      const response = await fetch(`http://localhost:5000/api/menu/${editingId}`, {
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
      const response = await fetch(`http://localhost:5000/api/menu/${itemId}`, {
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
      const response = await fetch(`http://localhost:5000/api/menu/${item._id}`, {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-gold)' }}>Menu Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Configure dishes on the digital menu. Add descriptions, prices, categories, cuisine types, and photos.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Cuisine quick filter */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {['All', 'Indian', 'Chinese'].map(c => (
              <button
                key={c}
                onClick={() => setFilterCuisine(c)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
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
            <button onClick={() => { clearForm(); setShowAddForm(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Add Menu Item
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ color: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
          {success}
        </div>
      )}

      {/* Add / Edit Form Overlay Panel */}
      {(showAddForm || editingId) && (
        <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.4rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            {editingId ? 'Modify Menu Item' : 'New Indian / Chinese Menu Item'}
          </h3>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="dish-name">Item Name</label>
                  <input
                    id="dish-name"
                    type="text"
                    required
                    placeholder="e.g. Butter Chicken or Kung Pao Chicken"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="dish-desc">Description</label>
                  <textarea
                    id="dish-desc"
                    required
                    rows={4}
                    placeholder="Provide authentic description of spices, cooking techniques, and sides."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dish-cuisine">Cuisine Tradition</label>
                    <select
                      id="dish-cuisine"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="form-input"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="Indian">🇮🇳 Indian Cuisine</option>
                      <option value="Chinese">🥢 Chinese Cuisine</option>
                      <option value="Continental">Continental</option>
                      <option value="Fusion">Fusion</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="dish-spice">Spice Level</label>
                    <select
                      id="dish-spice"
                      value={spiceLevel}
                      onChange={(e) => setSpiceLevel(e.target.value)}
                      className="form-input"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="None">None</option>
                      <option value="Mild">🌿 Mild</option>
                      <option value="Medium">🌶️ Medium</option>
                      <option value="Spicy">🌶️🌶️ Hot / Spicy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dish-price">Price ($)</label>
                    <input
                      id="dish-price"
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 22.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dish-category">Category</label>
                    <select
                      id="dish-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-input"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      {['Starters', 'Main Course', 'Desserts', 'Beverages', 'Sides'].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dish-image">Food Image URL</label>
                  <input
                    id="dish-image"
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Live Image Preview */}
                {imageUrl && (
                  <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#000' }}>
                      <img src={imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/60?text=Error'} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>Live Image Preview</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
                    <input
                      id="dish-veg"
                      type="checkbox"
                      checked={isVeg}
                      onChange={(e) => setIsVeg(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="dish-veg" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                      {isVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
                    </label>
                  </div>

                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
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

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={editingId ? handleCancelEdit : () => setShowAddForm(false)}
                className="btn btn-secondary"
                style={{ padding: '10px 24px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                {editingId ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--color-gold)' }} />
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No dishes found in this category.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '10px', borderRadius: '14px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Cuisine</th>
                <th>Category</th>
                <th>Dish Name</th>
                <th>Price</th>
                <th>Diet / Spice</th>
                <th>Availability</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{
                      width: '46px',
                      height: '46px',
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
                          <Image size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: item.cuisine === 'Chinese' ? '#e74c3c' : 'var(--color-gold)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {item.cuisine === 'Chinese' ? '🥢 Chinese' : '🇮🇳 Indian'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.description}
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1rem' }}>
                    ${item.price.toFixed(2)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.isVeg ? '#2ecc71' : '#e74c3c'
                      }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
                        gap: '6px',
                        color: item.isAvailable ? '#2ecc71' : '#e74c3c',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      {item.isAvailable ? <Check size={16} /> : <X size={16} />}
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(230,57,70,0.1)', borderColor: 'rgba(230,57,70,0.3)', color: '#e63946' }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1.5s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminMenu;
