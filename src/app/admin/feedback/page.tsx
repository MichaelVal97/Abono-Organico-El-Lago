import { FeedbackSummaryForm } from "@/components/feedback/FeedbackSummaryForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function FeedbackPage() {
  return (
    <div className="bg-muted/40 min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Panel de Administrador</h1>
            <Link href="/" className="text-sm hover:underline">Volver a la tienda</Link>
        </div>
      </header>
      <main className="container py-12">
        <FeedbackSummaryForm />
      </main>
    </div>
  );
}
