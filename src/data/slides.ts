export interface Slide {
  slug: string;
  title: string;
  event: string;
  date: string;
  description?: string;
  thumbnail?: string;
  pdfPath: string;
  slidevUrl?: string;
}

export const slides: Slide[] = [
  {
    slug: 'shaking-interaction',
    title: 'あの震えるインタラクションを実装したい',
    event: 'React LT会',
    date: '2019-07-03',
    thumbnail: 'thumbnails/20190703_react-lt.png',
    pdfPath: 'slides/20190703_react-lt.pdf',
  },
  {
    slug: 'blitzjs-introduction',
    title: 'Blitz.jsの紹介',
    event: 'iCARE Dev Meetup #15',
    date: '2020-11-18',
    thumbnail: 'thumbnails/20201118_icare-dev-meetup-15.png',
    pdfPath: 'slides/20201118_icare-dev-meetup-15.pdf',
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
    pdfPath: 'slides/20220408_react-native-tips.pdf',
    slidevUrl: 'https://react-native-tips.vercel.app',
  },
];

export const sortedSlides = (): Slide[] =>
  [...slides].sort((a, b) => b.date.localeCompare(a.date));

export const findSlide = (slug: string): Slide | undefined =>
  slides.find((s) => s.slug === slug);
