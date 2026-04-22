import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Electrolyte } from '../mock/electrolytes';
import { getElectrolytes, getCartInfo } from '../api/electrolytesApi';
import { useElectrolyteSearch, ProcessedElectrolyte } from '../hooks/useElectrolyteSearch';
import Header from '../components/Header';

const HomePage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [backendElectrolytes, setBackendElectrolytes] = useState<Electrolyte[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [draftId, setDraftId] = useState(0);
  const [isBackendAlive, setIsBackendAlive] = useState(true);

  // CLIP хук – передаём актуальные данные (либо из бэка, либо пустой массив пока)
  const {
    items: searchResults,
    ready: clipReady,
    progress: clipProgress,
    imageEmbedding,
    searchByImage,
    resetSearch,
  } = useElectrolyteSearch(backendElectrolytes);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Загрузка данных с бэкенда
  useEffect(() => {
    const loadData = async () => {
      const data = await getElectrolytes(searchQuery);
      setBackendElectrolytes(data);
      const cart = await getCartInfo();
      setCartCount(cart.count);
      setDraftId(cart.draft_id);
      setIsBackendAlive(true);
    };
    loadData().catch(() => setIsBackendAlive(false));
    
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleAddToCart = (id: number, volume: number) => {
    //alert(`Добавлено: раствор ${id}, объём ${volume} мл`);
    setCartCount(prev => prev + 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      searchByImage(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    resetSearch();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Отображаемые элементы:
  // Если есть эмбеддинг картинки – показываем результаты поиска (searchResults),
  // иначе – показываем отфильтрованные по тексту backendElectrolytes
  const displayItems = imageEmbedding
    ? searchResults.filter(item => item.isVisible)
    : backendElectrolytes.map(e => ({ ...e, score: 0, isVisible: true } as ProcessedElectrolyte));

  return (
    <>
      <Header />
      <div className="search-cart">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Поиск по названию..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8z"/>
              <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
            </svg>
          </span>
        )}
      </div>

      {/* Блок CLIP-поиска */}
      <div className="clip-search" style={{ maxWidth: '900px', margin: '16px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <button
            className="btn"
            style={{ background: '#232B46', color: '#fff' }}
            onClick={() => fileInputRef.current?.click()}
            disabled={!clipReady}
          >
            {clipReady ? 'Загрузить фото для поиска' : 'Загрузка модели...'}
          </button>
          {!clipReady && (
            <div style={{ background: '#eee', borderRadius: '8px', padding: '4px 12px' }}>
              Прогресс: {Math.round(clipProgress)}%
            </div>
          )}
          {selectedImage && (
            <button className="btn" style={{ background: '#d9534f', color: '#fff' }} onClick={handleClearImage}>
              Сбросить
            </button>
          )}
        </div>
        {selectedImage && (
          <div style={{ marginTop: '12px' }}>
            <img src={selectedImage} alt="preview" style={{ maxHeight: '100px', borderRadius: '8px' }} />
          </div>
        )}
        {imageEmbedding && (
          <div className="small text-muted" style={{ marginTop: '8px' }}>
            Результаты поиска (порог 0.4, топ-5)
          </div>
        )}
      </div>

      <div className="container">
        <div className="cards-grid">
          {displayItems.map(electrolyte => (
            <div className="card" key={electrolyte.id}>
              <Link to={`/electrolyte/${electrolyte.id}`}>
                <img src={electrolyte.image || '/DefaultImage.jpg'} alt={electrolyte.name} />
              </Link>
              <div className="card-body">
                <h3><Link to={`/electrolyte/${electrolyte.id}`}>{electrolyte.name}</Link></h3>
                <p>Концентрация: {electrolyte.concentration} М</p>
                <p className="ions">Ионы: {electrolyte.ions}</p>
                {/* Если это результат поиска по картинке – показываем процент схожести */}
                {'score' in electrolyte && (electrolyte as ProcessedElectrolyte).score > 0 && (
                  <p className="small text-success">Схожесть: {Math.round((electrolyte as ProcessedElectrolyte).score * 100)}%</p>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const volume = Number(formData.get('volume'));
                    if (volume > 0) handleAddToCart(electrolyte.id, volume);
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
          {displayItems.length === 0 && <p>Ничего не найдено</p>}
        </div>
      </div>
    </>
  );
};

export default HomePage;
