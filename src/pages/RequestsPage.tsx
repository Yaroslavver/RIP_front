import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {
  STATUS,
  finishConcentrationRequest,
  isFormedStatus,
  loadConcentrationRequests,
  rejectConcentrationRequest,
  setRequestFilters,
  statusLabel,
} from '../store/requestsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const RequestsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { list, filters, loading, error } = useAppSelector((state) => state.requests);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(loadConcentrationRequests());
    const timer = window.setInterval(() => dispatch(loadConcentrationRequests()), 5000);
    return () => window.clearInterval(timer);
  }, [dispatch, navigate, user]);

  const filteredList = filters.creator
    ? list.filter((request) => {
        const creator = request.creator ?? request.Creator;
        return String(creator?.login ?? request.creator_id ?? '').toLowerCase().includes(filters.creator.toLowerCase());
      })
    : list;

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(loadConcentrationRequests());
  };

  return (
    <>
      <Header />
      <main className="container wide">
        <h1>{user?.isModerator ? 'Все концентрации' : 'Мои концентрации'}</h1>
        <form className="filters" onSubmit={applyFilters}>
          <label>Дата с<input type="date" value={filters.from} onChange={(event) => dispatch(setRequestFilters({ from: event.target.value }))} /></label>
          <label>Дата по<input type="date" value={filters.to} onChange={(event) => dispatch(setRequestFilters({ to: event.target.value }))} /></label>
          <label>Статус
            <select value={filters.status} onChange={(event) => dispatch(setRequestFilters({ status: event.target.value }))}>
              <option value="">Все</option>
              <option value={STATUS.formed}>Сформирован</option>
              <option value={STATUS.finished}>Завершен</option>
              <option value={STATUS.rejected}>Отклонен</option>
            </select>
          </label>
          {user?.isModerator && (
            <label>Создатель<input value={filters.creator} onChange={(event) => dispatch(setRequestFilters({ creator: event.target.value }))} placeholder="логин или id" /></label>
          )}
          <button className="btn" type="submit" disabled={loading}>Обновить</button>
        </form>
        {error && <div className="notice error">{error}</div>}
        <div className="requests-table">
          <div className="requests-row head">
            <span>ID</span>
            <span>Дата</span>
            <span>Создатель</span>
            <span>Статус</span>
            <span>Результат</span>
            <span>Действия</span>
          </div>
          {filteredList.map((request) => {
            const creator = request.creator ?? request.Creator;
            return (
              <div className="requests-row" key={request.id}>
                <span>#{request.id}</span>
                <span>{request.created_at ? new Date(request.created_at).toLocaleDateString() : '-'}</span>
                <span>{creator?.login ?? request.creator_id ?? '-'}</span>
                <span>{statusLabel(request.status)}</span>
                <span>{request.result || '-'}</span>
                <span className="row-actions">
                  <Link className="btn" to={`/concentration/${request.id}`}>Открыть</Link>
                  {user?.isModerator && isFormedStatus(request.status) && (
                    <>
                      <button className="btn" onClick={() => dispatch(finishConcentrationRequest(request.id))} disabled={loading}>Завершить</button>
                      <button className="btn delete-btn" onClick={() => dispatch(rejectConcentrationRequest(request.id))} disabled={loading}>Отклонить</button>
                    </>
                  )}
                </span>
              </div>
            );
          })}
          {filteredList.length === 0 && <div className="notice">Концентраций за выбранный период нет.</div>}
        </div>
      </main>
    </>
  );
};

export default RequestsPage;
