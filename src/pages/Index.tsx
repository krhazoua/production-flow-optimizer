/**
 * Page principale de l'application d'ordonnancement industriel
 * Interface complète de gestion et simulation de production
 * 
 * Auteur : Kaouthar Rhazouane
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Job, 
  SystemType, 
  AlgorithmType, 
  ScheduleResult, 
  SchedulingMetrics,
  schedule,
  calculateMetrics,
  generateSampleJobs,
} from '@/lib/scheduling';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { JobDataInput } from '@/components/JobDataInput';
import { GanttChart } from '@/components/GanttChart';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { ComparisonPanel } from '@/components/ComparisonPanel';
import { DocumentationModal } from '@/components/DocumentationModal';
import { AboutModal } from '@/components/AboutModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, Download } from 'lucide-react';

export default function Index() {
  // Configuration
  const [systemType, setSystemType] = useState<SystemType>('flow-shop');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('fifo');
  const [numMachines, setNumMachines] = useState(3);
  const [numJobs, setNumJobs] = useState(5);
  
  // Données
  const [jobs, setJobs] = useState<Job[]>([]);
  
  // Résultats
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [metrics, setMetrics] = useState<SchedulingMetrics | null>(null);
  
  // Modales
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Initialisation des jobs
  useEffect(() => {
    const initialJobs = generateSampleJobs(numJobs, numMachines);
    setJobs(initialJobs);
    setResult(null);
    setMetrics(null);
  }, [numMachines, numJobs]);

  // Gestion du changement de système
  const handleSystemTypeChange = (type: SystemType) => {
    setSystemType(type);
    // Réinitialiser l'algorithme si incompatible
    if (['johnson', 'neh'].includes(algorithm) && type !== 'flow-shop') {
      setAlgorithm('fifo');
    }
  };

  // Exécution de l'ordonnancement
  const runScheduling = useCallback(() => {
    if (jobs.length === 0) {
      toast.error('Veuillez définir au moins un job');
      return;
    }

    try {
      const scheduleResult = schedule(jobs, numMachines, systemType, algorithm);
      const calculatedMetrics = calculateMetrics(scheduleResult, jobs);
      
      setResult(scheduleResult);
      setMetrics(calculatedMetrics);
      
      toast.success('Ordonnancement calculé avec succès', {
        description: `Makespan: ${scheduleResult.makespan} unités`,
      });
    } catch (error) {
      toast.error('Erreur lors du calcul', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }, [jobs, numMachines, systemType, algorithm]);

  // Réinitialisation
  const resetAll = () => {
    const newJobs = generateSampleJobs(numJobs, numMachines);
    setJobs(newJobs);
    setResult(null);
    setMetrics(null);
    toast.info('Données réinitialisées');
  };

  // Export des résultats
  const exportResults = () => {
    if (!result || !metrics) {
      toast.error('Aucun résultat à exporter');
      return;
    }

    const exportData = {
      configuration: {
        systemType,
        algorithm,
        numMachines,
        numJobs,
      },
      jobs: jobs.map(j => ({
        id: j.id,
        name: j.name,
        processingTimes: j.processingTimes,
      })),
      results: {
        makespan: metrics.makespan,
        totalFlowTime: metrics.totalFlowTime,
        averageFlowTime: metrics.averageFlowTime,
        totalWaitingTime: metrics.totalWaitingTime,
        machineUtilization: metrics.machineUtilization,
        jobSequence: result.jobSequence,
      },
      tasks: result.tasks,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordonnancement_${systemType}_${algorithm}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Résultats exportés');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onShowDocumentation={() => setShowDocumentation(true)}
        onShowAbout={() => setShowAbout(true)}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Panneau de configuration */}
          <ConfigurationPanel
            systemType={systemType}
            algorithm={algorithm}
            numMachines={numMachines}
            numJobs={numJobs}
            onSystemTypeChange={handleSystemTypeChange}
            onAlgorithmChange={setAlgorithm}
            onNumMachinesChange={setNumMachines}
            onNumJobsChange={setNumJobs}
          />

          {/* Saisie des données */}
          <JobDataInput
            numMachines={numMachines}
            jobs={jobs}
            onJobsChange={setJobs}
          />

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={runScheduling}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Play className="h-5 w-5" />
              Exécuter l'ordonnancement
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={resetAll}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Réinitialiser
            </Button>
            {result && (
              <Button
                variant="outline"
                size="lg"
                onClick={exportResults}
                className="gap-2"
              >
                <Download className="h-5 w-5" />
                Exporter
              </Button>
            )}
          </div>

          {/* Résultats */}
          {result && (
            <Tabs defaultValue="gantt" className="w-full animate-slide-up">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gantt">Diagramme de Gantt</TabsTrigger>
                <TabsTrigger value="metrics">Indicateurs</TabsTrigger>
                <TabsTrigger value="comparison">Comparaison</TabsTrigger>
              </TabsList>

              <TabsContent value="gantt" className="mt-6">
                <GanttChart
                  tasks={result.tasks}
                  numMachines={numMachines}
                  makespan={result.makespan}
                  jobSequence={result.jobSequence}
                />
              </TabsContent>

              <TabsContent value="metrics" className="mt-6">
                <MetricsDisplay
                  metrics={metrics}
                  numMachines={numMachines}
                />
              </TabsContent>

              <TabsContent value="comparison" className="mt-6">
                <ComparisonPanel
                  jobs={jobs}
                  numMachines={numMachines}
                  systemType={systemType}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />

      {/* Modales */}
      <DocumentationModal 
        open={showDocumentation} 
        onOpenChange={setShowDocumentation} 
      />
      <AboutModal 
        open={showAbout} 
        onOpenChange={setShowAbout} 
      />
    </div>
  );
}
