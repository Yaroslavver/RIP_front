# Лабораторная 8: что показывать

## Redux-фильтр услуг

Фильтр услуг хранится в Redux Toolkit:

- `src/store/servicesSlice.ts`: поле `search`, action `setServicesSearch`.
- `src/pages/HomePage.tsx`: input берет начальное значение из Redux, поэтому после перехода на "Подробнее" и возврата строка поиска сохраняется.

## Адаптивность

Основные значения находятся в `src/style.css`:

- Desktop `>= 901px`: `.cards-grid { grid-template-columns: repeat(3, minmax(240px, 1fr)); }`.
- Tablet `561-900px`: 2 колонки карточек `repeat(2, minmax(220px, 1fr))`.
- Mobile `<= 560px`: 1 колонка карточек, формы и кнопки растягиваются в одну колонку.
- Таблица заявок получает горизонтальный скролл через `.requests-table { overflow-x: auto; }`.

Три адаптивные страницы: список растворов `/`, подробная страница `/electrolyte/:id`, страница заявки `/concentration/:id`.

## GitHub Pages и PWA

1. Скопировать `.env.pages.example` в `.env.pages`.
2. В `.env.pages` заменить `VITE_APP_BASE=/electrolyte-app/` на имя своего репозитория.
3. Собрать: `npm run build:pages`.
4. Если библиотека не установлена: `npm install -D gh-pages`.
5. Опубликовать: `npm run deploy`.

PWA-файлы:

- `public/manifest.webmanifest`
- `public/sw.js`
- регистрация service worker в `src/main.tsx`

На GitHub Pages приложение работает по HTTPS. API на Pages недоступен, поэтому список растворов падает на mock-данные.

## Tauri

Гостевой режим включается в `.env.tauri` через `VITE_GUEST_ONLY=true`.

Чтобы подключить собранный Tauri к Go API по локальной сети:

1. Узнать IP компьютера с бэкендом: `ipconfig`.
2. В `.env.tauri` указать `VITE_API_ORIGIN=http://<IP>:8080`.
3. Убедиться, что Go API запущен на `0.0.0.0:8080`, а firewall пропускает порт.
4. Установить Tauri, если еще не установлен: `npm install -D @tauri-apps/cli @tauri-apps/api`.
5. Проверить dev: `npm run tauri dev`.
6. Собрать native build: `npm run tauri build`.

Для Wireshark: фильтр `tcp.port == 8080`, открыть собранный Tauri, перейти на список растворов, выбрать пакет GET `/api/electrolytes`, посмотреть `Src Port`.

## Deployment Diagram

```mermaid
flowchart LR
    Phone[Телефон\nPWA] -- HTTPS --> Pages[GitHub Pages\nstatic React build\nmock fallback]
    Browser[Браузер ПК\nReact dev/preview] -- HTTP/HTTPS :3000 --> Vite[Vite static server]
    Tauri[Tauri desktop\nWebView guest mode] -- HTTP :8080 --> API[Go Gin API]
    Vite -- proxy /api\nHTTP :8080 --> API
    API -- SQL :5432 --> DB[(PostgreSQL)]
    API -- HTTP :9000 --> Minio[(MinIO images/video)]
    API -- TCP :6379 --> Redis[(Redis JWT blacklist)]
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Черновик
    Черновик --> Сформирована: PUT /concentrations/:id/formed
    Черновик --> Удалена: DELETE /concentrations/:id
    Сформирована --> Завершена: PUT /concentrations/:id/finish
    Сформирована --> Отклонена: PUT /concentrations/:id/reject
    Сформирована --> Удалена: DELETE /concentrations/:id
    Завершена --> [*]
    Отклонена --> [*]
    Удалена --> [*]
```

## Use Case Diagram

```mermaid
flowchart LR
    Guest[Гость]
    User[Пользователь]
    Moderator[Модератор]

    Guest --> UC1[Просмотреть список растворов]
    Guest --> UC2[Фильтровать растворы]
    Guest --> UC3[Открыть подробности раствора]
    Guest --> UC4[Установить PWA]

    User --> UC5[Войти/выйти]
    User --> UC6[Добавить раствор в черновик]
    User --> UC7[Изменить объем м-м]
    User --> UC8[Заполнить описание раствора]
    User --> UC9[Сформировать заявку]
    User --> UC10[Просмотреть свои заявки]

    Moderator --> UC11[Просмотреть все заявки]
    Moderator --> UC12[Фильтровать по дате и статусу]
    Moderator --> UC13[Завершить заявку]
    Moderator --> UC14[Отклонить заявку]
```
