import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CartPage from './pages/CartPage';
import ElectrolytePage from './pages/ElectrolytePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequestsPage from './pages/RequestsPage';
import { APP_BASENAME } from './config/runtime';
import './style.css';

function App() {
  return (
    <BrowserRouter basename={APP_BASENAME}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/electrolyte/:id" element={<ElectrolytePage />} />
        <Route path="/concentration/:id" element={<CartPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
