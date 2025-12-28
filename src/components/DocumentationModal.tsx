/**
 * Modal de documentation
 * Guide d'utilisation et informations théoriques
 * 
 * Auteur : Kaouthar Rhazouane
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentationModal({ open, onOpenChange }: DocumentationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Documentation</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guide">Guide d'utilisation</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithmes</TabsTrigger>
              <TabsTrigger value="metrics">Indicateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-4 mt-4">
              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Introduction</h3>
                <p className="text-muted-foreground">
                  Cette application permet de simuler et optimiser l'ordonnancement 
                  de production industrielle selon différents systèmes et règles de priorité.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Étapes d'utilisation</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Sélectionnez le type de système de production (Flow Shop, Job Shop, etc.)</li>
                  <li>Choisissez l'algorithme d'ordonnancement souhaité</li>
                  <li>Définissez le nombre de machines et de jobs</li>
                  <li>Renseignez les temps de traitement dans le tableau interactif</li>
                  <li>Cliquez sur "Exécuter l'ordonnancement" pour lancer le calcul</li>
                  <li>Analysez les résultats via le diagramme de Gantt et les métriques</li>
                </ol>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Types de systèmes</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Flow Shop :</strong> Tous les jobs suivent le même ordre de passage sur les machines.</li>
                  <li><strong className="text-foreground">Job Shop :</strong> Chaque job peut avoir un ordre de passage différent.</li>
                  <li><strong className="text-foreground">Machines Parallèles :</strong> Plusieurs machines peuvent traiter le même type d'opération.</li>
                </ul>
              </section>
            </TabsContent>

            <TabsContent value="algorithms" className="space-y-4 mt-4">
              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">FIFO (First In First Out)</h3>
                <p className="text-muted-foreground">
                  Traite les jobs dans leur ordre d'arrivée. Simple mais ne garantit pas 
                  l'optimalité du makespan.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">SPT (Shortest Processing Time)</h3>
                <p className="text-muted-foreground">
                  Priorise les jobs avec le temps de traitement total le plus court.
                  Minimise le temps de séjour moyen.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">LPT (Longest Processing Time)</h3>
                <p className="text-muted-foreground">
                  Priorise les jobs avec le temps de traitement total le plus long.
                  Utile pour équilibrer la charge sur machines parallèles.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Johnson (Flow Shop 2 machines)</h3>
                <p className="text-muted-foreground">
                  Algorithme optimal pour minimiser le makespan dans un Flow Shop 
                  à exactement 2 machines. Complexité O(n log n).
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">NEH (Nawaz-Enscore-Ham)</h3>
                <p className="text-muted-foreground">
                  Heuristique constructive pour Flow Shop général (m machines).
                  Construit la séquence en insérant chaque job à la meilleure position.
                </p>
              </section>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4 mt-4">
              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Makespan (Cmax)</h3>
                <p className="text-muted-foreground">
                  Temps total nécessaire pour compléter tous les jobs. 
                  C'est le temps de fin du dernier job sur la dernière machine.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Temps de séjour (Flow Time)</h3>
                <p className="text-muted-foreground">
                  Temps total passé par un job dans le système, de son arrivée 
                  à sa complétion. Inclut le temps d'attente et de traitement.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Temps d'attente</h3>
                <p className="text-muted-foreground">
                  Différence entre le temps de séjour et le temps de traitement.
                  Représente le temps d'inactivité des jobs.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Taux d'utilisation</h3>
                <p className="text-muted-foreground">
                  Pourcentage du temps où une machine est occupée par rapport 
                  au makespan total. Un taux élevé indique une bonne efficacité.
                </p>
              </section>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
