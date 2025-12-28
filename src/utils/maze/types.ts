export type Direction = 'top' | 'right' | 'bottom' | 'left'

export type AlgorithmKey = 'dfs' | 'prim' | 'kruskal' | 'division'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface MazeCell {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

export interface MazeGrid {
  width: number
  height: number
  cells: MazeCell[]
  start: number
  end: number
}

export interface MazeSolution {
  visitedOrder: number[]
  path: number[]
}

