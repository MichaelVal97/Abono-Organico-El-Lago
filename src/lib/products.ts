import type { Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return image ? { url: image.imageUrl, hint: image.imageHint } : { url: 'https://picsum.photos/seed/default/400/400', hint: 'product' };
};

export const products: Product[] = [
  {
    id: 'dd223092-e575-4f59-a2fe-443c19f236d7',
    name: 'Bulto de 50 kg de compost',
    description: 'Abono orgánico de alta calidad en presentación de 50kg. Ideal para todo tipo de cultivos, mejorando la estructura del suelo y aportando nutrientes esenciales.',
    price: 25000,
    stock: 100,
    imageUrl: 'https://i.postimg.cc/XVjTxCQq/Whats-App-Image-2025-11-27-at-13-14-22-(2).jpg',
    imageHint: 'product',
    category: 'PLAN DE FERTILIZACIÓN',
    tags: ['ABONO', 'FERTILIZACIÓN', 'ORGÁNICO', '50KG'],
    priceRange: '1 Bulto - 50Kg',
    images: [
      'https://i.postimg.cc/XVjTxCQq/Whats-App-Image-2025-11-27-at-13-14-22-(2).jpg',
      'https://i.postimg.cc/69WDzvYQ/Whats-App-Image-2025-11-27-at-13-14-21.jpg',
      'https://i.postimg.cc/dq5gfVx0/Whats-App-Image-2025-11-27-at-16-25-53.jpg'
    ]
  },
];
