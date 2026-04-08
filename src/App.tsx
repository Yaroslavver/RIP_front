import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import ElectrolytePage from './pages/ElectrolytePage';
import CartPage from './pages/CartPage';
import './style.css';

interface CartItem {
  id: number;
  volume: number;
  comment?: string;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (id: number, volume: number) => {
    setCartItems(prev => {
      // проверяем, есть ли уже такой раствор
      const existing = prev.find(item => item.id === id);
      if (existing) {
        // обновляем объём (можно и суммировать, но по заданию пока просто обновим)
        return prev.map(item =>
          item.id === id ? { ...item, volume } : item
        );
      }
      return [...prev, { id, volume, comment: '' }];
    });
    alert(`Раствор добавлен в заявку (объём ${volume} мл)`);
  };

  const cartCount = cartItems.length;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cartCount={cartCount}
              onAddToCart={addToCart}
              draftId={1}
            />
          }
        />
        <Route
          path="/electrolyte/:id"
          element={<ElectrolytePage onAddToCart={addToCart} />}
        />
        <Route
          path="/concentration/:id"
          element={
            <CartPage
              cartItems={cartItems}
              concentrationId={1}
              onDeleteConcentration={() => setCartItems([])}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;