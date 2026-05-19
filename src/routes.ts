export const ROUTES = {
  HOME: '/',
  ELECTROLYTE: '/electrolyte/:id',
  CART: '/concentration/:id',
  REQUESTS: '/requests',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const ROUTE_LABELS = {
  [ROUTES.HOME]: 'Главная',
  [ROUTES.CART]: 'Корзина',
};
