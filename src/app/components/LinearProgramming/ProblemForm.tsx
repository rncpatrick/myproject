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
      coefficients: [4, 1],
      type: 'minimize'
    },
    constraints: [
      { id: '1', coefficients: [4, 1], operator: '>=', rhs: 8 },
      { id: '2', coefficients: [1, 4], operator: '>=', rhs: 8 },
      { id: '3', coefficients: [7, 10], operator: '>=', rhs: 47 }
    ],
    variables: 2,
    nonNegativity: true
  });

  const [showModel, setShowModel] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

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

  const handleSolve = () => {
    setCurrentProblem(problem);
    setShowModel(true);
    onSolve(problem);
  };

  const getOperatorSymbol = (operator: string): string => {
    switch (operator) {
      case '<=': return '≤';
      case '>=': return '≥';
      default: return '=';
    }
  };

  // Fonction pour formater une expression sans afficher les coefficients nuls
  const formatExpression = (coeffs: number[], variables: string[] = ['x', 'y']): string => {
    const terms = coeffs.map((coeff, idx) => {
      if (coeff === 0) return null;
      const variable = variables[idx];
      if (coeff === 1) return variable;
      if (coeff === -1) return `-${variable}`;
      return `${coeff}${variable}`;
    }).filter(term => term !== null);
    
    if (terms.length === 0) return '0';
    
    // Joindre les termes avec des signes +
    let expression = terms.join(' + ');
    // Remplacer '+ -' par '- '
    expression = expression.replace(/\+ -/g, '- ');
    return expression;
  };

  // Fonction pour formater une contrainte
  const formatConstraint = (coeffs: number[], operator: string, rhs: number): string => {
    const leftSide = formatExpression(coeffs);
    if (leftSide === '0' && rhs === 0) return '0 = 0';
    return `${leftSide} ${getOperatorSymbol(operator)} ${rhs}`;
  };

  // Fonction pour formater la fonction objectif
  const formatObjective = (coeffs: number[], type: string): string => {
    const expression = formatExpression(coeffs);
    return `${type === 'maximize' ? 'MAX' : 'MIN'} Z = ${expression}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nom du problème</label>
        <input
          type="text"
          value={problem.name}
          onChange={(e) => setProblem({ ...problem, name: e.target.value })}
          className="w-full p-2 border rounded text-sm font-medium"
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

      {/* Section Contraintes avec flex row - le modèle à droite */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Contraintes</h3>
        
        {/* Container flex row pour les contraintes et le modèle */}
        <div className="flex gap-4">
          {/* Colonne gauche : Liste des contraintes */}
          <div className="flex-1">
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
                <span>x </span><span> +</span>
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

          {/* Colonne droite : Modèle mathématique (visible après résolution) */}
          <div className="w-80">
            {showModel && currentProblem && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h4 className="font-bold text-md mb-3 text-gray-700 border-b pb-2">📐 Modèle</h4>
                <div className="space-y-2 text-sm font-mono">
                  {/* Fonction objectif sans coefficients nuls */}
                  <div className="text-indigo-700 font-semibold">
                    {formatObjective(currentProblem.objective.coefficients, currentProblem.objective.type)}
                  </div>
                  
                  <div className="text-gray-600 text-xs mt-2">S.c. :</div>
                  
                  {/* Contraintes sans coefficients nuls */}
                  {currentProblem.constraints.map((constraint, idx) => {
                    const formatted = formatConstraint(
                      constraint.coefficients, 
                      constraint.operator, 
                      constraint.rhs
                    );
                    // Ne pas afficher les contraintes vides (0 = 0)
                    if (formatted !== '0 = 0') {
                      return (
                        <div key={idx} className="text-gray-700">
                          {formatted}
                        </div>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Non-négativité */}
                  {currentProblem.nonNegativity && (
                    <div className="text-gray-700">x, y ≥ 0</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSolve}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Résoudre
      </button>
    </div>
  );
};