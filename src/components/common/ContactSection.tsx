'use client';

import { Mail, Phone, MessageCircle, Instagram, Facebook, Twitter, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactSection() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 font-headline">Contáctanos</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        ¿Tienes dudas o quieres hacer un pedido grande? Estamos aquí para ayudarte.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Email Card */}
                    <div className="flex flex-col items-center justify-center p-8 bg-background rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Correo Electrónico</h3>
                        <p className="text-muted-foreground mb-4">Escríbenos para cotizaciones formales</p>
                        <a href="mailto:abonoellago@gmail.com" className="text-primary font-medium hover:underline text-lg">
                            abonoellago@gmail.com
                        </a>
                    </div>

                    {/* WhatsApp Card */}
                    <div className="flex flex-col items-center justify-center p-8 bg-background rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">WhatsApp / Teléfono</h3>
                        <p className="text-muted-foreground mb-4">Atención inmediata y pedidos</p>
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="flex flex-col items-center gap-2 w-full">
                                <span className="text-lg font-medium">+57 316 416 0587</span>
                                <Button asChild className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full max-w-xs">
                                    <a
                                        href="https://wa.me/573164160587?text=Hola,%20estoy%20interesado%20en%20el%20Abono%20Orgánico"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Chat (+57 316...)
                                    </a>
                                </Button>
                            </div>
                            <div className="flex flex-col items-center gap-2 w-full">
                                <span className="text-lg font-medium">+57 312 378 1848</span>
                                <Button asChild className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full max-w-xs">
                                    <a
                                        href="https://wa.me/573123781848?text=Hola,%20estoy%20interesado%20en%20el%20Abono%20Orgánico"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Chat (+57 312...)
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold mb-6 font-headline">Síguenos en Redes Sociales</h3>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Button
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2 min-w-[160px]"
                        >
                            <a
                                href="https://www.instagram.com/p/DR_KO8ujHUa/?igsh=MWpwMjJzMHE3dDE1Yw=="
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram className="h-5 w-5" />
                                Instagram
                            </a>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 min-w-[160px]"
                        >
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Facebook className="h-5 w-5" />
                                Facebook
                            </a>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            className="bg-blue-400 hover:bg-blue-500 text-white gap-2 min-w-[160px]"
                        >
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Twitter className="h-5 w-5" />
                                Twitter
                            </a>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            className="bg-black hover:bg-gray-800 text-white gap-2 min-w-[160px]"
                        >
                            <a
                                href="https://www.tiktok.com/@abonoorganicoelago?_r=1&_t=ZS-928VmPp6mrH"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Video className="h-5 w-5" />
                                TikTok
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
