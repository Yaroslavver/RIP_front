import { FC } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

const AppNavbar: FC = () => {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME} className="home-btn">
          {/* Вставьте ваш SVG домика или просто текст */}
          <svg width="32" height="32" fill="#232B46" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/>
          </svg>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to={ROUTES.HOME}>Растворы</Nav.Link>
            <Nav.Link as={Link} to={ROUTES.CART}>Корзина</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;