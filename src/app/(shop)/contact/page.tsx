import LocationMap from '@/components/common/LocationMap';
import ContactSection from '@/components/common/ContactSection';

export default function ContactPage() {
    return (
        <div className="container py-8 flex flex-col gap-12">
            <ContactSection />
            <LocationMap />
        </div>
    );
}
