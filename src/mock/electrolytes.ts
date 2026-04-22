export interface Electrolyte {
  id: number;
  name: string;
  concentration: number;
  ions: string;
  ph: number;
  description: string;
  image: string;
  video: string;
  description_en: string;
  embedding?: number[];     // для хранения эмбеддинга текста
}

export const mockElectrolytes: Electrolyte[] = [
  {
    id: 1,
    name: 'Соляная кислота (HCl)',
    concentration: 0.1,
    ions: 'H⁺, Cl⁻',
    ph: 1.0,
    description: 'Сильная одноосновная кислота, полностью диссоциирует в воде. Используется в лабораториях для регулирования pH и в промышленности.',
    image: '',//'https://ftorsoli.ru/upload/iblock/b59/pxzkmj98pmo42vjooet21jbwmfopb5td.png',
    video: 'https://static.vecteezy.com/system/resources/previews/075/251/744/mp4/scientific-demonstration-of-dye-dispersion-in-transparent-flask-under-controlled-conditions-video.mp4',
    description_en: 'A bottle with strong monoprotic acid, fully dissociates in water. Used for pH regulation.',
  },
  {
    id: 2,
    name: 'Гидроксид натрия (NaOH)',
    concentration: 0.05,
    ions: 'Na⁺, OH⁻',
    ph: 12.7,
    description: 'Сильное основание, щёлочь. Полностью диссоциирует.',
    image: '',//'https://avatars.mds.yandex.net/get-mpic/1374520/img_id5765033109127691625.jpeg/orig',
    video: 'https://static.vecteezy.com/system/resources/previews/051/094/246/mp4/chemistry-concept-clip-a-man-in-gloves-who-tests-a-pink-liquid-for-an-experiment-video.mp4',
    description_en: 'Strong base, fully dissociates to hydroxide ions. Used in neutralization.',
  },
  {
    id: 3,
    name: 'Уксусная кислота (CH₃COOH)',
    concentration: 0.1,
    ions: 'CH₃COO⁻, H⁺',
    ph: 2.9,
    description: 'Слабая органическая кислота, частично диссоциирует.',
    image: '',//'https://main-cdn.sbermegamarket.ru/big2/hlr-system/516/439/497/323/205/8/100031005553b0.jpg',
    video: '',
    description_en: 'A bottle with weak organic acid, partially dissociates. Common in buffer solutions.',
  },
  {
    id: 4,
    name: 'Хлорид натрия (NaCl)',
    concentration: 0.2,
    ions: 'Na⁺, Cl⁻',
    ph: 7.0,
    description: 'Соль, раствор нейтральный.',
    image: '',
    video: '',
    description_en: 'A bottle with neutral salt from strong acid and base. Does not affect pH.',
  },
];