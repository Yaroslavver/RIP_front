import { FC } from 'react';
import { Form, Button } from 'react-bootstrap';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchInput: FC<Props> = ({ value, onChange, onSearch, placeholder = 'Поиск по названию...' }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button type="submit" variant="primary">Найти</Button>
    </Form>
  );
};

export default SearchInput;