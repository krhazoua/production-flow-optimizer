/**
 * En-tête de l'application
 * Titre et navigation principale
 * 
 * Auteur : Kaouthar Rhazouane
 */

import { Factory, BookOpen, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onShowDocumentation?: () => void;
  onShowAbout?: () => void;
}

export function Header({ onShowDocumentation, onShowAbout }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Factory className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Ordonnancement Industriel
              </h1>
              <p className="text-sm text-muted-foreground">
                Simulation et Optimisation de Production
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={onShowDocumentation}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Documentation</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={onShowAbout}
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">À propos</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
