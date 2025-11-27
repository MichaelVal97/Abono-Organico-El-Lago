export default function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/40">
      <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-2xl font-bold text-primary mb-2">Abono Orgánico El Lago</p>
          <p className="text-base text-muted-foreground font-slogan italic">
            "La mejor inversión para tu tierra."
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Abono Orgánico El Lago. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
