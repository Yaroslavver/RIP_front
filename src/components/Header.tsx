import { useState } from 'react';
import { Link } from 'react-router-dom';
import { logoutRequest } from '../api/authApi';
import { GUEST_ONLY } from '../config/runtime';
import { authRequestStarted, logoutSucceeded } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetDraftState, resetRequestFilters } from '../store/requestsSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { token, user, loading } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(authRequestStarted());
    if (token) {
      await logoutRequest(token).catch(() => undefined);
    }
    dispatch(resetDraftState());
    dispatch(resetRequestFilters());
    dispatch(logoutSucceeded());
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header>
      <Link to="/" className="home-btn" onClick={closeMenu}>
        <svg width="32" height="32" fill="#232B46" viewBox="0 0 16 16" aria-label="На главную">
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
        </svg>
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Открыть меню"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={`top-nav${isMenuOpen ? ' open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Растворы</Link>
        {user && !GUEST_ONLY && <Link to="/requests" onClick={closeMenu}>Концентрации</Link>}
        {GUEST_ONLY ? (
          <span className="user-login">гостевой режим</span>
        ) : user ? (
          <>
            <span className="user-login">{user.login}{user.isModerator ? ' / модератор' : ''}</span>
            <button className="link-button" onClick={handleLogout} disabled={loading}>Выход</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Вход</Link>
            <Link to="/register" onClick={closeMenu}>Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
