// lib/simplex/simplex-solver.ts
import { Problem, Solution, Point } from "../types/linear-programming";
export class SimplexSolver {
    private tableau: number[][] = [];
    private basis: number[] = [];
    private numVariables: number;
    private numConstraints: number;
    private isMaximization: boolean;
  
    constructor(problem: Problem) {
      this.numVariables = 2; // Pour la version graphique
      this.numConstraints = problem.constraints.length;
      this.isMaximization = problem.objective.type === 'maximize';
      this.initializeTableau(problem);
    }
  
    private initializeTableau(problem: Problem): void {
      // Construction du tableau initial
      const tableau: number[][] = [];
      const numSlack = this.numConstraints;
      const totalCols = this.numVariables + numSlack + 1; // +1 pour RHS
  
      // Initialiser les contraintes
      for (let i = 0; i < this.numConstraints; i++) {
        const constraint = problem.constraints[i];
        const row = new Array(totalCols).fill(0);
        
        // Coefficients des variables
        for (let j = 0; j < this.numVariables; j++) {
          row[j] = constraint.coefficients[j] || 0;
        }
        
        // Variable d'écart
        row[this.numVariables + i] = 1;
        
        // RHS
        row[totalCols - 1] = constraint.rhs;
        
        tableau.push(row);
        this.basis.push(this.numVariables + i);
      }
  
      // Ajouter la ligne objectif
      const objRow = new Array(totalCols).fill(0);
      for (let j = 0; j < this.numVariables; j++) {
        objRow[j] = this.isMaximization 
          ? -problem.objective.coefficients[j] 
          : problem.objective.coefficients[j];
      }
      tableau.push(objRow);
  
      this.tableau = tableau;
    }
  
    public solve(): Solution {
      const solution: Solution = {
        optimalPoint: null,
        optimalValue: null,
        feasibleRegion: [],
        vertices: [],
        isFeasible: false,
        isUnbounded: false,
        isInfeasible: false,
        constraints: [],
        objectiveCoeff: [],
        objectiveType: 'maximize'
      };
  
      while (!this.isOptimal()) {
        const pivotCol = this.findPivotColumn();
        
        if (pivotCol === -1) {
          solution.isUnbounded = true;
          return solution;
        }
  
        const pivotRow = this.findPivotRow(pivotCol);
        
        if (pivotRow === -1) {
          solution.isUnbounded = true;
          return solution;
        }
  
        this.pivot(pivotRow, pivotCol);
      }
  
      this.extractSolution(solution);
      solution.isFeasible = true;
      
      return solution;
    }
  
    private isOptimal(): boolean {
      const objRow = this.tableau[this.tableau.length - 1];
      // Vérifier si tous les coefficients dans la ligne objectif sont ≥ 0
      for (let j = 0; j < objRow.length - 1; j++) {
        if (objRow[j] < 0) {
          return false;
        }
      }
      return true;
    }
  
    private findPivotColumn(): number {
      const objRow = this.tableau[this.tableau.length - 1];
      let minIndex = -1;
      let minValue = 0;
  
      for (let j = 0; j < objRow.length - 1; j++) {
        if (objRow[j] < minValue) {
          minValue = objRow[j];
          minIndex = j;
        }
      }
  
      return minIndex;
    }
  
    private findPivotRow(pivotCol: number): number {
      let minRatio = Infinity;
      let pivotRow = -1;
  
      for (let i = 0; i < this.tableau.length - 1; i++) {
        const value = this.tableau[i][pivotCol];
        const rhs = this.tableau[i][this.tableau[i].length - 1];
  
        if (value > 0) {
          const ratio = rhs / value;
          if (ratio < minRatio) {
            minRatio = ratio;
            pivotRow = i;
          }
        }
      }
  
      return pivotRow;
    }
  
    private pivot(pivotRow: number, pivotCol: number): void {
      const pivotValue = this.tableau[pivotRow][pivotCol];
  
      // Normaliser la ligne pivot
      for (let j = 0; j < this.tableau[pivotRow].length; j++) {
        this.tableau[pivotRow][j] /= pivotValue;
      }
  
      // Mettre à jour les autres lignes
      for (let i = 0; i < this.tableau.length; i++) {
        if (i !== pivotRow) {
          const factor = this.tableau[i][pivotCol];
          for (let j = 0; j < this.tableau[i].length; j++) {
            this.tableau[i][j] -= factor * this.tableau[pivotRow][j];
          }
        }
      }
  
      this.basis[pivotRow] = pivotCol;
    }
  
    private extractSolution(solution: Solution): void {
      const solution_point: Point = { x: 0, y: 0 };
      
      // Extraire les valeurs des variables
      for (let i = 0; i < this.basis.length; i++) {
        if (this.basis[i] < 2) { // x ou y
          if (this.basis[i] === 0) {
            solution_point.x = this.tableau[i][this.tableau[i].length - 1];
          } else if (this.basis[i] === 1) {
            solution_point.y = this.tableau[i][this.tableau[i].length - 1];
          }
        }
      }
  
      solution.optimalPoint = solution_point;
      
      // Extraire la valeur optimale
      const objRow = this.tableau[this.tableau.length - 1];
      solution.optimalValue = objRow[objRow.length - 1];
      
      if (!this.isMaximization) {
        solution.optimalValue = -solution.optimalValue;
      }
    }
  }