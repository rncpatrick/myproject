// app/page.tsx
'use client';

import React, { useState } from 'react';
import { ProblemForm } from '@/components/LinearProgramming/ProblemForm';
import { GraphicalSolution } from '@/components/LinearProgramming/GraphicalSolution';
import { Problem, Solution } from '@/lib/types/linear-programming';
import { GraphicalSolver } from '@/lib/graphical/graphical-solver';

export default function Home() {
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = (problem: Problem) => {
    setLoading(true);
    
    try {
      // Utiliser le solveur graphique
      const solver = new GraphicalSolver(problem);
      const result = solver.solve();
      setSolution(result);
    } catch (error) {
      console.error('Erreur lors de la résolution:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Résolution Graphique de Programmation Linéaire</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <ProblemForm onSolve={handleSolve} />
        </div>
        
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-lg">Résolution en cours...</div>
            </div>
          ) : solution ? (
            <GraphicalSolution solution={solution} />
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
              <p className="text-gray-500">
                Entrez un problème et cliquez sur <strong className="text-green-500"> Résoudre </strong> pour voir la solution graphique
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}