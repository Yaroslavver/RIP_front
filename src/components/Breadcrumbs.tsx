import { Link, useLocation } from 'react-router-dom';
import { mockElectrolytes } from '../mock/electrolytes';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Не показываем хлебные крошки на главной
  if (location.pathname === '/') return null;

  const getCrumbLabel = (path: string, index: number, fullPath: string): string => {
    if (path === 'electrolyte') return 'Раствор';
    if (path === 'concentration') return 'Заявка';
    if (path === 'cart') return 'Корзина'; // запасной вариант
    // Если это детальная страница раствора (число)
    if (!isNaN(Number(path)) && fullPath.includes('/electrolyte/')) {
      const id = Number(path);
      const electrolyte = mockElectrolytes.find(e => e.id === id);
      return electrolyte ? electrolyte.name : `Раствор №${id}`;
    }
    if (!isNaN(Number(path)) && fullPath.includes('/concentration/')) {
      return `Расчёт №${path}`;
    }
    return path;
  };

  // Собираем пути для каждого уровня
  const breadcrumbs = pathnames.map((_, idx) => {
    const url = `/${pathnames.slice(0, idx + 1).join('/')}`;
    const label = getCrumbLabel(pathnames[idx], idx, location.pathname);
    return { url, label, isLast: idx === pathnames.length - 1 };
  });

  return (
    <nav aria-label="breadcrumb" style={{ padding: '0.75rem 1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '16px auto', maxWidth: '900px' }}>
      <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '8px', flexWrap: 'wrap' }}>
        <li>
          <Link to="/" style={{ textDecoration: 'none', color: '#232B46' }}>Растворы</Link>
        </li>
        {breadcrumbs.map((crumb, idx) => (
          <li key={idx} style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: '#6c757d' }}>/</span>
            {crumb.isLast ? (
              <span style={{ color: '#232B46', fontWeight: 'bold' }}>{crumb.label}</span>
            ) : (
              <Link to={crumb.url} style={{ textDecoration: 'none', color: '#232B46' }}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;