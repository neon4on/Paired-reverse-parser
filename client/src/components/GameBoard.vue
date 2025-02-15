<template>
  <div>
    <h2>Игровое поле</h2>

    <div style="margin-bottom: 10px;">
      <div v-if="!gameOver">
        <span v-if="currentPlayer === 1" style="color: blue;">Ход 1 игрока</span>
        <span v-else style="color: red;">Ход 2 игрока</span>
      </div>
      <div v-else style="color: green;">
        <span v-if="winner === 0">Ничья!</span>
        <span v-else>Победил {{ winner }} игрок</span>
      </div>
    </div>

    <table>
      <tr v-for="(row, rowIndex) in board" :key="rowIndex">
        <td
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          @click="openCell(rowIndex, colIndex)"
          class="cell"
        >
          <span v-if="cell.opened">
            <img
              v-if="cell.value === 'diamond'"
              src="@/assets/diamond.png"
              alt="Алмаз"
            />
            <span v-else>{{ cell.value }}</span>
          </span>
          <span v-else>?</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: "GameBoard",
  props: {
    N: {
      type: Number,
      default: 3,
    },
    M: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      board: [],
      currentPlayer: 1,
      gameOver: false,
      winner: null,
      socket: null,
    };
  },
  methods: {
    startGame() {
      console.log("GameBoard.vue: Emitting startGame with", {
        N: this.N,
        M: this.M,
      });
      if (this.socket) {
        this.socket.emit("startGame", { N: this.N, M: this.M });
      } else {
        console.log("GameBoard.vue: Socket not available!");
      }
    },
    openCell(row, col) {
      if (!this.board[row][col] || this.board[row][col].opened) return;
      if (this.gameOver) return; // если игра закончена, не обрабатываем ход
      console.log("GameBoard.vue: Emitting makeMove for cell", row, col);
      this.socket.emit("makeMove", { row, col });
    },
  },
  watch: {
    N(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(`N changed from ${oldVal} to ${newVal}`);
        this.startGame();
      }
    },
    M(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(`M changed from ${oldVal} to ${newVal}`);
        this.startGame();
      }
    },
  },
  mounted() {
    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("GameBoard.vue: Socket connected");
      this.startGame();
    });
    this.socket.on("connect_error", (error) => {
      console.log("GameBoard.vue: Error connecting to WebSocket:", error);
    });
    this.socket.on("move", (gameState) => {
      console.log("GameBoard.vue: Received game state:", gameState);
      this.board = gameState.board;
      this.currentPlayer = gameState.currentPlayer;
      this.gameOver = gameState.gameOver;
      this.winner = gameState.winner;
    });
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  margin: 0 auto;
}
td {
  width: 40px;
  height: 40px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #000;
  cursor: pointer;
}
td:hover {
  background-color: lightgray;
}
img {
  width: 30px;
  height: 30px;
}
</style>
