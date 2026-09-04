import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, UtensilsCrossed, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="fade-in" style={{ padding: '0 24px 60px' }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        height: '75vh',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(rgba(11, 12, 16, 0.45), rgba(11, 12, 16, 0.92)), url("/hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
        border: '1px solid var(--border-color)'
      }}>
        <span style={{
          color: 'var(--color-gold)',
          fontSize: '0.9rem',
          letterSpacing: '6px',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>ROYAL INDIAN & ORIENTAL CHINESE DINING</span>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '3.8rem',
          fontWeight: 'bold',
          lineHeight: '1.2',
          marginBottom: '24px',
          maxWidth: '850px',
          textShadow: '0 4px 16px rgba(0,0,0,0.6)'
        }}>
          Savor the Rich Flavors of <span style={{ color: 'var(--color-gold)' }}>Indian & Chinese</span> Gastronomy
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-primary)',
          opacity: 0.9,
          maxWidth: '640px',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          From slow-simmered tandoori gravies & royal aromatic biryanis to high-heat wok-tossed noodles & dim sums, experience fine culinary perfection.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/menu" className="btn btn-primary" style={{ gap: '8px', padding: '14px 32px' }}>
            Explore Our Menu <ArrowRight size={18} />
          </Link>
          <Link to="/book" className="btn btn-secondary" style={{ padding: '14px 32px' }}>
            Book A Table
          </Link>
        </div>
      </div>

      {/* Philosophy Section */}
      <div style={{
        marginTop: '80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '50px',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem', letterSpacing: '4px', fontWeight: 600, textTransform: 'uppercase' }}>OUR HERITAGE</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '12px', marginBottom: '24px' }}>
            Two Great Culinary Traditions, One Exquisite Destination
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.02rem', lineHeight: '1.6' }}>
            We bring together the rich, royal spice heritage of authentic <strong>North & South Indian cooking</strong> alongside the vibrant fire, aromatic sauces, and delicate craftsmanship of <strong>Sichuan & Cantonese Chinese cuisine</strong>.
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.02rem', lineHeight: '1.6' }}>
            Every masala is freshly hand-pounded, each tandoori skewer is roasted over charcoal, and every wok creation is tossed over live flames for unmatched authentic taste.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ color: 'var(--color-gold)' }}><Star size={24} /></div>
              <div>
                <h4 style={{ fontWeight: 600 }}>Master Chefs</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Specialized Indian & Chinese culinary maestros.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ color: 'var(--color-gold)' }}><Sparkles size={24} /></div>
              <div>
                <h4 style={{ fontWeight: 600 }}>Fresh Ingredients</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Authentic spices, aromatic herbs & fresh produce.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chefs specials panel */}
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.6rem' }}>Chef's Signatures</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Highlights</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Item 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&auto=format&fit=crop&q=80"
                  alt="Butter Chicken"
                  style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Butter Chicken <span style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🇮🇳 Indian</span>
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tandoori chicken in silky tomato-butter cashew gravy.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.15rem' }}>$22.00</span>
            </div>

            {/* Item 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=200&auto=format&fit=crop&q=80"
                  alt="Dim Sum"
                  style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Steamed Dim Sum <span style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🥢 Chinese</span>
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>Handcrafted dumplings served with spicy Sichuan dip.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.15rem' }}>$13.50</span>
            </div>

            {/* Item 3 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80"
                  alt="Biryani"
                  style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Hyderabadi Dum Biryani <span style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🇮🇳 Indian</span>
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>Slow dum basmati rice, saffron, mint & roasted spices.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.15rem' }}>$24.00</span>
            </div>

            {/* Item 4 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&auto=format&fit=crop&q=80"
                  alt="Kung Pao Chicken"
                  style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Kung Pao Chicken <span style={{ fontSize: '0.7rem', padding: '2px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🥢 Chinese</span>
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>Sichuan chili stir-fry, roasted peanuts & scallions.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.15rem' }}>$21.00</span>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link to="/menu" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
              View Full 26+ Dish Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
