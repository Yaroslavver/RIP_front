import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { loginRequest } from '../api/authApi';
import { authRequestFailed, authRequestStarted, authSucceeded } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadCartInfo } from '../store/requestsSlice';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      dispatch(loadCartInfo());
      navigate('/');
    }
  }, [dispatch, navigate, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(authRequestStarted());
    try {
      const response = await loginRequest(login, password);
      dispatch(authSucceeded({ token: response.data.access_token, login }));
    } catch {
      dispatch(authRequestFailed('Не удалось выполнить вход'));
    }
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Вход</h1>
          {error && <div className="notice error">{error}</div>}
          <input value={login} onChange={(event) => setLogin(event.target.value)} placeholder="Логин" required />
          <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Пароль" type="password" required />
          <button className="btn" type="submit" disabled={loading}>Войти</button>
          <Link to="/register">Создать аккаунт</Link>
        </form>
      </main>
    </>
  );
};

export default LoginPage;
