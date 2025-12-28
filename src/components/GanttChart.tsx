/**
 * Composant de visualisation du diagramme de Gantt
 * Affiche l'ordonnancement des tâches sur les machines
 * 
 * Auteur : Kaouthar Rhazouane
 */

import { useMemo } from 'react';
import { ScheduleTask } from '@/lib/scheduling';

interface GanttChartProps {
  tasks: ScheduleTask[];
  numMachines: number;
  makespan: number;
  jobSequence: number[];
}

const JOB_COLORS = [
  'bg-gantt-job1',
  'bg-gantt-job2',
  'bg-gantt-job3',
  'bg-gantt-job4',
  'bg-gantt-job5',
  'bg-gantt-job6',
  'bg-gantt-job7',
  'bg-gantt-job8',
];

const JOB_COLOR_VALUES = [
  'hsl(187, 85%, 53%)',
  'hsl(142, 76%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 85%, 65%)',
  'hsl(0, 84%, 60%)',
  'hsl(199, 89%, 48%)',
  'hsl(325, 85%, 55%)',
  'hsl(45, 93%, 47%)',
];

export function GanttChart({ tasks, numMachines, makespan, jobSequence }: GanttChartProps) {
  const uniqueJobs = useMemo(() => {
    return [...new Set(tasks.map(t => t.jobId))].sort((a, b) => a - b);
  }, [tasks]);

  const getJobColor = (jobId: number) => {
    const index = uniqueJobs.indexOf(jobId);
    return JOB_COLORS[index % JOB_COLORS.length];
  };

  const getJobColorValue = (jobId: number) => {
    const index = uniqueJobs.indexOf(jobId);
    return JOB_COLOR_VALUES[index % JOB_COLOR_VALUES.length];
  };

  const timeScale = useMemo(() => {
    const intervals: number[] = [];
    const step = Math.max(1, Math.ceil(makespan / 10));
    for (let i = 0; i <= makespan; i += step) {
      intervals.push(i);
    }
    if (intervals[intervals.length - 1] < makespan) {
      intervals.push(makespan);
    }
    return intervals;
  }, [makespan]);

  const machineRows = useMemo(() => {
    const rows: Map<number, ScheduleTask[]> = new Map();
    for (let m = 1; m <= numMachines; m++) {
      rows.set(m, tasks.filter(t => t.machineId === m).sort((a, b) => a.startTime - b.startTime));
    }
    return rows;
  }, [tasks, numMachines]);

  if (tasks.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Aucune donnée d'ordonnancement disponible
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Diagramme de Gantt</h3>
        <span className="font-mono text-sm text-muted-foreground">
          Cmax = {makespan} unités
        </span>
      </div>

      {/* Échelle temporelle */}
      <div className="relative">
        <div className="flex items-end mb-2 ml-24">
          {timeScale.map((time, idx) => (
            <div
              key={idx}
              className="text-xs font-mono text-muted-foreground"
              style={{
                position: 'absolute',
                left: `calc(96px + ${(time / makespan) * (100 - 96 / window.innerWidth * 100)}%)`,
                transform: 'translateX(-50%)',
              }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Lignes des machines */}
        <div className="space-y-3 mt-8">
          {Array.from(machineRows.entries()).map(([machineId, machineTasks]) => (
            <div key={machineId} className="flex items-center gap-4">
              <div className="w-20 text-right font-mono text-sm text-muted-foreground shrink-0">
                M{machineId}
              </div>
              <div className="flex-1 relative h-10 bg-muted/30 rounded overflow-hidden">
                {/* Grille de temps */}
                {timeScale.map((time, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-px bg-border/30"
                    style={{ left: `${(time / makespan) * 100}%` }}
                  />
                ))}
                
                {/* Tâches */}
                {machineTasks.map((task, idx) => {
                  const left = (task.startTime / makespan) * 100;
                  const width = (task.processingTime / makespan) * 100;
                  
                  return (
                    <div
                      key={idx}
                      className={`absolute top-1 bottom-1 rounded shadow-sm flex items-center justify-center text-xs font-mono font-semibold transition-all hover:scale-105 hover:z-10 ${getJobColor(task.jobId)}`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        minWidth: '20px',
                      }}
                      title={`J${task.jobId}: ${task.startTime} → ${task.endTime} (${task.processingTime})`}
                    >
                      <span className="text-primary-foreground drop-shadow-sm">
                        {width > 5 ? `J${task.jobId}` : task.jobId}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap gap-3">
          {uniqueJobs.map(jobId => (
            <div key={jobId} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getJobColorValue(jobId) }}
              />
              <span className="text-sm font-mono text-muted-foreground">
                Job {jobId}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Séquence */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Séquence optimale :</span>
          <div className="flex gap-1">
            {jobSequence.map((jobId, idx) => (
              <span key={idx} className="font-mono text-sm text-primary">
                J{jobId}{idx < jobSequence.length - 1 ? ' →' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
