/**
 * Module d'ordonnancement industriel
 * Implémentation des algorithmes classiques de planification de production
 * 
 * Auteur : Kaouthar Rhazouane
 */

export type SystemType = 'flow-shop' | 'job-shop' | 'parallel-identical' | 'parallel-different';
export type AlgorithmType = 'fifo' | 'spt' | 'lpt' | 'johnson' | 'neh';

export interface Job {
  id: number;
  name: string;
  processingTimes: number[]; // Temps par machine
  operations?: number[]; // Ordre des machines (Job Shop)
}

export interface ScheduleTask {
  jobId: number;
  machineId: number;
  startTime: number;
  endTime: number;
  processingTime: number;
}

export interface ScheduleResult {
  tasks: ScheduleTask[];
  makespan: number;
  totalFlowTime: number;
  averageFlowTime: number;
  totalWaitingTime: number;
  machineUtilization: number[];
  jobSequence: number[];
}

export interface SchedulingMetrics {
  makespan: number;
  totalFlowTime: number;
  averageFlowTime: number;
  totalWaitingTime: number;
  averageWaitingTime: number;
  machineUtilization: number[];
  averageUtilization: number;
}

/**
 * Génère des données de test pour les jobs
 */
export function generateSampleJobs(numJobs: number, numMachines: number): Job[] {
  const jobs: Job[] = [];
  for (let i = 0; i < numJobs; i++) {
    const processingTimes: number[] = [];
    for (let j = 0; j < numMachines; j++) {
      processingTimes.push(Math.floor(Math.random() * 10) + 1);
    }
    jobs.push({
      id: i + 1,
      name: `J${i + 1}`,
      processingTimes,
    });
  }
  return jobs;
}

/**
 * Algorithme FIFO (First In First Out)
 * Traite les jobs dans leur ordre d'arrivée
 */
export function scheduleFIFO(jobs: Job[], numMachines: number, systemType: SystemType): ScheduleResult {
  const sequence = jobs.map(j => j.id);
  return executeFlowShopSchedule(jobs, sequence, numMachines);
}

/**
 * Algorithme SPT (Shortest Processing Time)
 * Priorise les jobs avec le temps total de traitement le plus court
 */
export function scheduleSPT(jobs: Job[], numMachines: number, systemType: SystemType): ScheduleResult {
  const sortedJobs = [...jobs].sort((a, b) => {
    const totalA = a.processingTimes.reduce((sum, t) => sum + t, 0);
    const totalB = b.processingTimes.reduce((sum, t) => sum + t, 0);
    return totalA - totalB;
  });
  const sequence = sortedJobs.map(j => j.id);
  return executeFlowShopSchedule(jobs, sequence, numMachines);
}

/**
 * Algorithme LPT (Longest Processing Time)
 * Priorise les jobs avec le temps total de traitement le plus long
 */
export function scheduleLPT(jobs: Job[], numMachines: number, systemType: SystemType): ScheduleResult {
  const sortedJobs = [...jobs].sort((a, b) => {
    const totalA = a.processingTimes.reduce((sum, t) => sum + t, 0);
    const totalB = b.processingTimes.reduce((sum, t) => sum + t, 0);
    return totalB - totalA;
  });
  const sequence = sortedJobs.map(j => j.id);
  return executeFlowShopSchedule(jobs, sequence, numMachines);
}

/**
 * Algorithme de Johnson (Flow Shop 2 machines)
 * Minimise le makespan pour un flow shop à 2 machines
 */
export function scheduleJohnson(jobs: Job[], numMachines: number): ScheduleResult {
  if (numMachines !== 2) {
    console.warn("L'algorithme de Johnson est optimal pour 2 machines");
  }
  
  const u: Job[] = [];
  const v: Job[] = [];
  
  for (const job of jobs) {
    const p1 = job.processingTimes[0] || 0;
    const p2 = job.processingTimes[1] || 0;
    
    if (p1 <= p2) {
      u.push(job);
    } else {
      v.push(job);
    }
  }
  
  // Trier U par p1 croissant
  u.sort((a, b) => a.processingTimes[0] - b.processingTimes[0]);
  
  // Trier V par p2 décroissant
  v.sort((a, b) => b.processingTimes[1] - a.processingTimes[1]);
  
  const sequence = [...u, ...v].map(j => j.id);
  return executeFlowShopSchedule(jobs, sequence, numMachines);
}

