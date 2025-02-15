<template>
  <div>
    <h2>Игровое поле</h2>
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
      console.log("GameBoard.vue: Emitting makeMove for cell", row, col);
      this.socket.emit("makeMove", { row, col });
    },
  },
  watch: {
    // Добавляем watcher, который будет реагировать на изменения пропсов N и M
    N(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(`N changed from ${oldVal} to ${newVal}`);
        this.startGame(); // Перезапускаем игру с новыми значениями
      }
    },
    M(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(`M changed from ${oldVal} to ${newVal}`);
        this.startGame(); // Перезапускаем игру с новыми значениями
      }
    },
  },
  mounted() {
    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("GameBoard.vue: Socket connected");
      this.startGame(); // При первом подключении запускаем игру
    });
    this.socket.on("connect_error", (error) => {
      console.log("GameBoard.vue: Error connecting to WebSocket:", error);
    });
    this.socket.on("move", (gameState) => {
      console.log("GameBoard.vue: Received game state:", gameState);
      this.board = gameState.board;
      this.currentPlayer = gameState.currentPlayer;
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
