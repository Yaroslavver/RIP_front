import { useParams } from 'react-router-dom';
import { mockElectrolytes } from '../mock/electrolytes';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

interface ElectrolytePageProps {
  onAddToCart: (id: number, volume: number) => void;
}

const ElectrolytePage = ({ onAddToCart }: ElectrolytePageProps) => {
  const { id } = useParams();
  const electrolyte = mockElectrolytes.find(e => e.id === Number(id));

  if (!electrolyte) {
    return <div>Раствор не найден</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const volume = Number(formData.get('volume'));
    if (volume > 0) onAddToCart(electrolyte.id, volume);
  };

  return (
    <>
      <Header />
      <Breadcrumbs />
      <div className="vibe-container">
        <div className="vibe-video-wrapper">
          {electrolyte.video ? (
            <video autoPlay loop muted playsInline className="vibe-video">
              <source src={electrolyte.video} type="video/mp4" />
            </video>
          ) : (
            <div className="vibe-video" style={{ background: '#ccc' }}></div>
          )}
          <div className="vibe-overlay"></div>
        </div>
        <div className="vibe-content">
          <h1 className="vibe-title">{electrolyte.name}</h1>
          <div className="vibe-details">
            <div className="vibe-card">
              <span className="vibe-label">Концентрация</span>
              <span className="vibe-value">{electrolyte.concentration} моль/л</span>
            </div>
            <div className="vibe-card">
              <span className="vibe-label">pH</span>
              <span className="vibe-value">≈ {electrolyte.ph}</span>
            </div>
            <div className="vibe-card">
              <span className="vibe-label">Ионы</span>
              <span className="vibe-value">{electrolyte.ions}</span>
            </div>
          </div>
          <div className="vibe-description">
            <p><strong>Описание:</strong> {electrolyte.description}</p>
            <p><strong>Формула диссоциации:</strong> {electrolyte.name} → {electrolyte.ions}</p>
          </div>
          <form onSubmit={handleSubmit} className="add-form">
            <input type="hidden" name="electrolyte_id" value={electrolyte.id} />
            <input type="number" name="volume" placeholder="Объём (мл)" required min={1} />
            <button type="submit" className="btn">Добавить в расчёт</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ElectrolytePage;