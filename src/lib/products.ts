import type { Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return image ? { url: image.imageUrl, hint: image.imageHint } : { url: 'https://picsum.photos/seed/default/400/400', hint: 'product' };
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Estiércol de Vaca',
    description: 'Estiércol de vaca de alta calidad, perfecto para enriquecer el suelo de su jardín y huerto. 100% orgánico y compostado.',
    price: 15.99,
    stock: 100,
    imageUrl: getImageUrl('estiercol-vaca').url,
    imageHint: getImageUrl('estiercol-vaca').hint,
  },
  {
    id: '2',
    name: 'Estiércol de Caballo',
    description: 'Potente estiércol de caballo, ideal para plantas que requieren un alto contenido de nitrógeno. Cuidadosamente seleccionado.',
    price: 18.50,
    stock: 75,
    imageUrl: getImageUrl('estiercol-caballo').url,
    imageHint: getImageUrl('estiercol-caballo').hint,
  },
  {
    id: '3',
    name: 'Estiércol de Gallina (Gallinaza)',
    description: 'Gallinaza rica en nutrientes, una opción excelente para acelerar el crecimiento de sus cultivos. Olor controlado.',
    price: 12.00,
    stock: 120,
    imageUrl: getImageUrl('estiercol-gallina').url,
    imageHint: getImageUrl('estiercol-gallina').hint,
  },
  {
    id: '4',
    name: 'Humus de Lombriz',
    description: 'El "oro negro" de la jardinería. Humus de lombriz puro para una fertilización natural y efectiva, mejorando la estructura del suelo.',
    price: 25.00,
    stock: 50,
    imageUrl: getImageUrl('humus-lombriz').url,
    imageHint: getImageUrl('humus-lombriz').hint,
  },
  {
    id: '5',
    name: 'Compost Orgánico Premium',
    description: 'Mezcla de compost premium, balanceado para todo tipo de plantas. Enriquece la vida microbiana de tu tierra.',
    price: 20.00,
    stock: 80,
    imageUrl: getImageUrl('compost-organico').url,
    imageHint: getImageUrl('compost-organico').hint,
  },
];