/**
 * Algorithme NEH (Nawaz-Enscore-Ham)
 * Heuristique pour Flow Shop général
 */
export function scheduleNEH(jobs: Job[], numMachines: number): ScheduleResult {
  // Étape 1 : Trier par temps total décroissant
  const sortedJobs = [...jobs].sort((a, b) => {
    const totalA = a.processingTimes.reduce((sum, t) => sum + t, 0);
    const totalB = b.processingTimes.reduce((sum, t) => sum + t, 0);
    return totalB - totalA;
  });
  
  let bestSequence: number[] = [sortedJobs[0].id];
  
  // Étape 2 : Insérer chaque job à la meilleure position
  for (let i = 1; i < sortedJobs.length; i++) {
    const jobToInsert = sortedJobs[i].id;
    let bestMakespan = Infinity;
    let bestPosition = 0;
    
    for (let pos = 0; pos <= bestSequence.length; pos++) {
      const testSequence = [...bestSequence];
      testSequence.splice(pos, 0, jobToInsert);
      
      const result = executeFlowShopSchedule(jobs, testSequence, numMachines);
      if (result.makespan < bestMakespan) {
        bestMakespan = result.makespan;
        bestPosition = pos;
      }
    }
    
    bestSequence.splice(bestPosition, 0, jobToInsert);
  }
  
  return executeFlowShopSchedule(jobs, bestSequence, numMachines);
}

/**
 * Exécute l'ordonnancement Flow Shop pour une séquence donnée
 */
function executeFlowShopSchedule(jobs: Job[], sequence: number[], numMachines: number): ScheduleResult {
  const tasks: ScheduleTask[] = [];
  const machineEndTimes: number[] = new Array(numMachines).fill(0);
  const jobEndTimes: Map<number, number> = new Map();
  const jobStartTimes: Map<number, number> = new Map();
  
  for (const jobId of sequence) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) continue;
    
    let jobCurrentTime = 0;
    
    for (let m = 0; m < numMachines; m++) {
      const processingTime = job.processingTimes[m] || 0;
      const startTime = Math.max(machineEndTimes[m], jobCurrentTime);
      const endTime = startTime + processingTime;
      
      if (m === 0 && !jobStartTimes.has(jobId)) {
        jobStartTimes.set(jobId, startTime);
      }
      
      tasks.push({
        jobId,
        machineId: m + 1,
        startTime,
        endTime,
        processingTime,
      });
      
      machineEndTimes[m] = endTime;
      jobCurrentTime = endTime;
    }
    
    jobEndTimes.set(jobId, jobCurrentTime);
  }
  
  const makespan = Math.max(...machineEndTimes);
  
  // Calcul des métriques
  let totalFlowTime = 0;
  let totalWaitingTime = 0;
  
  for (const jobId of sequence) {
    const endTime = jobEndTimes.get(jobId) || 0;
    const job = jobs.find(j => j.id === jobId);
    const totalProcessingTime = job?.processingTimes.reduce((sum, t) => sum + t, 0) || 0;
    
    totalFlowTime += endTime;
    totalWaitingTime += endTime - totalProcessingTime;
  }
  
  const machineUtilization = machineEndTimes.map((endTime, idx) => {
    const totalWork = tasks
      .filter(t => t.machineId === idx + 1)
      .reduce((sum, t) => sum + t.processingTime, 0);
    return makespan > 0 ? (totalWork / makespan) * 100 : 0;
  });
  
  return {
    tasks,
    makespan,
    totalFlowTime,
    averageFlowTime: sequence.length > 0 ? totalFlowTime / sequence.length : 0,
    totalWaitingTime,
    machineUtilization,
    jobSequence: sequence,
  };
}

