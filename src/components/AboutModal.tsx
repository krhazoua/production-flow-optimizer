/**
 * Modal À propos
 * Informations sur le projet et l'auteur
 * 
 * Auteur : Kaouthar Rhazouane
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Factory, GraduationCap, Code2, Target } from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-primary" />
            À propos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <section className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Objectif du Projet
            </h3>
            <p className="text-sm text-muted-foreground">
              Cette application web a été développée dans le cadre d'un projet académique 
              en Génie Industriel. Elle permet de modéliser, simuler et optimiser 
              l'ordonnancement de la production selon différentes configurations 
              et règles de priorité.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Technologies Utilisées
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Architecture client-serveur web</li>
              <li>• Interface utilisateur réactive et moderne</li>
              <li>• Visualisation interactive des données</li>
              <li>• Algorithmes d'ordonnancement classiques</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Auteur
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="font-medium text-foreground">Kaouthar Rhazouane</p>
              <p className="text-sm text-muted-foreground mt-1">
                Projet Académique — Génie Industriel
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date().getFullYear()}
              </p>
            </div>
          </section>

          <section className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Application développée pour la gestion et l'optimisation 
              de la production industrielle.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
