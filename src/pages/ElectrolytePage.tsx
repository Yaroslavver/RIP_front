import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { getElectrolyteById } from '../api/servicesApi';
import { GUEST_ONLY } from '../config/runtime';
import { addElectrolyteToDraft } from '../store/requestsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getAssetUrl } from '../utils/assets';
import type { Electrolyte } from '../types';

const ElectrolytePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const requestLoading = useAppSelector((state) => state.requests.loading);
  const [electrolyte, setElectrolyte] = useState<Electrolyte | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
    if (id) getElectrolyteById(Number(id)).then(setElectrolyte);
  }, [id]);

  const handleAdd = () => {
    if (!user || !electrolyte) return;
    dispatch(addElectrolyteToDraft({ electrolyte_id: electrolyte.id }));
  };

  if (!electrolyte) return <><Header /><div className="container">Загрузка...</div></>;

  const pageUrl = `${window.location.origin}/electrolyte/${electrolyte.id}`;

  return (
    <>
      <Header />
      <Breadcrumbs />
      <div className="vibe-container">
        <div className="vibe-video-wrapper">
          {electrolyte.video && !videoFailed ? (
            <video autoPlay loop muted playsInline className="vibe-video" onError={() => setVideoFailed(true)}>
              <source src={getAssetUrl(electrolyte.video)} type="video/mp4" />
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
            {!GUEST_ONLY && <button className="btn" type="button" onClick={handleAdd} disabled={!user || requestLoading}>Добавить</button>}
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
