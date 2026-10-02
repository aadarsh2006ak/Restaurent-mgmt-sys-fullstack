import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import CartSlideNotification from './components/CartSlideNotification';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CartPage from './pages/CartPage';
import BookingPage from './pages/BookingPage';
import OrderStatus from './pages/OrderStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Navbar />
            <CartSlideNotification />
            <main style={{ flex: 1, padding: '16px 0 0' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/book" element={<BookingPage />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderStatus />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <MobileBottomNav />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
