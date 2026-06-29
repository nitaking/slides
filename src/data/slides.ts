export interface Slide {
  slug: string;
  title: string;
  event: string;
  date: string;
  description?: string;
  thumbnail?: string;
  pdfPath: string;
  slidevUrl?: string;
  eventUrl?: string;
}

export const slides: Slide[] = [
  {
    slug: 'shaking-interaction',
    title: 'あの震えるインタラクションを実装したい',
    event: 'React LT会',
    date: '2019-07-03',
    thumbnail: 'thumbnails/20190703_react-lt.png',
    pdfPath: 'slides/20190703_react-lt.pdf',
    eventUrl: 'https://informetis.connpass.com/event/133541/',
  },
  {
    slug: 'expo-web-nextjs',
    title: 'Expo WEB × Next.js は実用できるのか？',
    event: 'React Native Meetup #10',
    date: '2020-08-05',
    thumbnail: 'thumbnails/20200805_expo-web-nextjs.png',
    pdfPath: 'slides/20200805_expo-web-nextjs.pdf',
    eventUrl: 'https://react-native-meetup.connpass.com/event/173190/',
  },
  {
    slug: 'blitzjs-introduction',
    title: 'Blitz.jsの紹介',
    event: 'iCARE Dev Meetup #15',
    date: '2020-11-18',
    thumbnail: 'thumbnails/20201118_icare-dev-meetup-15.png',
    pdfPath: 'slides/20201118_icare-dev-meetup-15.pdf',
    eventUrl: 'https://icare.connpass.com/event/192817/',
  },
  {
    slug: 'build-tools-survey',
    title: '最近のビルドツール調べてみた',
    event: '社内LT',
    date: '2021-06-24',
    thumbnail: 'thumbnails/20210624_build-tools-survey.png',
    pdfPath: 'slides/20210624_build-tools-survey.pdf',
  },
  {
    slug: 'react-native-tips',
    title: 'React Native ことはじめ',
    event: '社内勉強会 in airCloset',
    date: '2022-04-08',
    thumbnail: 'thumbnails/20220408_react-native-tips.png',
    pdfPath: 'slides/20220408_react-native-tips.pdf',
    slidevUrl: 'https://react-native-tips.vercel.app',
  },
  {
    slug: 'lt-in-30min',
    title: '人は30分でLT資料を作って発表できるのか',
    event: 'エンジニアの成長を応援する忘年LT大会2023',
    date: '2023-12-19',
    thumbnail: 'thumbnails/20231219_bonenkai-lt-2023.png',
    pdfPath: 'slides/20231219_bonenkai-lt-2023.pdf',
    eventUrl: 'https://engineers.connpass.com/event/298275/',
  },
  {
    slug: 'proxysql-tips',
    title: 'ProxySQL Tips集',
    event: '社内シェア',
    date: '2025-06-29',
    thumbnail: 'thumbnails/20250629_proxysql-tips.png',
    pdfPath: 'slides/20250629_proxysql-tips.pdf',
  },
];

export const sortedSlides = (): Slide[] =>
  [...slides].sort((a, b) => b.date.localeCompare(a.date));

export const findSlide = (slug: string): Slide | undefined =>
  slides.find((s) => s.slug === slug);
