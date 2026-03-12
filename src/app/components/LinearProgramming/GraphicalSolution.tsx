// components/LinearProgramming/GraphicalSolution.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Solution } from '@/lib/types/linear-programming';

interface GraphicalSolutionProps {
  solution: Solution;
  width?: number;
  height?: number;
}

export const GraphicalSolution: React.FC<GraphicalSolutionProps> = ({
  solution,
  width = 600,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !solution.optimalPoint) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Dessiner le graphique
    drawGraph(ctx, solution);
  }, [solution]);

  const drawGraph = (ctx: CanvasRenderingContext2D, solution: Solution) => {
    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Trouver les limites du graphique
    const maxX = Math.max(...solution.vertices.map(v => v.x), 10) * 1.1;
    const maxY = Math.max(...solution.vertices.map(v => v.y), 10) * 1.1;

    // Fonction de transformation
    const toCanvasX = (x: number) => padding + (x / maxX) * graphWidth;
    const toCanvasY = (y: number) => height - padding - (y / maxY) * graphHeight;

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner les axes
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;

    // Axe X
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    
    // Axe Y
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Dessiner la région réalisable
    if (solution.feasibleRegion.length > 0) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 150, 255, 0.2)';
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2;

      const region = solution.feasibleRegion[0];
      region.forEach((point, index) => {
        const canvasX = toCanvasX(point.x);
        const canvasY = toCanvasY(point.y);
        
        if (index === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Dessiner les contraintes
    solution.constraints.forEach(constraint => {
      ctx.beginPath();
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 1;

      const [a, b] = constraint.coefficients;
      const c = constraint.rhs;

      if (Math.abs(b) > 1e-10) {
        // y = (c - a*x) / b
        const x1 = 0;
        const y1 = c / b;
        const x2 = maxX;
        const y2 = (c - a * maxX) / b;

        ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
        ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
      } else {
        // x = c / a (vertical line)
        const x = c / a;
        ctx.moveTo(toCanvasX(x), toCanvasY(0));
        ctx.lineTo(toCanvasX(x), toCanvasY(maxY));
      }
      
      ctx.stroke();

      // Ajouter le texte de la contrainte
      ctx.font = '12px Arial';
      ctx.fillStyle = '#ff4444';
      const labelX = toCanvasX(maxX * 0.8);
      const labelY = toCanvasY((c - a * maxX * 0.8) / b);
      ctx.fillText(`${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}y ${constraint.operator} ${c}`, labelX, labelY - 5);
    });

    // Dessiner le point optimal
    if (solution.optimalPoint) {
      const optX = toCanvasX(solution.optimalPoint.x);
      const optY = toCanvasY(solution.optimalPoint.y);

      ctx.beginPath();
      ctx.fillStyle = '#00ff00';
      ctx.arc(optX, optY, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ajouter le texte de la solution
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText(
        `Optimal: (${solution.optimalPoint.x.toFixed(2)}, ${solution.optimalPoint.y.toFixed(2)}) = ${solution.optimalValue?.toFixed(2)}`,
        optX + 15,
        optY - 15
      );
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md  text-black">
      <h3 className="text-xl font-bold mb-4">Solution Graphique</h3>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded"
      />
      
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h4 className="font-semibold mb-2">Résultats:</h4>
        {solution.isInfeasible ? (
          <p className="text-red-600">Le problème est infaisable</p>
        ) : solution.isUnbounded ? (
          <p className="text-red-600">Le problème est non borné</p>
        ) : solution.optimalPoint ? (
          <>
            <p>Point optimal: ({solution.optimalPoint.x.toFixed(2)}, {solution.optimalPoint.y.toFixed(2)})</p>
            <p>Valeur optimale: {solution.optimalValue?.toFixed(2)}</p>
            <p>Type: {solution.objectiveType === 'maximize' ? 'Maximisation' : 'Minimisation'}</p>
          </>
        ) : null}
      </div>
    </div>
  );
};