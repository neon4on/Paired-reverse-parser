<template>
  <div id="app">
    <GameInput @start="handleStart" />
    <!-- Передаём параметры N и M в GameBoard, а также получаем его ссылку для прямого вызова метода -->
    <GameBoard ref="gameBoard" :N="N" :M="M" />
  </div>
</template>

<script>
import GameInput from "./components/GameInput.vue";
import GameBoard from "./components/GameBoard.vue";

export default {
  name: "App",
  components: {
    GameInput,
    GameBoard,
  },
  data() {
    return {
      N: 3,
      M: 3,
    };
  },
  methods: {
    handleStart({ N, M }) {
      console.log("App.vue: Received start event with:", N, M);
      this.N = N;
      this.M = M;
      console.log("App.vue: Updated parameters to:", this.N, this.M);
      // Вызываем метод startGame у компонента GameBoard, чтобы пересоздать игру с новыми параметрами
      if (this.$refs.gameBoard && this.$refs.gameBoard.startGame) {
        console.log("App.vue: Calling startGame on GameBoard");
        this.$refs.gameBoard.startGame();
      }
    },
  },
};
</script>

<style>
#app {
  text-align: center;
}
</style>
