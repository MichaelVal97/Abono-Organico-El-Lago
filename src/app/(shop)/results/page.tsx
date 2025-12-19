'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function ResultsPage() {
    const tomatoImages = [
        {
            id: 1,
            url: 'https://i.postimg.cc/B6T7q9ZK/Whats_App_Image_2025_12_07_at_21_00_13.jpg',
            alt: 'Tomate sembrado sobre compost - Vista 1'
        },
        {
            id: 2,
            url: 'https://i.postimg.cc/V6qZYQst/Whats_App_Image_2025_12_07_at_21_00_02.jpg',
            alt: 'Tomate sembrado sobre compost - Vista 2'
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
                        Resultados Comprobados
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Descubre los resultados reales de nuestro compost orgánico en diferentes cultivos.
                        La mejor inversión para tu tierra, con resultados visibles.
                    </p>
                </div>

                {/* Tomate Section with Carousel */}
                <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                                        Tomate Sembrado sobre Compost
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        Resultados excepcionales en el cultivo de tomate utilizando nuestro compost orgánico como base de siembra.
                                        Desarrollo óptimo con el uso exclusivo de compost orgánico El Lago.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Carousel className="w-full max-w-4xl mx-auto">
                                <CarouselContent>
                                    {tomatoImages.map((image) => (
                                        <CarouselItem key={image.id}>
                                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                                                    quality={100}
                                                    priority
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                            <p className="text-center text-sm text-muted-foreground mt-4">
                                Usa las flechas para ver más imágenes
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Coffee Section */}
                <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                                        Planta de Café de Año y Medio
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        Planta de café de año y medio solo con compost como plan de fertilización.
                                        Crecimiento saludable y vigoroso sin necesidad de fertilizantes químicos.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="relative aspect-[4/3] w-full max-w-4xl mx-auto overflow-hidden rounded-lg bg-muted">
                                <Image
                                    src="https://i.postimg.cc/x89x8xqT/Whats_App_Image_2025_12_07_at_21_02_05.jpg"
                                    alt="Planta de café de año y medio con compost"
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                                    quality={100}
                                    priority
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center bg-muted/50 rounded-lg p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        ¿Quieres obtener estos resultados?
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Nuestro compost orgánico ha demostrado resultados excepcionales en diversos cultivos.
                        Únete a los agricultores que ya confían en la calidad de Abono Orgánico El Lago.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/#products"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Ver Productos
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Contáctanos
                        </a>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-lg bg-muted/30">
                        <div className="text-4xl font-bold text-primary mb-2">100%</div>
                        <div className="text-sm text-muted-foreground">Orgánico</div>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-muted/30">
                        <div className="text-4xl font-bold text-primary mb-2">--</div>
                        <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-muted/30">
                        <div className="text-4xl font-bold text-primary mb-2">5+</div>
                        <div className="text-sm text-muted-foreground">Años de Experiencia</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
