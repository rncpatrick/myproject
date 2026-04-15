// components/LinearProgramming/ProblemForm.tsx
'use client';

import React, { useState } from 'react';
import { Constraint, Problem } from '@/lib/types/linear-programming';

interface ProblemFormProps {
  onSolve: (problem: Problem) => void;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({ onSolve }) => {
  const [problem, setProblem] = useState<Problem>({
    name: 'Mon problème',
    objective: {
      coefficients: [1, 1],
      type: 'maximize'
    },
    constraints: [
      { id: '1', coefficients: [1, 1], operator: '<=', rhs: 10 },
      { id: '2', coefficients: [2, 1], operator: '<=', rhs: 16 }
    ],
    variables: 2,
    nonNegativity: true
  });

  const addConstraint = () => {
    const newConstraint: Constraint = {
      id: Date.now().toString(),
      coefficients: [0, 0],
      operator: '<=',
      rhs: 0
    };
    setProblem({
      ...problem,
      constraints: [...problem.constraints, newConstraint]
    });
  };

  const updateConstraint = (index: number, field: keyof Constraint, value: any) => {
    const updatedConstraints = [...problem.constraints];
    if (field === 'coefficients') {
      updatedConstraints[index].coefficients = value;
    } else if (field === 'operator') {
      updatedConstraints[index].operator = value;
    } else if (field === 'rhs') {
      updatedConstraints[index].rhs = parseFloat(value) || 0;
    }
    setProblem({ ...problem, constraints: updatedConstraints });
  };

  const removeConstraint = (index: number) => {
    const updatedConstraints = problem.constraints.filter((_, i) => i !== index);
    setProblem({ ...problem, constraints: updatedConstraints });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-2xl font-bold mb-4">Problème de Programmation Linéaire</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nom du problème</label>
        <input
          type="text"
          value={problem.name}
          onChange={(e) => setProblem({ ...problem, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Type d objectif</label>
        <select
          value={problem.objective.type}
          onChange={(e) => setProblem({
            ...problem,
            objective: { ...problem.objective, type: e.target.value as 'maximize' | 'minimize' }
          })}
          className="w-full p-2 border rounded"
        >
          <option value="maximize">Maximisation</option>
          <option value="minimize">Minimisation</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fonction objectif</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={problem.objective.coefficients[0]}
            onChange={(e) => setProblem({
              ...problem,
              objective: {
                ...problem.objective,
                coefficients: [parseFloat(e.target.value) || 0, problem.objective.coefficients[1]]
              }
            })}
            className="w-20 p-2 border rounded"
          />
          <span>x +</span>
          <input
            type="number"
            value={problem.objective.coefficients[1]}
            onChange={(e) => setProblem({
              ...problem,
              objective: {
                ...problem.objective,
                coefficients: [problem.objective.coefficients[0], parseFloat(e.target.value) || 0]
              }
            })}
            className="w-20 p-2 border rounded"
          />
          <span>y</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Contraintes</h3>
        {problem.constraints.map((constraint, index) => (
          <div key={constraint.id} className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={constraint.coefficients[0]}
              onChange={(e) => updateConstraint(index, 'coefficients', [
                parseFloat(e.target.value) || 0,
                constraint.coefficients[1]
              ])}
              className="w-20 p-2 border rounded"
            />
            <span>x +</span>
            <input
              type="number"
              value={constraint.coefficients[1]}
              onChange={(e) => updateConstraint(index, 'coefficients', [
                constraint.coefficients[0],
                parseFloat(e.target.value) || 0
              ])}
              className="w-20 p-2 border rounded"
            />
             <span>y</span>
            <select
              value={constraint.operator}
              onChange={(e) => updateConstraint(index, 'operator', e.target.value)}
              className="p-2 border rounded"
            >
              <option value="<=">≤</option>
              <option value=">=">≥</option>
              <option value="=">=</option>
            </select>
            <input
              type="number"
              value={constraint.rhs}
              onChange={(e) => updateConstraint(index, 'rhs', e.target.value)}
              className="w-20 p-2 border rounded"
            />
            <button
              onClick={() => removeConstraint(index)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addConstraint}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ajouter une contrainte
        </button>
      </div>

      <button
        onClick={() => onSolve(problem)}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Résoudre
      </button>
    </div>
  );
};