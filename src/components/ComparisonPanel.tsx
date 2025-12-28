/**
 * Panneau de comparaison des algorithmes
 * Compare les performances de différentes règles d'ordonnancement
 * 
 * Auteur : Kaouthar Rhazouane
 */

import { useMemo } from 'react';
import { Job, schedule, AlgorithmType, SystemType, calculateMetrics } from '@/lib/scheduling';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Scale } from 'lucide-react';

interface ComparisonPanelProps {
  jobs: Job[];
  numMachines: number;
  systemType: SystemType;
}

const ALGORITHMS_TO_COMPARE: { value: AlgorithmType; label: string }[] = [
  { value: 'fifo', label: 'FIFO' },
  { value: 'spt', label: 'SPT' },
  { value: 'lpt', label: 'LPT' },
  { value: 'johnson', label: 'Johnson' },
  { value: 'neh', label: 'NEH' },
];

export function ComparisonPanel({ jobs, numMachines, systemType }: ComparisonPanelProps) {
  const comparisonData = useMemo(() => {
    if (jobs.length === 0) return [];

    const algorithms = systemType === 'flow-shop' 
      ? ALGORITHMS_TO_COMPARE 
      : ALGORITHMS_TO_COMPARE.filter(a => !['johnson', 'neh'].includes(a.value));

    return algorithms.map(algo => {
      const result = schedule(jobs, numMachines, systemType, algo.value);
      const metrics = calculateMetrics(result, jobs);
      
      return {
        name: algo.label,
        makespan: metrics.makespan,
        avgFlowTime: parseFloat(metrics.averageFlowTime.toFixed(1)),
        avgUtilization: parseFloat(metrics.averageUtilization.toFixed(1)),
      };
    });
  }, [jobs, numMachines, systemType]);

  if (jobs.length === 0) {
    return null;
  }

  const bestMakespan = Math.min(...comparisonData.map(d => d.makespan));

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-primary" />
        <h3 className="section-title">Comparaison des Algorithmes</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique Makespan */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Makespan (Cmax)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="makespan" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                  name="Makespan"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique Utilisation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Taux d'Utilisation Moyen (%)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="avgUtilization" 
                  fill="hsl(var(--success))" 
                  radius={[0, 4, 4, 0]}
                  name="Utilisation (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className="overflow-x-auto">
        <table className="w-full data-grid text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground">Algorithme</th>
              <th className="text-right py-2 px-3 text-muted-foreground">Makespan</th>
              <th className="text-right py-2 px-3 text-muted-foreground">Temps Moyen</th>
              <th className="text-right py-2 px-3 text-muted-foreground">Utilisation</th>
              <th className="text-right py-2 px-3 text-muted-foreground">Écart</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, idx) => {
              const gap = ((row.makespan - bestMakespan) / bestMakespan * 100).toFixed(1);
              const isBest = row.makespan === bestMakespan;
              
              return (
                <tr key={idx} className={`border-b border-border/50 ${isBest ? 'bg-primary/5' : ''}`}>
                  <td className={`py-2 px-3 ${isBest ? 'text-primary font-semibold' : ''}`}>
                    {row.name} {isBest && '★'}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{row.makespan}</td>
                  <td className="py-2 px-3 text-right font-mono">{row.avgFlowTime}</td>
                  <td className="py-2 px-3 text-right font-mono">{row.avgUtilization}%</td>
                  <td className={`py-2 px-3 text-right font-mono ${isBest ? 'text-success' : 'text-muted-foreground'}`}>
                    {isBest ? 'Optimal' : `+${gap}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
