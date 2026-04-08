import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { mockElectrolytes } from '../mock/electrolytes';

interface CartItem {
  id: number;
  volume: number;
  comment?: string;
}

interface CartPageProps {
  cartItems: CartItem[];
  onDeleteConcentration?: () => void;
  concentrationId?: number;
}

const CartPage = ({ cartItems, onDeleteConcentration, concentrationId = 1 }: CartPageProps) => {
  const handleDelete = () => {
    if (onDeleteConcentration) onDeleteConcentration();
    alert('Заявка удалена (mock)');
  };

  const itemsWithDetails = cartItems.map(item => {
    const electrolyte = mockElectrolytes.find(e => e.id === item.id);
    return {
      ...item,
      name: electrolyte?.name || '',
      concentration: electrolyte?.concentration || 0,
      ions: electrolyte?.ions || '',
      image: electrolyte?.image || '/DefaultImage.jpg',
    };
  });

  return (
    <>
      <Header />
      <Breadcrumbs />
      <div className="container">
        <div className="calc-info">
          <h2>Расчёт смеси №{concentrationId}</h2>
          <p><strong>Концентрация в растворе:</strong> [H⁺] = 0.045 моль/л, pH = 1.35</p>
          <p><strong>Описание:</strong> Смешивание выбранных растворов</p>
          <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
            <button type="submit" className="btn delete-btn">Удалить заявку</button>
          </form>
        </div>
        <div className="calc-head">
          <span> </span>
          <span>Раствор</span>
          <span>Концентрация (М)</span>
          <span>Ионы</span>
          <span>Объём (мл)</span>
        </div>
        {itemsWithDetails.length === 0 ? (
          <p>В заявке нет растворов</p>
        ) : (
          itemsWithDetails.map((item, idx) => (
            <div className="calc-card" key={idx}>
              <img src={item.image} alt={item.name} className="item-icon" />
              <span>{item.name}</span>
              <span>{item.concentration}</span>
              <span>{item.ions}</span>
              <span><input type="number" className="m-field" value={item.volume} readOnly /></span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CartPage;