export const ROUTES = {
  HOME: '/',
  ELECTROLYTE: '/electrolyte/:id',
  CART: '/cart',
} as const;

export const ROUTE_LABELS = {
  [ROUTES.HOME]: 'Главная',
  [ROUTES.CART]: 'Корзина',
};