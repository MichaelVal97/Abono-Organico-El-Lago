'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhatsAppButton() {
    return (
        <div className="fixed bottom-20 right-4 z-50">
            <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                onClick={() => window.open('https://wa.me/573164160587?text=Hola,%20quisiera%20información%20sobre%20los%20abonos%20orgánicos.', '_blank')}
                title="Chat en WhatsApp"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        </div>
    );
}
