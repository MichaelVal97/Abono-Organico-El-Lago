import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Leaf, Recycle, Sun, Droplets } from 'lucide-react';

export default function ProcessPage() {
    const steps = [
        {
            icon: Recycle,
            title: "1. Selección de Materia Prima",
            description: "Recolectamos cuidadosamente los mejores residuos orgánicos (estiércol, restos vegetales) asegurando que estén libres de contaminantes químicos."
        },
        {
            icon: Sun,
            title: "2. Compostaje Controlado",
            description: "La materia prima se somete a un proceso de descomposición aeróbica controlada. Monitoreamos temperatura y humedad para eliminar patógenos y semillas de malezas."
        },
        {
            icon: Droplets,
            title: "3. Maduración y Estabilización",
            description: "El compost se deja madurar durante semanas. Aquí es donde los nutrientes se estabilizan y se forman los ácidos húmicos y fúlvicos esenciales."
        },
        {
            icon: Leaf,
            title: "4. Tamizado y Empacado",
            description: "El abono final se tamiza para obtener una textura fina y uniforme, y se empaca listo para nutrir tus cultivos."
        }
    ];

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-gradient">
                        Nuestro Proceso
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Transformamos residuos orgánicos en vida para tu suelo a través de un proceso
                        riguroso y natural.
                    </p>
                </div>

                {/* Process Steps */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div key={index} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Timeline Dot (Desktop) */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-4 border-primary items-center justify-center z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 w-full md:w-1/2">
                                        <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-primary/10">
                                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                                <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
                                                    <Icon className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Spacer for the other side */}
                                    <div className="hidden md:block flex-1" />

                                    {/* Mobile Arrow */}
                                    {index < steps.length - 1 && (
                                        <div className="md:hidden text-muted-foreground/50">
                                            <ArrowRight className="w-6 h-6 rotate-90" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center bg-muted/30 rounded-3xl p-12 space-y-6">
                    <h2 className="text-3xl font-bold font-headline">¿Listo para mejorar tu suelo?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Descubre la diferencia que un abono procesado con calidad puede hacer en tus cultivos.
                    </p>
                    {/* You might want to link back to products here, but keeping it simple for now */}
                </div>

            </div>
        </div>
    );
}
