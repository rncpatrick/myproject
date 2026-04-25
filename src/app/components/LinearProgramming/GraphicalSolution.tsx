// components/LinearProgramming/GraphicalSolution.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Solution } from '@/lib/types/linear-programming';

interface GraphicalSolutionProps {
  solution: Solution;
  width?: number;
  height?: number;
}

export const GraphicalSolution: React.FC<GraphicalSolutionProps> = ({
  solution,
  width: propWidth,
  height: propHeight
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Adapter la taille du canvas à son parent
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = propHeight || containerWidth * 0.75;
        
        setDimensions({
          width: propWidth || containerWidth,
          height: propHeight || containerHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [propWidth, propHeight]);

  useEffect(() => {
    if (!canvasRef.current || !solution.optimalPoint) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    drawGraph(ctx, solution);
  }, [solution, dimensions]);

  const calculateBounds = (solution: Solution) => {
    let maxX = Math.max(...solution.vertices.map(v => v.x), 10);
    let maxY = Math.max(...solution.vertices.map(v => v.y), 10);
    
    solution.constraints.forEach(c => {
      const [a, b] = c.coefficients;
      const rhs = c.rhs;
      if (Math.abs(a) > 1e-10) maxX = Math.max(maxX, rhs / a);
      if (Math.abs(b) > 1e-10) maxY = Math.max(maxY, rhs / b);
    });
    
    return { maxX: maxX * 1.2, maxY: maxY * 1.2 };
  };

  const drawGraph = (ctx: CanvasRenderingContext2D, solution: Solution) => {
    const { width: w, height: h } = dimensions;
    const padding = 60;
    const graphWidth = w - 2 * padding;
    const graphHeight = h - 2 * padding;
    const { maxX, maxY } = calculateBounds(solution);
    
    const toX = (x: number) => padding + (x / maxX) * graphWidth;
    const toY = (y: number) => h - padding - (y / maxY) * graphHeight;

    // Effacer
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, w, h);

    // Grille
    ctx.beginPath();
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= maxX; i += Math.ceil(maxX / 10)) {
      ctx.moveTo(toX(i), padding);
      ctx.lineTo(toX(i), h - padding);
      ctx.stroke();
      ctx.fillStyle = '#666';
      ctx.font = '11px Arial';
      ctx.fillText(i.toFixed(1), toX(i) - 5, h - padding + 20);
    }
    for (let i = 0; i <= maxY; i += Math.ceil(maxY / 10)) {
      ctx.moveTo(padding, toY(i));
      ctx.lineTo(w - padding, toY(i));
      ctx.stroke();
      ctx.fillStyle = '#666';
      ctx.fillText(i.toFixed(1), padding - 25, toY(i) + 4);
    }

    // Axes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('X', w - padding + 5, h - padding + 5);
    ctx.fillText('Y', padding - 10, padding - 5);

    // Région réalisable
    if (solution.feasibleRegion.length > 0) {
      ctx.beginPath();
      const region = solution.feasibleRegion[0];
      region.forEach((p, i) => {
        if (i === 0) ctx.moveTo(toX(p.x), toY(p.y));
        else ctx.lineTo(toX(p.x), toY(p.y));
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 150, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Dessiner TOUTES les contraintes
    const colors = ['#dc3545', '#fd7e14', '#28a745', '#6f42c1', '#17a2b8', '#e83e8c'];
    
    solution.constraints.forEach((constraint, idx) => {
      const [a, b] = constraint.coefficients;
      const c = constraint.rhs;
      
      ctx.beginPath();
      ctx.strokeStyle = colors[idx % colors.length];
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 5]);
      
      let x1 = 0, y1, x2 = maxX, y2;
      
      if (Math.abs(b) > 1e-10) {
        y1 = (c - a * x1) / b;
        y2 = (c - a * x2) / b;
        
        if (y1 < 0) {
          y1 = 0;
          x1 = (c - b * y1) / a;
        }
        if (y2 < 0) {
          y2 = 0;
          x2 = (c - b * y2) / a;
        }
        if (y1 > maxY) {
          y1 = maxY;
          x1 = (c - b * y1) / a;
        }
        if (y2 > maxY) {
          y2 = maxY;
          x2 = (c - b * y2) / a;
        }
        
        if (x1 >= 0 && x1 <= maxX && y1 >= 0 && y1 <= maxY) {
          ctx.moveTo(toX(x1), toY(y1));
          ctx.lineTo(toX(x2), toY(y2));
        }
      } else if (Math.abs(a) > 1e-10) {
        const x = c / a;
        if (x >= 0 && x <= maxX) {
          ctx.moveTo(toX(x), toY(0));
          ctx.lineTo(toX(x), toY(maxY));
        }
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Afficher l'équation
      let labelX, labelY;
      if (Math.abs(b) > 1e-10) {
        labelX = toX(maxX * 0.6);
        labelY = toY((c - a * maxX * 0.6) / b);
      } else {
        labelX = toX(c / a);
        labelY = toY(maxY * 0.8);
      }
      
      labelX = Math.min(Math.max(labelX, padding + 10), w - padding - 10);
      labelY = Math.min(Math.max(labelY, padding + 20), h - padding - 10);
      
      const equation = `${a.toFixed(1)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(1)}y ${constraint.operator} ${c.toFixed(1)}`;
      ctx.font = '12px Arial';
      ctx.fillStyle = colors[idx % colors.length];
      ctx.fillText(equation, labelX, labelY);
    });

    // Sommets
    solution.vertices.forEach(vertex => {
      ctx.beginPath();
      ctx.fillStyle = '#ffc107';
      ctx.arc(toX(vertex.x), toY(vertex.y), 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#856404';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.fillText(`(${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`, toX(vertex.x) + 8, toY(vertex.y) - 5);
    });

    // Point optimal
    if (solution.optimalPoint) {
      const optX = toX(solution.optimalPoint.x);
      const optY = toY(solution.optimalPoint.y);
      
      ctx.beginPath();
      ctx.fillStyle = '#28a745';
      ctx.arc(optX, optY, 9, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(optX, optY, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.font = 'bold 13px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(
        `Optimal: (${solution.optimalPoint.x.toFixed(2)}, ${solution.optimalPoint.y.toFixed(2)}) = ${solution.optimalValue?.toFixed(2)}`,
        optX + 12,
        optY - 10
      );
    }
  };

  return (
    <div ref={containerRef} className="w-full p-4 bg-white rounded-xl shadow-lg text-black">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">📈 Solution Graphique</h3>
      
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border rounded-lg shadow-md w-full h-auto"
        style={{ display: 'block' }}
      />
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-lg mb-3 text-gray-800">📊 Résultats:</h4>
        {solution.isInfeasible ? (
          <p className="text-red-600">⚠️ Problème infaisable</p>
        ) : solution.isUnbounded ? (
          <p className="text-orange-600">⚠️ Problème non borné</p>
        ) : solution.optimalPoint ? (
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="font-medium">📍 Point optimal:</span>
              <span className="text-green-700">({solution.optimalPoint.x.toFixed(4)}, {solution.optimalPoint.y.toFixed(4)})</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="font-medium">💎 Valeur optimale:</span>
              <span className="text-blue-700 font-bold">{solution.optimalValue?.toFixed(4)}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="font-medium">🎯 Type:</span>
              <span className="text-purple-700">{solution.objectiveType === 'maximize' ? 'Maximisation' : 'Minimisation'}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ✅ {solution.vertices.length} sommets dans la région réalisable
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};