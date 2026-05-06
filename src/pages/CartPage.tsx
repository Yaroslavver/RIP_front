import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import {
  deleteConcentrationRequest,
  deleteRequestItem,
  formConcentrationRequest,
  isDraftStatus,
  loadConcentrationRequest,
  statusLabel,
  updateRequestItem,
} from '../store/requestsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const CartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { current, loading, error } = useAppSelector((state) => state.requests);
  const { user } = useAppSelector((state) => state.auth);
  const requestId = Number(id);
  const concentration = current.concentration;
  const canEditDraft = Boolean(user && isDraftStatus(concentration?.status));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (requestId) dispatch(loadConcentrationRequest(requestId));
  }, [dispatch, navigate, requestId, user]);

  const handleUpdateItem = (event: React.FormEvent<HTMLFormElement>, itemId: number) => {
    event.preventDefault();
    const volume = Number(new FormData(event.currentTarget).get('volume'));
    dispatch(updateRequestItem({ requestId, itemId, volume }));
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
              <p><strong>Результат:</strong> {concentration.result || 'будет рассчитан при формировании'}</p>
              <div className="request-actions">
                <button className="btn" onClick={() => dispatch(formConcentrationRequest(requestId))} disabled={!canEditDraft || loading || current.items.length === 0}>Сформировать</button>
                <button className="btn delete-btn" onClick={handleDeleteRequest} disabled={!user || loading}>Удалить концентрацию</button>
                <Link className="btn secondary" to="/requests">К списку</Link>
              </div>
            </section>

            <div className="calc-head request-grid">
              <span> </span>
              <span>Раствор</span>
              <span>Ионы</span>
              <span>Объём мл</span>
              <span>Действия</span>
            </div>
            {current.items.length === 0 ? (
              <p>В концентрации пока нет растворов.</p>
            ) : (
              current.items.map((item) => {
                const electrolyte = item.electrolyte ?? item.Electrolyte;
                return (
                  <form className="calc-card request-grid" key={item.id} onSubmit={(event) => handleUpdateItem(event, item.id)}>
                    <img src={electrolyte?.image || '/DefaultImage.jpg'} alt={electrolyte?.name ?? ''} className="item-icon" />
                    <span>{electrolyte?.name ?? `Раствор #${item.electrolyte_id}`}</span>
                    <span>{electrolyte?.ions ?? '-'}</span>
                    <input className="m-field" type="number" name="volume" defaultValue={item.volume} min={1} readOnly={!canEditDraft} />
                    <span className="row-actions">
                      <button className="btn" type="submit" disabled={!canEditDraft || loading}>Изменить</button>
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
