import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="fade-in page-wrapper">
      {/* Hero Section */}
      <div
        className="hero-banner"
        style={{
          position: 'relative',
          minHeight: '72vh',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(11, 12, 16, 0.5), rgba(11, 12, 16, 0.94)), url("/hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '48px 20px',
          border: '1px solid var(--border-color)'
        }}
      >
        <span
          style={{
            color: 'var(--color-gold)',
            fontSize: 'clamp(0.72rem, 1.8vw, 0.9rem)',
            letterSpacing: 'clamp(2px, 0.8vw, 6px)',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}
        >
          ROYAL INDIAN & ORIENTAL CHINESE DINING
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '20px',
            maxWidth: '850px',
            textShadow: '0 4px 16px rgba(0,0,0,0.6)'
          }}
        >
          Savor the Rich Flavors of <span style={{ color: 'var(--color-gold)' }}>Indian & Chinese</span> Gastronomy
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.92rem, 2vw, 1.15rem)',
            color: 'var(--text-primary)',
            opacity: 0.9,
            maxWidth: '640px',
            marginBottom: '36px',
            lineHeight: '1.6'
          }}
        >
          From slow-simmered tandoori gravies & royal aromatic biryanis to high-heat wok-tossed noodles & dim sums, experience fine culinary perfection.
        </p>

        <div className="hero-btn-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/menu" className="btn btn-primary" style={{ gap: '8px', padding: '14px 28px' }}>
            Explore Our Menu <ArrowRight size={18} />
          </Link>
          <Link to="/book" className="btn btn-secondary" style={{ padding: '14px 28px' }}>
            Book A Table
          </Link>
        </div>
      </div>

      {/* Philosophy Section */}
      <div
        className="philosophy-grid"
        style={{
          marginTop: '60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ color: 'var(--color-gold)', fontSize: '0.82rem', letterSpacing: '3px', fontWeight: 600, textTransform: 'uppercase' }}>
            OUR HERITAGE
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)', marginTop: '10px', marginBottom: '20px' }}>
            Two Great Culinary Traditions, One Exquisite Destination
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '18px', fontSize: '0.98rem', lineHeight: '1.6' }}>
            We bring together the rich, royal spice heritage of authentic <strong>North & South Indian cooking</strong> alongside the vibrant fire, aromatic sauces, and delicate craftsmanship of <strong>Sichuan & Cantonese Chinese cuisine</strong>.
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.98rem', lineHeight: '1.6' }}>
            Every masala is freshly hand-pounded, each tandoori skewer is roasted over charcoal, and every wok creation is tossed over live flames for unmatched authentic taste.
          </p>
          <div className="heritage-badges" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--color-gold)', flexShrink: 0 }}><Star size={22} /></div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Master Chefs</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Specialized Indian & Chinese culinary maestros.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--color-gold)', flexShrink: 0 }}><Sparkles size={22} /></div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Fresh Spices</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Authentic spices, aromatic herbs & fresh produce.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chefs Signatures Panel */}
        <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 36px)', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.5rem' }}>Chef's Signatures</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Highlights</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Item 1 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '1 1 200px' }}>
                <img
                  src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&auto=format&fit=crop&q=80"
                  alt="Butter Chicken"
                  style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Butter Chicken <span style={{ fontSize: '0.68rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🇮🇳 Indian</span>
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tandoori chicken in silky tomato-butter cashew gravy.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>$22.00</span>
            </div>

            {/* Item 2 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '1 1 200px' }}>
                <img
                  src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=200&auto=format&fit=crop&q=80"
                  alt="Dim Sum"
                  style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Steamed Dim Sum <span style={{ fontSize: '0.68rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🥢 Chinese</span>
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Handcrafted dumplings served with spicy Sichuan dip.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>$13.50</span>
            </div>

            {/* Item 3 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '1 1 200px' }}>
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80"
                  alt="Biryani"
                  style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Hyderabadi Dum Biryani <span style={{ fontSize: '0.68rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🇮🇳 Indian</span>
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Slow dum basmati rice, saffron, mint & roasted spices.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>$24.00</span>
            </div>

            {/* Item 4 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: '1 1 200px' }}>
                <img
                  src="https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&auto=format&fit=crop&q=80"
                  alt="Kung Pao Chicken"
                  style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Kung Pao Chicken <span style={{ fontSize: '0.68rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🥢 Chinese</span>
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Sichuan chili stir-fry, roasted peanuts & scallions.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>$21.00</span>
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/menu" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}>
              View Full Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .hero-btn-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-btn-group .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
