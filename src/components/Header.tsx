import { Link } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetDraftState, resetRequestFilters } from '../store/requestsSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(resetDraftState());
    dispatch(resetRequestFilters());
    dispatch(logoutUser());
  };

  return (
    <header>
      <Link to="/" className="home-btn">
        <svg width="32" height="32" fill="#232B46" viewBox="0 0 16 16" aria-label="На главную">
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
        </svg>
      </Link>
      <nav className="top-nav">
        <Link to="/">Растворы</Link>
        {user && <Link to="/requests">Концентрации</Link>}
        {user ? (
          <>
            <span className="user-login">{user.login}{user.isModerator ? ' / модератор' : ''}</span>
            <button className="link-button" onClick={handleLogout} disabled={loading}>Выход</button>
          </>
        ) : (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