/**
 * Ordonnancement pour machines parallèles identiques
 */
export function scheduleParallelIdentical(jobs: Job[], numMachines: number, algorithm: AlgorithmType): ScheduleResult {
  let sortedJobs: Job[];
  
  switch (algorithm) {
    case 'spt':
      sortedJobs = [...jobs].sort((a, b) => a.processingTimes[0] - b.processingTimes[0]);
      break;
    case 'lpt':
      sortedJobs = [...jobs].sort((a, b) => b.processingTimes[0] - a.processingTimes[0]);
      break;
    default:
      sortedJobs = [...jobs];
  }
  
  const tasks: ScheduleTask[] = [];
  const machineEndTimes: number[] = new Array(numMachines).fill(0);
  
  for (const job of sortedJobs) {
    // Trouver la machine la moins chargée
    const minIdx = machineEndTimes.indexOf(Math.min(...machineEndTimes));
    const startTime = machineEndTimes[minIdx];
    const processingTime = job.processingTimes[0];
    const endTime = startTime + processingTime;
    
    tasks.push({
      jobId: job.id,
      machineId: minIdx + 1,
      startTime,
      endTime,
      processingTime,
    });
    
    machineEndTimes[minIdx] = endTime;
  }
  
  const makespan = Math.max(...machineEndTimes);
  const totalProcessingTime = jobs.reduce((sum, j) => sum + j.processingTimes[0], 0);
  
  const machineUtilization = machineEndTimes.map(endTime => {
    const machineWork = tasks
      .filter(t => t.machineId === machineEndTimes.indexOf(endTime) + 1)
      .reduce((sum, t) => sum + t.processingTime, 0);
    return makespan > 0 ? (machineWork / makespan) * 100 : 0;
  });
  
  return {
    tasks,
    makespan,
    totalFlowTime: totalProcessingTime,
    averageFlowTime: jobs.length > 0 ? totalProcessingTime / jobs.length : 0,
    totalWaitingTime: makespan * numMachines - totalProcessingTime,
    machineUtilization,
    jobSequence: sortedJobs.map(j => j.id),
  };
}

/**
 * Fonction principale d'ordonnancement
 */
export function schedule(
  jobs: Job[],
  numMachines: number,
  systemType: SystemType,
  algorithm: AlgorithmType
): ScheduleResult {
  switch (systemType) {
    case 'flow-shop':
      switch (algorithm) {
        case 'fifo':
          return scheduleFIFO(jobs, numMachines, systemType);
        case 'spt':
          return scheduleSPT(jobs, numMachines, systemType);
        case 'lpt':
          return scheduleLPT(jobs, numMachines, systemType);
        case 'johnson':
          return scheduleJohnson(jobs, numMachines);
        case 'neh':
          return scheduleNEH(jobs, numMachines);
        default:
          return scheduleFIFO(jobs, numMachines, systemType);
      }
    
    case 'parallel-identical':
    case 'parallel-different':
      return scheduleParallelIdentical(jobs, numMachines, algorithm);
    
    case 'job-shop':
      // Pour Job Shop, utiliser FIFO comme base
      return scheduleFIFO(jobs, numMachines, systemType);
    
    default:
      return scheduleFIFO(jobs, numMachines, systemType);
  }
}

/**
 * Calcule les métriques détaillées
 */
export function calculateMetrics(result: ScheduleResult, jobs: Job[]): SchedulingMetrics {
  const avgUtilization = result.machineUtilization.reduce((a, b) => a + b, 0) / result.machineUtilization.length;
  
  return {
    makespan: result.makespan,
    totalFlowTime: result.totalFlowTime,
    averageFlowTime: result.averageFlowTime,
    totalWaitingTime: result.totalWaitingTime,
    averageWaitingTime: jobs.length > 0 ? result.totalWaitingTime / jobs.length : 0,
    machineUtilization: result.machineUtilization,
    averageUtilization: avgUtilization,
  };
}
