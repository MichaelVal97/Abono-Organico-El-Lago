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
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63666.61664468654!2d-74.40878984366606!3d4.338575971488463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f05606626609b%3A0x6247926130456158!2sFusagasug%C3%A1%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v1716928345678!5m2!1ses!2sco"
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
