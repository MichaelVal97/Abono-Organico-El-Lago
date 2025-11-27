export default function Footer() {
  return (
    <footer className="bg-secondary/50">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-lg font-bold text-primary">MierdaCar</p>
          <p className="text-sm text-muted-foreground font-slogan">
            "La mejor inversión para tu tierra."
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MierdaCar. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
