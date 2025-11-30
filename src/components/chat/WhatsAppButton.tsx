'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhatsAppButton() {
    const phoneNumber = '14155238886'; // Twilio Sandbox Number
    const message = 'Hola, quisiera información sobre los abonos orgánicos.';

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed bottom-20 right-4 z-50">
            <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                onClick={handleWhatsAppClick}
                title="Chat en WhatsApp"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        </div>
    );
}
