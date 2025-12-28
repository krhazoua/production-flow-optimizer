/**
 * Composant de saisie des données de production
 * Interface interactive pour définir les jobs et leurs temps de traitement
 * 
 * Auteur : Kaouthar Rhazouane
 */

import { useState, useEffect } from 'react';
import { Job } from '@/lib/scheduling';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, RefreshCw, Upload } from 'lucide-react';

interface JobDataInputProps {
  numMachines: number;
  jobs: Job[];
  onJobsChange: (jobs: Job[]) => void;
}

export function JobDataInput({ numMachines, jobs, onJobsChange }: JobDataInputProps) {
  const [localJobs, setLocalJobs] = useState<Job[]>(jobs);

  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  const addJob = () => {
    const newJob: Job = {
      id: localJobs.length + 1,
      name: `J${localJobs.length + 1}`,
      processingTimes: new Array(numMachines).fill(1),
    };
    const updated = [...localJobs, newJob];
    setLocalJobs(updated);
    onJobsChange(updated);
  };

  const removeJob = (index: number) => {
    const updated = localJobs.filter((_, i) => i !== index).map((job, i) => ({
      ...job,
      id: i + 1,
      name: `J${i + 1}`,
    }));
    setLocalJobs(updated);
    onJobsChange(updated);
  };

  const updateProcessingTime = (jobIndex: number, machineIndex: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const updated = localJobs.map((job, i) => {
      if (i === jobIndex) {
        const newTimes = [...job.processingTimes];
        newTimes[machineIndex] = Math.max(0, numValue);
        return { ...job, processingTimes: newTimes };
      }
      return job;
    });
    setLocalJobs(updated);
    onJobsChange(updated);
  };

  const generateRandomData = () => {
    const randomJobs = localJobs.map(job => ({
      ...job,
      processingTimes: job.processingTimes.map(() => Math.floor(Math.random() * 15) + 1),
    }));
    setLocalJobs(randomJobs);
    onJobsChange(randomJobs);
  };

  const resetData = () => {
    const resetJobs = localJobs.map(job => ({
      ...job,
      processingTimes: new Array(numMachines).fill(1),
    }));
    setLocalJobs(resetJobs);
    onJobsChange(resetJobs);
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Données de Production</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateRandomData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Aléatoire
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetData}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Tableau de saisie */}
      <div className="overflow-x-auto">
        <table className="w-full data-grid">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Job</th>
              {Array.from({ length: numMachines }, (_, i) => (
                <th key={i} className="text-center py-3 px-2 text-muted-foreground font-medium">
                  M{i + 1}
                </th>
              ))}
              <th className="text-center py-3 px-2 text-muted-foreground font-medium w-12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {localJobs.map((job, jobIndex) => (
              <tr key={job.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-2 px-2">
                  <span className="text-primary font-semibold">{job.name}</span>
                </td>
                {job.processingTimes.map((time, machineIndex) => (
                  <td key={machineIndex} className="py-2 px-2">
                    <Input
                      type="number"
                      min={0}
                      value={time}
                      onChange={(e) => updateProcessingTime(jobIndex, machineIndex, e.target.value)}
                      className="w-16 h-8 text-center font-mono bg-muted/50 border-border/50"
                    />
                  </td>
                ))}
                <td className="py-2 px-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeJob(jobIndex)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={localJobs.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bouton ajouter */}
      <Button
        variant="outline"
        onClick={addJob}
        className="w-full gap-2 border-dashed hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Ajouter un Job
      </Button>

      {/* Résumé */}
      <div className="flex gap-4 pt-2 text-sm text-muted-foreground">
        <span>{localJobs.length} job(s)</span>
        <span>•</span>
        <span>{numMachines} machine(s)</span>
        <span>•</span>
        <span>
          Temps total : {localJobs.reduce((sum, j) => sum + j.processingTimes.reduce((a, b) => a + b, 0), 0)} unités
        </span>
      </div>
    </div>
  );
}
