// lib/graphical/graphical-solver.ts
import { Constraint, Problem, Point, Solution } from "../types/linear-programming";
export class GraphicalSolver {
    private constraints: Constraint[];
    private objectiveCoeff: number[];
    private objectiveType: 'maximize' | 'minimize';
    private bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  
    constructor(problem: Problem) {
      this.constraints = problem.constraints;
      this.objectiveCoeff = problem.objective.coefficients;
      this.objectiveType = problem.objective.type;
      this.bounds = this.calculateBounds();
    }
  
    private calculateBounds(): { xMin: number; xMax: number; yMin: number; yMax: number } {
      let xMax = 100;
      let yMax = 100;
      const xMin = 0;
      const yMin = 0;
  
      // Calculer les bornes basées sur les contraintes
      this.constraints.forEach(constraint => {
        const [a, b] = constraint.coefficients;
        const c = constraint.rhs;
  
        if (a !== 0) {
          const xIntercept = c / a;
          if (xIntercept > 0 && xIntercept < xMax) {
            xMax = Math.min(xMax, xIntercept * 1.2);
          }
        }
        if (b !== 0) {
          const yIntercept = c / b;
          if (yIntercept > 0 && yIntercept < yMax) {
            yMax = Math.min(yMax, yIntercept * 1.2);
          }
        }
      });
  
      return { xMin, xMax, yMin, yMax };
    }
  
    public solve(): Solution {
      const vertices = this.findVertices();
      const feasibleVertices = this.filterFeasibleVertices(vertices);
      
      if (feasibleVertices.length === 0) {
        return {
          optimalPoint: null,
          optimalValue: null,
          feasibleRegion: [],
          vertices: [],
          isFeasible: false,
          isUnbounded: false,
          isInfeasible: true,
          constraints: this.constraints,
          objectiveCoeff: this.objectiveCoeff,
          objectiveType: this.objectiveType
        };
      }
  
      const solution = this.evaluateVertices(feasibleVertices);
      solution.feasibleRegion = [this.generateFeasibleRegion(feasibleVertices)];
      solution.vertices = feasibleVertices;
      
      return solution;
    }
  
    private findVertices(): Point[] {
      const vertices: Point[] = [];
      const numConstraints = this.constraints.length;
  
      // Intersections des contraintes entre elles
      for (let i = 0; i < numConstraints; i++) {
        for (let j = i + 1; j < numConstraints; j++) {
          const intersection = this.findIntersection(
            this.constraints[i],
            this.constraints[j]
          );
          if (intersection) {
            vertices.push(intersection);
          }
        }
  
        // Intersections avec les axes
        const axisIntersections = this.findAxisIntersections(this.constraints[i]);
        vertices.push(...axisIntersections);
      }
  
      // Ajouter l'origine si elle est réalisable
      vertices.push({ x: 0, y: 0 });
  
      return this.removeDuplicates(vertices);
    }
  
    private findIntersection(c1: Constraint, c2: Constraint): Point | null {
      const [a1, b1] = c1.coefficients;
      const [a2, b2] = c2.coefficients;
      const c1_rhs = c1.rhs;
      const c2_rhs = c2.rhs;
  
      const determinant = a1 * b2 - a2 * b1;
      
      if (Math.abs(determinant) < 1e-10) {
        return null; // Les droites sont parallèles
      }
  
      const x = (c1_rhs * b2 - c2_rhs * b1) / determinant;
      const y = (a1 * c2_rhs - a2 * c1_rhs) / determinant;
  
      return { x, y };
    }
  
    private findAxisIntersections(constraint: Constraint): Point[] {
      const intersections: Point[] = [];
      const [a, b] = constraint.coefficients;
      const c = constraint.rhs;
  
      // Intersection avec l'axe X (y = 0)
      if (a !== 0) {
        const x = c / a;
        if (x >= 0) {
          intersections.push({ x, y: 0 });
        }
      }
  
      // Intersection avec l'axe Y (x = 0)
      if (b !== 0) {
        const y = c / b;
        if (y >= 0) {
          intersections.push({ x: 0, y });
        }
      }
  
      return intersections;
    }
  
    private filterFeasibleVertices(vertices: Point[]): Point[] {
      return vertices.filter(vertex => 
        this.isPointFeasible(vertex) &&
        vertex.x >= 0 && 
        vertex.y >= 0
      );
    }
  
    private isPointFeasible(point: Point): boolean {
      return this.constraints.every(constraint => {
        const value = constraint.coefficients[0] * point.x + 
                     constraint.coefficients[1] * point.y;
        
        switch (constraint.operator) {
          case '<=':
            return value <= constraint.rhs + 1e-10;
          case '>=':
            return value >= constraint.rhs - 1e-10;
          case '=':
            return Math.abs(value - constraint.rhs) < 1e-10;
          default:
            return true;
        }
      });
    }
  
    private evaluateVertices(vertices: Point[]): Solution {
      let bestVertex: Point | null = null;
      let bestValue = this.objectiveType === 'maximize' ? -Infinity : Infinity;
  
      vertices.forEach(vertex => {
        const value = this.objectiveCoeff[0] * vertex.x + 
                     this.objectiveCoeff[1] * vertex.y;
  
        if (this.objectiveType === 'maximize' && value > bestValue) {
          bestValue = value;
          bestVertex = vertex;
        } else if (this.objectiveType === 'minimize' && value < bestValue) {
          bestValue = value;
          bestVertex = vertex;
        }
      });
  
      return {
        optimalPoint: bestVertex,
        optimalValue: bestValue,
        feasibleRegion: [],
        vertices,
        isFeasible: true,
        isUnbounded: false,
        isInfeasible: false,
        constraints: this.constraints,
        objectiveCoeff: this.objectiveCoeff,
        objectiveType: this.objectiveType
      };
    }
  
    private generateFeasibleRegion(vertices: Point[]): Point[] {
      // Trier les vertices pour former un polygone (tri par angle polaire)
      const center = {
        x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
        y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
      };
  
      return vertices.sort((a, b) => {
        const angleA = Math.atan2(a.y - center.y, a.x - center.x);
        const angleB = Math.atan2(b.y - center.y, b.x - center.x);
        return angleA - angleB;
      });
    }
  
    private removeDuplicates(points: Point[]): Point[] {
      const unique: Point[] = [];
      const tolerance = 1e-10;
  
      points.forEach(point => {
        const isDuplicate = unique.some(p => 
          Math.abs(p.x - point.x) < tolerance && 
          Math.abs(p.y - point.y) < tolerance
        );
  
        if (!isDuplicate) {
          unique.push(point);
        }
      });
  
      return unique;
    }
  }