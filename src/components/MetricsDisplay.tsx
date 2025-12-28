/**
 * Composant d'affichage des indicateurs de performance
 * Présente les métriques calculées de l'ordonnancement
 * 
 * Auteur : Kaouthar Rhazouane
 */

import { SchedulingMetrics } from '@/lib/scheduling';
import { Clock, Timer, Gauge, Activity, TrendingUp, BarChart3 } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: SchedulingMetrics | null;
  numMachines: number;
}

export function MetricsDisplay({ metrics, numMachines }: MetricsDisplayProps) {
  if (!metrics) {
    return (
      <div className="glass-panel p-6">
        <p className="text-center text-muted-foreground">
          Exécutez l'ordonnancement pour voir les métriques
        </p>
      </div>
    );
  }

  const mainMetrics = [
    {
      icon: Clock,
      label: 'Makespan (Cmax)',
      value: metrics.makespan,
      unit: 'unités',
      description: 'Temps total de production',
    },
    {
      icon: Timer,
      label: 'Temps de séjour moyen',
      value: metrics.averageFlowTime.toFixed(2),
      unit: 'unités',
      description: 'Durée moyenne par job',
    },
    {
      icon: Activity,
      label: 'Temps d\'attente total',
      value: metrics.totalWaitingTime,
      unit: 'unités',
      description: 'Temps d\'inactivité cumulé',
    },
    {
      icon: Gauge,
      label: 'Utilisation moyenne',
      value: metrics.averageUtilization.toFixed(1),
      unit: '%',
      description: 'Taux d\'occupation machines',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="glass-panel p-4 space-y-2"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <metric.icon className="h-4 w-4 text-primary" />
              <span className="text-sm">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="metric-value">{metric.value}</span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
            </div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Utilisation par machine */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="section-title">Taux d'Utilisation par Machine</h3>
        </div>
        
        <div className="space-y-3">
          {metrics.machineUtilization.map((util, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-muted-foreground">Machine {idx + 1}</span>
                <span className="font-mono text-primary">{util.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(util, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques additionnelles */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="section-title">Statistiques Détaillées</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Temps de séjour total</span>
            <p className="text-foreground">{metrics.totalFlowTime} unités</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Attente moyenne</span>
            <p className="text-foreground">{metrics.averageWaitingTime.toFixed(2)} unités</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Machines utilisées</span>
            <p className="text-foreground">{numMachines}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Efficacité globale</span>
            <p className={metrics.averageUtilization >= 70 ? 'text-success' : metrics.averageUtilization >= 50 ? 'text-warning' : 'text-destructive'}>
              {metrics.averageUtilization >= 70 ? 'Optimale' : metrics.averageUtilization >= 50 ? 'Correcte' : 'À améliorer'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
