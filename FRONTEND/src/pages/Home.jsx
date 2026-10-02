import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Utensils, Calendar, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="fade-in page-wrapper">
      {/* Hero Section */}
      <div
        className="hero-banner"
        style={{
          position: 'relative',
          minHeight: 'clamp(380px, 65vh, 600px)',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(11, 12, 16, 0.6), rgba(11, 12, 16, 0.95)), url("/hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(32px, 6vw, 60px) clamp(16px, 4vw, 36px)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-gold)',
            fontSize: 'clamp(0.72rem, 2vw, 0.85rem)',
            letterSpacing: 'clamp(2px, 0.6vw, 5px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '14px',
            backgroundColor: 'rgba(197, 168, 128, 0.1)',
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(197, 168, 128, 0.3)'
          }}
        >
          <Sparkles size={14} /> ROYAL INDIAN & ORIENTAL CHINESE DINING
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.9rem, 5.5vw, 3.8rem)',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '18px',
            maxWidth: '850px',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}
        >
          Savor the Rich Flavors of <span style={{ color: 'var(--color-gold)' }}>Indian & Chinese</span> Gastronomy
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
            color: 'var(--text-primary)',
            opacity: 0.9,
            maxWidth: '640px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}
        >
          From slow-simmered royal tandoori gravies & fragrant biryanis to high-heat wok-tossed noodles & steamed dim sums, experience culinary excellence.
        </p>

        <div className="hero-btn-group" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '440px' }}>
          <Link to="/menu" className="btn btn-primary" style={{ flex: '1 1 180px', gap: '8px', padding: '13px 24px', fontSize: '0.92rem' }}>
            <Utensils size={16} /> Explore Menu <ArrowRight size={16} />
          </Link>
          <Link to="/book" className="btn btn-secondary" style={{ flex: '1 1 180px', gap: '8px', padding: '13px 24px', fontSize: '0.92rem' }}>
            <Calendar size={16} /> Book A Table
          </Link>
        </div>
      </div>

      {/* Philosophy Section */}
      <div
        className="philosophy-grid"
        style={{
          marginTop: 'clamp(40px, 8vw, 64px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(24px, 5vw, 48px)',
          alignItems: 'start'
        }}
      >
        <div>
          <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem', letterSpacing: '3px', fontWeight: 700, textTransform: 'uppercase' }}>
            OUR HERITAGE
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginTop: '8px', marginBottom: '16px', lineHeight: '1.25' }}>
            Two Great Culinary Traditions, One Exquisite Destination
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            We bring together the rich, royal spice heritage of authentic <strong>North & South Indian cooking</strong> alongside the vibrant fire, aromatic sauces, and delicate craftsmanship of <strong>Sichuan & Cantonese Chinese cuisine</strong>.
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Every masala is freshly hand-pounded, each tandoori skewer is roasted over charcoal, and every wok creation is tossed over live flames for unmatched authentic taste.
          </p>
          <div className="heritage-badges" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--color-gold)', flexShrink: 0 }}><Star size={20} /></div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.92rem' }}>Master Chefs</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Specialized Indian & Chinese culinary maestros.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--color-gold)', flexShrink: 0 }}><Sparkles size={20} /></div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.92rem' }}>Fresh Spices</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authentic spices, aromatic herbs & fresh produce.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chefs Signatures Panel */}
        <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 32px)', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', fontSize: '1.4rem' }}>Chef's Signatures</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Highlights</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Item 1 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img
                  src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&auto=format&fit=crop&q=80"
                  alt="Butter Chicken"
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Butter Chicken <span style={{ fontSize: '0.65rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🇮🇳 Indian</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tandoori chicken in rich tomato-butter cashew gravy.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.05rem', flexShrink: 0 }}>₹380.00</span>
            </div>

            {/* Item 2 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img
                  src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=200&auto=format&fit=crop&q=80"
                  alt="Dim Sum"
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Steamed Dim Sum <span style={{ fontSize: '0.65rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🥢 Chinese</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Handcrafted dumplings served with spicy Sichuan dip.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.05rem', flexShrink: 0 }}>₹260.00</span>
            </div>

            {/* Item 3 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80"
                  alt="Biryani"
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Hyderabadi Dum Biryani <span style={{ fontSize: '0.65rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🇮🇳 Indian</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Slow dum basmati rice, saffron, mint & roasted spices.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.05rem', flexShrink: 0 }}>₹420.00</span>
            </div>

            {/* Item 4 */}
            <div className="signature-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img
                  src="https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&auto=format&fit=crop&q=80"
                  alt="Kung Pao Chicken"
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Kung Pao Chicken <span style={{ fontSize: '0.65rem', padding: '1px 6px', border: '1px solid var(--color-gold)', borderRadius: '4px', color: 'var(--color-gold)' }}>🥢 Chinese</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sichuan chili stir-fry, roasted peanuts & scallions.</p>
                </div>
              </div>
              <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.05rem', flexShrink: 0 }}>₹360.00</span>
            </div>
          </div>

          <div style={{ marginTop: '18px', textAlign: 'center' }}>
            <Link to="/menu" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}>
              View Full Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
