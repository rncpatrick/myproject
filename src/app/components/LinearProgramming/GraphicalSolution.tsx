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
    let minX = 0;
    let minY = 0;
    let maxX = Math.max(...solution.vertices.map(v => v.x), 10);
    let maxY = Math.max(...solution.vertices.map(v => v.y), 10);
    
    solution.constraints.forEach(c => {
      const [a, b] = c.coefficients;
      const rhs = c.rhs;
      
      if (Math.abs(a) > 1e-10) {
        const xIntercept = rhs / a;
        if (xIntercept < minX) minX = xIntercept;
        if (xIntercept > maxX) maxX = xIntercept;
      }
      if (Math.abs(b) > 1e-10) {
        const yIntercept = rhs / b;
        if (yIntercept < minY) minY = yIntercept;
        if (yIntercept > maxY) maxY = yIntercept;
      }
    });
    
    const rangeX = Math.max(Math.abs(maxX), Math.abs(minX), 10);
    const rangeY = Math.max(Math.abs(maxY), Math.abs(minY), 10);
    
    return { 
      minX: -rangeX * 0.25,
      maxX: rangeX * 1.2,
      minY: -rangeY * 0.25,
      maxY: rangeY * 1.2
    };
  };

  // Fonction pour formater les nombres proprement
  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.01) return '0';
    if (Math.abs(num) < 1) return num.toFixed(2);
    return num.toFixed(1);
  };

  const drawGraph = (ctx: CanvasRenderingContext2D, solution: Solution) => {
    const { width: w, height: h } = dimensions;
    const padding = 70;
    const graphWidth = w - 2 * padding;
    const graphHeight = h - 2 * padding;
    const { minX, maxX, minY, maxY } = calculateBounds(solution);
    
    const toX = (x: number) => padding + ((x - minX) / (maxX - minX)) * graphWidth;
    const toY = (y: number) => padding + ((maxY - y) / (maxY - minY)) * graphHeight;

    const originX = toX(0);
    const originY = toY(0);

    // Effacer avec un fond blanc propre
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // === LIGNES DES AXES PRINCIPAUX (épaisses et visibles) ===
    ctx.beginPath();
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2.5;
    // Axe X
    ctx.moveTo(padding, originY);
    ctx.lineTo(w - padding, originY);
    // Axe Y
    ctx.moveTo(originX, padding);
    ctx.lineTo(originX, h - padding);
    ctx.stroke();

    // Flèches des axes
    ctx.fillStyle = '#1a1a2e';
    // Flèche X (droite)
    ctx.beginPath();
    ctx.moveTo(w - padding - 12, originY - 5);
    ctx.lineTo(w - padding, originY);
    ctx.lineTo(w - padding - 12, originY + 5);
    ctx.fill();
    // Flèche Y (haut)
    ctx.beginPath();
    ctx.moveTo(originX - 5, padding + 12);
    ctx.lineTo(originX, padding);
    ctx.lineTo(originX + 5, padding + 12);
    ctx.fill();

    // Labels des axes
    ctx.font = 'bold 15px "Inter", Arial, sans-serif';
    ctx.fillStyle = '#1a1a2e';
    ctx.fillText('x', w - padding + 8, originY + 5);
    ctx.fillText('y', originX + 8, padding - 8);

    // === GRILLE TRÈS LÉGÈRE (optionnelle, seulement quelques lignes) ===
    ctx.beginPath();
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 0.5;
    
    // Seulement 5 lignes horizontales et 5 verticales maximum
    const xTicks = Math.min(5, Math.ceil((maxX - minX) / 2));
    const yTicks = Math.min(5, Math.ceil((maxY - minY) / 2));
    
    const xStep = (maxX - minX) / xTicks;
    for (let i = 1; i <= xTicks; i++) {
      const x = minX + i * xStep;
      const xPos = toX(x);
      if (xPos >= padding && xPos <= w - padding && Math.abs(x) > 0.01) {
        ctx.moveTo(xPos, padding);
        ctx.lineTo(xPos, h - padding);
        ctx.stroke();
      }
    }
    
    const yStep = (maxY - minY) / yTicks;
    for (let i = 1; i <= yTicks; i++) {
      const y = minY + i * yStep;
      const yPos = toY(y);
      if (yPos >= padding && yPos <= h - padding && Math.abs(y) > 0.01) {
        ctx.moveTo(padding, yPos);
        ctx.lineTo(w - padding, yPos);
        ctx.stroke();
      }
    }

    // === TICS ET COORDONNÉES SUR LES AXES ===
    ctx.font = '12px "Inter", Arial, sans-serif';
    ctx.fillStyle = '#555';
    
    // Tics sur l'axe X (positifs et négatifs)
    const xMarkers = [];
    for (let x = Math.ceil(minX); x <= maxX; x += Math.ceil(maxX / 6)) {
      if (Math.abs(x) > 0.01) xMarkers.push(x);
    }
    if (xMarkers.length === 0) xMarkers.push(maxX / 2);
    
    xMarkers.forEach(x => {
      const xPos = toX(x);
      if (xPos >= padding && xPos <= w - padding) {
        // Petit tic
        ctx.beginPath();
        ctx.moveTo(xPos, originY - 5);
        ctx.lineTo(xPos, originY + 5);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Valeur coordonnée
        const formattedX = formatNumber(x);
        const xOffset = formattedX.length * 3;
        ctx.fillStyle = '#555';
        ctx.fillText(formattedX, xPos - xOffset, originY + (x > 0 ? -8 : 18));
      }
    });
    
    // Tics sur l'axe Y (positifs et négatifs)
    const yMarkers = [];
    for (let y = Math.ceil(minY); y <= maxY; y += Math.ceil(maxY / 6)) {
      if (Math.abs(y) > 0.01) yMarkers.push(y);
    }
    if (yMarkers.length === 0) yMarkers.push(maxY / 2);
    
    yMarkers.forEach(y => {
      const yPos = toY(y);
      if (yPos >= padding && yPos <= h - padding) {
        // Petit tic
        ctx.beginPath();
        ctx.moveTo(originX - 5, yPos);
        ctx.lineTo(originX + 5, yPos);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Valeur coordonnée
        const formattedY = formatNumber(y);
        ctx.fillStyle = '#555';
        ctx.fillText(formattedY, originX - (y > 0 ? 28 : 32), yPos + 4);
      }
    });

    // Valeur zéro à l'origine
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 12px "Inter", Arial, sans-serif';
    ctx.fillText('0', originX - 8, originY + (originY > h/2 ? -8 : 18));

    // === CONTOURS DE LA RÉGION RÉALISABLE ===
    if (solution.feasibleRegion.length > 0) {
      ctx.beginPath();
      const region = solution.feasibleRegion[0];
      region.forEach((p, i) => {
        if (i === 0) ctx.moveTo(toX(p.x), toY(p.y));
        else ctx.lineTo(toX(p.x), toY(p.y));
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
      ctx.fill();
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.stroke();
    }

    // === DROITES DES CONTRAINTES ===
    const colors = ['#e74c3c', '#e67e22', '#27ae60', '#8e44ad', '#1abc9c', '#c0392b'];
    
    solution.constraints.forEach((constraint, idx) => {
      const [a, b] = constraint.coefficients;
      const c = constraint.rhs;
      
      ctx.beginPath();
      ctx.strokeStyle = colors[idx % colors.length];
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 6]);
      
      let points = [];
      
      if (Math.abs(b) > 1e-10) {
        const x1 = minX;
        const x2 = maxX;
        const y1 = (c - a * x1) / b;
        const y2 = (c - a * x2) / b;
        
        if (y1 >= minY && y1 <= maxY) points.push({ x: x1, y: y1 });
        if (y2 >= minY && y2 <= maxY) points.push({ x: x2, y: y2 });
        
        const yMinIntersect = (c - a * ((c - b * minY) / a)) / b;
        if (yMinIntersect >= minX && yMinIntersect <= maxX) {
          points.push({ x: (c - b * minY) / a, y: minY });
        }
        const yMaxIntersect = (c - b * maxY) / a;
        if (yMaxIntersect >= minX && yMaxIntersect <= maxX) {
          points.push({ x: yMaxIntersect, y: maxY });
        }
      } else if (Math.abs(a) > 1e-10) {
        const x = c / a;
        if (x >= minX && x <= maxX) {
          points.push({ x, y: minY });
          points.push({ x, y: maxY });
        }
      }
      
      points = points.filter((p, i, arr) => 
        i === arr.findIndex(p2 => Math.abs(p2.x - p.x) < 0.01 && Math.abs(p2.y - p.y) < 0.01)
      );
      
      if (points.length >= 2) {
        ctx.moveTo(toX(points[0].x), toY(points[0].y));
        points.slice(1).forEach(p => ctx.lineTo(toX(p.x), toY(p.y)));
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
      
      // Légende de la contrainte
      const equation = `${a.toFixed(1)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(1)}y ${constraint.operator} ${c.toFixed(1)}`;
      ctx.font = '11px "Inter", Arial, sans-serif';
      ctx.fillStyle = colors[idx % colors.length];
      ctx.shadowBlur = 0;
      
      let labelX = toX(maxX * 0.65);
      let labelY = toY((c - a * maxX * 0.65) / b);
      labelX = Math.min(Math.max(labelX, padding + 15), w - padding - 100);
      labelY = Math.min(Math.max(labelY, padding + 25), h - padding - 15);
      ctx.fillText(equation, labelX, labelY);
    });

    // === SOMMETS ===
    solution.vertices.forEach(vertex => {
      const xPos = toX(vertex.x);
      const yPos = toY(vertex.y);
      
      ctx.beginPath();
      ctx.fillStyle = '#f39c12';
      ctx.arc(xPos, yPos, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.fillStyle = '#2c3e50';
      ctx.font = '11px "Inter", Arial, sans-serif';
      ctx.fillText(`(${formatNumber(vertex.x)}, ${formatNumber(vertex.y)})`, xPos + 8, yPos - 6);
    });

    // === POINT OPTIMAL (mis en évidence) ===
    if (solution.optimalPoint) {
      const optX = toX(solution.optimalPoint.x);
      const optY = toY(solution.optimalPoint.y);
      
      // Cercle extérieur (halo)
      ctx.beginPath();
      ctx.fillStyle = '#2ecc71';
      ctx.arc(optX, optY, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(optX, optY, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Lignes de projection vers les axes (discrètes)
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 1.2;
      ctx.moveTo(optX, originY);
      ctx.lineTo(optX, optY);
      ctx.lineTo(originX, optY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label du point optimal
      ctx.font = 'bold 12px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#27ae60';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `★ Optimal (${formatNumber(solution.optimalPoint.x)}, ${formatNumber(solution.optimalPoint.y)})`,
        optX + 15,
        optY - 12
      );
      
      // Valeur de la fonction objectif
      ctx.font = 'bold 11px "Inter", Arial, sans-serif';
      ctx.fillStyle = '#1a7a37';
      ctx.fillText(
        `Z = ${solution.optimalValue?.toFixed(2)}`,
        optX + 15,
        optY
      );
    }
  };

  return (
    <div ref={containerRef} className="w-full p-4 bg-white rounded-xl shadow-lg text-black">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">📈 Solution graphique</h3>
      
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border border-gray-200 rounded-lg shadow-sm w-full h-auto bg-white"
        style={{ display: 'block' }}
      />
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-md mb-3 text-gray-700">📊 Résultats</h4>
        {solution.isInfeasible ? (
          <p className="text-red-600">⚠️ Problème infaisable</p>
        ) : solution.isUnbounded ? (
          <p className="text-orange-600">⚠️ Problème non borné</p>
        ) : solution.optimalPoint ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500">Point optimal</span>
              <p className="font-mono font-semibold text-green-700">
                ({formatNumber(solution.optimalPoint.x)}, {formatNumber(solution.optimalPoint.y)})
              </p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500">Valeur optimale Z</span>
              <p className="font-mono font-bold text-blue-700">{solution.optimalValue?.toFixed(4)}</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500">Type</span>
              <p className="font-medium text-purple-700">{solution.objectiveType === 'maximize' ? 'Maximisation' : 'Minimisation'}</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500">Sommets</span>
              <p className="font-medium text-gray-700">{solution.vertices.length}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};