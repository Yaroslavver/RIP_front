import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockElectrolytes, Electrolyte } from '../mock/electrolytes';
import Header from '../components/Header';

interface HomePageProps {
  cartCount: number;
  onAddToCart: (id: number, volume: number) => void;
  draftId?: number;
}

const HomePage = ({ cartCount, onAddToCart, draftId }: HomePageProps) => {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Electrolyte[]>(mockElectrolytes);

  useEffect(() => {
    const filteredList = mockElectrolytes.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // фильтрация уже происходит через useEffect, но форма отправляет GET запрос? В React не нужно.
    // Для имитации оригинального поведения просто ничего не делаем.
  };

  return (
    <>
      <Header />
      <div className="search-cart">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Найти</button>
        </form>
        {cartCount > 0 ? (
          <Link to={`/concentration/${draftId}`} className="cart-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-droplet-half" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
              <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
            </svg>
            <span className="cart-count">{cartCount}</span>
          </Link>
        ) : (
          <span className="cart-icon inactive">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-droplet-half" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
              <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
            </svg>
          </span>
        )}
      </div>

      <div className="container">
        <div className="cards-grid">
          {filtered.map(electrolyte => (
            <div className="card" key={electrolyte.id}>
              <Link to={`/electrolyte/${electrolyte.id}`}>
                <img src={electrolyte.image || '/DefaultImage.jpg'} alt={electrolyte.name} />
              </Link>
              <div className="card-body">
                <h3><Link to={`/electrolyte/${electrolyte.id}`}>{electrolyte.name}</Link></h3>
                <p>Концентрация: {electrolyte.concentration} М</p>
                <p className="ions">Ионы: {electrolyte.ions}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const volume = Number(formData.get('volume'));
                    if (volume > 0) onAddToCart(electrolyte.id, volume);
                  }}
                  className="add-form"
                >
                  <input type="hidden" name="electrolyte_id" value={electrolyte.id} />
                  <input type="number" name="volume" placeholder="Объём (мл)" required min={1} />
                  <button type="submit" className="btn">Добавить</button>
                </form>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p>Ничего не найдено</p>}
        </div>
      </div>
    </>
  );
};

export default HomePage;