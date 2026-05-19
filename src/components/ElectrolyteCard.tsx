import { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Electrolyte } from '../mock/electrolytes';
import { useNavigate } from 'react-router-dom';

// изображение по умолчанию (положите в public/DefaultImage.jpg или импортируйте)
const DEFAULT_IMAGE = '/DefaultImage.jpg';

interface Props {
  electrolyte: Electrolyte;
  onAddToCart?: (id: number) => void;
}

const ElectrolyteCard: FC<Props> = ({ electrolyte, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/electrolyte/${electrolyte.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // чтобы не переходить на детальную страницу
    if (onAddToCart) onAddToCart(electrolyte.id);
  };

  return (
    <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      <Card.Img
        variant="top"
        src={electrolyte.image || DEFAULT_IMAGE}
        height={200}
        style={{ objectFit: 'contain', padding: '1rem' }}
      />
      <Card.Body>
        <Card.Title>{electrolyte.name}</Card.Title>
        <Card.Text>
          Концентрация: {electrolyte.concentration} M<br />
          Ионы: {electrolyte.ions}<br />
          pH: {electrolyte.ph}
        </Card.Text>
        <Button variant="success" onClick={handleAddToCart}>Добавить в расчёт</Button>
      </Card.Body>
    </Card>
  );
};

export default ElectrolyteCard;