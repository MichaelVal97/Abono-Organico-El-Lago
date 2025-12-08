import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function LocationMap() {
    return (
        <section className="container py-12 md:py-16 space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold font-headline">Nuestra Ubicación</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Visítanos en nuestra finca en el corazón de Fusagasugá, Cundinamarca.
                </p>
            </div>

            <Card className="overflow-hidden border-none shadow-xl">
                <CardContent className="p-0 aspect-video md:aspect-[21/9] w-full relative bg-muted">
                    <iframe
                        src="https://maps.google.com/maps?q=4.321889,-74.412278&hl=es&z=15&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                    />
                </CardContent>
            </Card>
        </section>
    );
}
