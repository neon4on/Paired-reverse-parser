import { Injectable } from '@nestjs/common';

export type CellValue = number | 'diamond';

export interface Cell {
  opened: boolean;
  value: CellValue | null;
}

@Injectable()
export class GameService {
  private board: Cell[][] = [];
  private currentPlayer = 1;
  private playersDiamonds: { [key: number]: number } = { 1: 0, 2: 0 };
  private totalDiamonds: number = 0;

  createGame(N: number, M: number) {
    if (N < 1 || N > 6) {
      throw new Error('Не верный размер поля, только от 1 до 6');
    }
    if (M < 1 || M > N * N) {
      throw new Error('Неверное количество алмазом, только меньше, либо равно N * N');
    }

    this.totalDiamonds = M;
    this.playersDiamonds = { 1: 0, 2: 0 };
    this.currentPlayer = 1;

    // Инициализация доски
    this.board = Array.from({ length: N }, () =>
      Array.from({ length: N }, () => ({ opened: false, value: null }))
    );

    let placed = 0;
    while (placed < M) {
      const i = Math.floor(Math.random() * N);
      const j = Math.floor(Math.random() * N);
      if (this.board[i][j].value === null) {
        this.board[i][j].value = 'diamond';
        placed++;
      }
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (this.board[i][j].value !== 'diamond') {
          this.board[i][j].value = this.countAdjacentDiamonds(i, j, N);
        }
      }
    }

    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      playersDiamonds: this.playersDiamonds,
      gameOver: false,
      winner: null,
    };
  }

  countAdjacentDiamonds(i: number, j: number, N: number): number {
    let count = 0;
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        if (di === 0 && dj === 0) continue;
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < N && nj >= 0 && nj < N) {
          if (this.board[ni][nj].value === 'diamond') {
            count++;
          }
        }
      }
    }
    return count;
  }

  makeMove(row: number, col: number) {
    if (this.board[row][col].opened) {
      return null;
    }

    this.board[row][col].opened = true;
    const cellValue = this.board[row][col].value;

    if (cellValue === 'diamond') {
      this.playersDiamonds[this.currentPlayer]++;
    } else {
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    const totalFound = this.playersDiamonds[1] + this.playersDiamonds[2];
    let gameOver = false;
    let winner: number | null = null;
    if (totalFound === this.totalDiamonds) {
      gameOver = true;
      // Определяем победителя
      if (this.playersDiamonds[1] > this.playersDiamonds[2]) {
        winner = 1;
      } else if (this.playersDiamonds[2] > this.playersDiamonds[1]) {
        winner = 2;
      } else {
        winner = 0;
      }
    }

    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      playersDiamonds: this.playersDiamonds,
      gameOver,
      winner,
    };
  }
}
