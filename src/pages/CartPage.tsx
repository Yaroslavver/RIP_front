import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import {
  deleteConcentrationRequest,
  deleteRequestItem,
  formConcentrationRequest,
  isDraftStatus,
  isFormedStatus,
  loadConcentrationRequest,
  statusLabel,
  updateConcentrationDescription,
  updateRequestItem,
} from '../store/requestsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { DEFAULT_IMAGE, getAssetUrl, useDefaultImageOnError } from '../utils/assets';

const CartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { current, loading, error } = useAppSelector((state) => state.requests);
  const { user } = useAppSelector((state) => state.auth);
  const requestId = Number(id);
  const concentration = current.concentration;
  const isCreator = Boolean(user && concentration?.creator_id === user.id);
  const canEditDraft = Boolean(user && isCreator && isDraftStatus(concentration?.status));
  const canDeleteRequest = Boolean(user && isCreator && (isDraftStatus(concentration?.status) || isFormedStatus(concentration?.status)));
  const canSaveDescription = Boolean(
    user &&
    isCreator &&
    (isDraftStatus(concentration?.status) || isFormedStatus(concentration?.status)),
  );
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (requestId) dispatch(loadConcentrationRequest(requestId));
  }, [dispatch, navigate, requestId, user]);

  useEffect(() => {
    setDescription(concentration?.description ?? '');
  }, [concentration?.id, concentration?.description]);

  const handleUpdateItem = (event: React.FormEvent<HTMLFormElement>, itemId: number) => {
    event.preventDefault();
    const volume = Number(new FormData(event.currentTarget).get('volume'));
    dispatch(updateRequestItem({ requestId, itemId, volume }));
  };

  const handleSaveRequestFields = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateConcentrationDescription({ requestId, description }));
  };

  const handleDeleteRequest = async () => {
    await dispatch(deleteConcentrationRequest(requestId));
    navigate('/');
  };

  return (
    <>
      <Header />
      <Breadcrumbs />
      <main className="container">
        {error && <div className="notice error">{error}</div>}
        {!concentration ? (
          <div className="notice">Концентрация не найдена или еще загружается.</div>
        ) : (
          <>
            <section className="calc-info">
              <h2>Концентрация #{concentration.id}</h2>
              <p><strong>Статус:</strong> {statusLabel(concentration.status)}</p>
              <p><strong>Результат:</strong> {concentration.result || 'будет рассчитан при сформировании'}</p>
              <p><strong>Описание раствора:</strong> {concentration.description || 'не заполнено'}</p>

              <form className="description-form" onSubmit={handleSaveRequestFields}>
                <label>
                  Описание раствора
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} disabled={!canSaveDescription || loading} />
                </label>
                <button className="btn" type="submit" disabled={!canSaveDescription || loading}>Сохранить поля заявки</button>
              </form>

              <div className="request-actions">
                <button className="btn" onClick={() => dispatch(formConcentrationRequest(requestId))} disabled={!canEditDraft || loading || current.items.length === 0}>Сформировать</button>
                <button className="btn delete-btn" onClick={handleDeleteRequest} disabled={!canDeleteRequest || loading}>Удалить концентрацию</button>
              </div>
            </section>

            <div className="calc-head request-grid">
              <span> </span>
              <span>Раствор</span>
              <span>Ионы</span>
              <span>Объем мл</span>
              <span>Действия</span>
            </div>
            {current.items.length === 0 ? (
              <p>В концентрации пока нет растворов.</p>
            ) : (
              current.items.map((item) => {
                const electrolyte = item.electrolyte ?? item.Electrolyte;
                return (
                  <form className="calc-card request-grid" key={item.id} onSubmit={(event) => handleUpdateItem(event, item.id)}>
                    <img src={getAssetUrl(electrolyte?.image) || DEFAULT_IMAGE} alt={electrolyte?.name ?? ''} className="item-icon" onError={useDefaultImageOnError} />
                    <span>{electrolyte?.name ?? `Раствор #${item.electrolyte_id}`}</span>
                    <span>{electrolyte?.ions ?? '-'}</span>
                    <input className="m-field" type="number" name="volume" defaultValue={item.volume} min={1} readOnly={!canEditDraft} />
                    <span className="row-actions">
                      <button className="btn" type="submit" disabled={!canEditDraft || loading}>Сохранить</button>
                      <button className="btn delete-btn" type="button" onClick={() => dispatch(deleteRequestItem({ requestId, itemId: item.id }))} disabled={!canEditDraft || loading}>Удалить</button>
                    </span>
                  </form>
                );
              })
            )}
          </>
        )}
      </main>
    </>
  );
};

export default CartPage;
