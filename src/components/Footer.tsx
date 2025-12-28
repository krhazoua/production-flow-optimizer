/**
 * Pied de page de l'application
 * Crédits et informations légales
 * 
 * Auteur : Kaouthar Rhazouane
 */

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Réalisé par</span>
            <span className="text-primary font-medium">Kaouthar Rhazouane</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Projet Académique</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Génie Industriel</span>
            <span className="hidden md:inline">•</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
