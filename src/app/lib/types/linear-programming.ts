// types/linear-programming.ts
export interface Constraint {
    id: string;
    coefficients: number[]; // [a, b] for ax + by ≤ c
    operator: '<=' | '>=' | '=';
    rhs: number;
  }
  
  export interface Objective {
    coefficients: number[]; // [c1, c2] for maximize/minimize c1x + c2y
    type: 'maximize' | 'minimize';
  }
  
  export interface Problem {
    id?: string;
    name: string;
    objective: Objective;
    constraints: Constraint[];
    variables: number; // nombre de variables (2 pour graphique)
    nonNegativity: boolean; // x ≥ 0, y ≥ 0 par défaut
  }
  
  export interface Point {
    x: number;
    y: number;
  }
  
  export interface Solution {
    optimalPoint: Point | null;
    optimalValue: number | null;
    feasibleRegion: Point[][]; // polygone de la région réalisable
    vertices: Point[];
    isFeasible: boolean;
    isUnbounded: boolean;
    isInfeasible: boolean;
    constraints: Constraint[];
    objectiveCoeff: number[];
    objectiveType: 'maximize' | 'minimize';
  }