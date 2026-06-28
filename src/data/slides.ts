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
    slug: 'react-native-tips',
    title: 'React Native ことはじめ',
    event: '社内勉強会 in airCloset',
    date: '2022-04-08',
    pdfPath: 'slides/20220408_react-native-tips.pdf',
  },
];

export const sortedSlides = (): Slide[] =>
  [...slides].sort((a, b) => b.date.localeCompare(a.date));

export const findSlide = (slug: string): Slide | undefined =>
  slides.find((s) => s.slug === slug);
