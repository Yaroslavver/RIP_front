import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { getElectrolyteById } from '../api/servicesApi';
import { addElectrolyteToDraft } from '../store/requestsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Electrolyte } from '../types';

const ElectrolytePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const requestLoading = useAppSelector((state) => state.requests.loading);
  const [electrolyte, setElectrolyte] = useState<Electrolyte | null>(null);

  useEffect(() => {
    if (id) getElectrolyteById(Number(id)).then(setElectrolyte);
  }, [id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !electrolyte) return;
    dispatch(addElectrolyteToDraft({
      electrolyte_id: electrolyte.id,
      volume: Number(new FormData(event.currentTarget).get('volume')),
    }));
  };

  if (!electrolyte) return <><Header /><div className="container">Загрузка...</div></>;

  const pageUrl = `${window.location.origin}/electrolyte/${electrolyte.id}`;

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
            <div className="vibe-video" style={{ background: '#ccc' }} />
          )}
          <div className="vibe-overlay" />
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
            <form className="add-form inline-add" onSubmit={handleSubmit}>
              <input type="number" name="volume" placeholder="Объем, мл" min={1} required disabled={!user || requestLoading} />
              <button type="submit" className="btn" disabled={!user || requestLoading}>Добавить</button>
            </form>
          </div>
        </div>
      </div>

      <div className="qr-block">
        <QRCodeCanvas value={pageUrl} size={150} />
      </div>
    </>
  );
};

export default ElectrolytePage;
