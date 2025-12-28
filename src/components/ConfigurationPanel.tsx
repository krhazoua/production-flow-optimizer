/**
 * Panneau de configuration du système de production
 * Sélection du type de système, algorithme et paramètres
 * 
 * Auteur : Kaouthar Rhazouane
 */

import { SystemType, AlgorithmType } from '@/lib/scheduling';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Factory, Cpu, Settings2 } from 'lucide-react';

interface ConfigurationPanelProps {
  systemType: SystemType;
  algorithm: AlgorithmType;
  numMachines: number;
  numJobs: number;
  onSystemTypeChange: (value: SystemType) => void;
  onAlgorithmChange: (value: AlgorithmType) => void;
  onNumMachinesChange: (value: number) => void;
  onNumJobsChange: (value: number) => void;
}

const SYSTEM_TYPES = [
  { value: 'flow-shop', label: 'Flow Shop', description: 'Ordre fixe des machines' },
  { value: 'job-shop', label: 'Job Shop', description: 'Ordre variable par job' },
  { value: 'parallel-identical', label: 'Machines Parallèles Identiques', description: 'Capacités égales' },
  { value: 'parallel-different', label: 'Machines Parallèles Différentes', description: 'Capacités variables' },
];

const ALGORITHMS: Record<SystemType, { value: AlgorithmType; label: string; description: string }[]> = {
  'flow-shop': [
    { value: 'fifo', label: 'FIFO', description: 'Premier arrivé, premier servi' },
    { value: 'spt', label: 'SPT', description: 'Temps le plus court d\'abord' },
    { value: 'lpt', label: 'LPT', description: 'Temps le plus long d\'abord' },
    { value: 'johnson', label: 'Johnson', description: 'Optimal pour 2 machines' },
    { value: 'neh', label: 'NEH', description: 'Heuristique constructive' },
  ],
  'job-shop': [
    { value: 'fifo', label: 'FIFO', description: 'Premier arrivé, premier servi' },
    { value: 'spt', label: 'SPT', description: 'Temps le plus court d\'abord' },
    { value: 'lpt', label: 'LPT', description: 'Temps le plus long d\'abord' },
  ],
  'parallel-identical': [
    { value: 'fifo', label: 'FIFO', description: 'Premier arrivé, premier servi' },
    { value: 'spt', label: 'SPT', description: 'Temps le plus court d\'abord' },
    { value: 'lpt', label: 'LPT', description: 'Temps le plus long d\'abord' },
  ],
  'parallel-different': [
    { value: 'fifo', label: 'FIFO', description: 'Premier arrivé, premier servi' },
    { value: 'spt', label: 'SPT', description: 'Temps le plus court d\'abord' },
    { value: 'lpt', label: 'LPT', description: 'Temps le plus long d\'abord' },
  ],
};

export function ConfigurationPanel({
  systemType,
  algorithm,
  numMachines,
  numJobs,
  onSystemTypeChange,
  onAlgorithmChange,
  onNumMachinesChange,
  onNumJobsChange,
}: ConfigurationPanelProps) {
  const availableAlgorithms = ALGORITHMS[systemType] || ALGORITHMS['flow-shop'];

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-primary" />
        <h3 className="section-title">Configuration du Système</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type de système */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-muted-foreground" />
            Type de Système
          </Label>
          <Select value={systemType} onValueChange={(v) => onSystemTypeChange(v as SystemType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SYSTEM_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex flex-col">
                    <span>{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Algorithme */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            Règle d'Ordonnancement
          </Label>
          <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as AlgorithmType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableAlgorithms.map((algo) => (
                <SelectItem key={algo.value} value={algo.value}>
                  <div className="flex flex-col">
                    <span>{algo.label}</span>
                    <span className="text-xs text-muted-foreground">{algo.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nombre de machines */}
        <div className="space-y-2">
          <Label htmlFor="numMachines">Nombre de Machines</Label>
          <Input
            id="numMachines"
            type="number"
            min={1}
            max={10}
            value={numMachines}
            onChange={(e) => onNumMachinesChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="font-mono"
          />
        </div>

        {/* Nombre de jobs */}
        <div className="space-y-2">
          <Label htmlFor="numJobs">Nombre de Jobs</Label>
          <Input
            id="numJobs"
            type="number"
            min={1}
            max={20}
            value={numJobs}
            onChange={(e) => onNumJobsChange(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="font-mono"
          />
        </div>
      </div>

      {/* Information sur l'algorithme sélectionné */}
      {systemType === 'flow-shop' && algorithm === 'johnson' && numMachines !== 2 && (
        <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-sm text-warning">
          ⚠️ L'algorithme de Johnson est optimal pour exactement 2 machines. 
          Les résultats peuvent être sous-optimaux avec {numMachines} machines.
        </div>
      )}
    </div>
  );
}
