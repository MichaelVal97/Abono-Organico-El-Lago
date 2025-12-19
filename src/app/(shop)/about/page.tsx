import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LocationMap from '@/components/common/LocationMap';

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-gradient">
                        Sobre Nosotros
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Cultivando un futuro más verde y sostenible para el campo colombiano.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-primary/5 border-none shadow-none">
                        <CardContent className="p-8 space-y-4">
                            <h2 className="text-2xl font-bold font-headline text-primary">Nuestra Misión</h2>
                            <p className="text-foreground/80 leading-relaxed">
                                Proveer abonos orgánicos de la más alta calidad que regeneren los suelos,
                                aumenten la productividad de los cultivos y promuevan prácticas agrícolas
                                sostenibles y respetuosas con el medio ambiente.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-secondary/20 border-none shadow-none">
                        <CardContent className="p-8 space-y-4">
                            <h2 className="text-2xl font-bold font-headline text-primary">Nuestra Visión</h2>
                            <p className="text-foreground/80 leading-relaxed">
                                Ser líderes en la producción y distribución de fertilizantes orgánicos en la región,
                                reconocidos por nuestra innovación, calidad y compromiso con la salud de la tierra
                                y de quienes la cultivan.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src="https://i.postimg.cc/ZqQ750G2/Whats_App_Image_2025_11_27_at_12_15_19.jpg"
                            alt="Nuestro equipo y finca - Abono Orgánico El Lago"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={100}
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold font-headline">Nuestra Historia</h2>
                        <div className="space-y-4 text-foreground/80 leading-relaxed">
                            <p>
                                Abono Orgánico El Lago nació de la pasión por la tierra y la necesidad de encontrar
                                soluciones naturales para la agricultura moderna. Comenzamos como un pequeño proyecto
                                familiar en el corazón del campo, experimentando con diferentes técnicas de compostaje.
                            </p>
                            <p>
                                Con el tiempo, perfeccionamos nuestros procesos, aprendiendo de la naturaleza y
                                combinando conocimientos tradicionales con técnicas modernas. Lo que empezó como
                                una solución para nuestros propios cultivos, pronto se convirtió en una misión para
                                ayudar a otros agricultores a recuperar la vitalidad de sus suelos.
                            </p>
                            <p>
                                Hoy, nos enorgullece ofrecer productos que no solo nutren las plantas, sino que
                                también devuelven la vida a la tierra, asegurando cosechas abundantes y saludables
                                para las generaciones futuras.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Location Section */}
            <LocationMap />
        </div>
    );
}
