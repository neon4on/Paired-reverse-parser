<template>
  <div>
    <h2>Настройка игры</h2>
    <form @submit.prevent="onStart">
      <div>
        <label for="N">Размер поля (N):</label>
        <input type="number" id="N" v-model.number="N" min="1" max="6" required />
      </div>
      <div>
        <label for="M">Количество алмазов (M):</label>
        <input type="number" id="M" v-model.number="M" min="1" required />
      </div>
      <button type="submit">Начать игру</button>
    </form>
    <div v-if="errorMessage" style="color: red; margin-top: 10px;">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "GameInput",
  data() {
    return {
      N: 3,
      M: 3,
      errorMessage: "",
    };
  },
  methods: {
    onStart() {
      // Проверяем, что количество алмазов не превышает общее количество клеток
      if (this.M > this.N * this.N) {
        this.errorMessage = `Неверное количество алмазов. Для поля ${this.N}x${this.N} максимум может быть ${this.N * this.N} алмазов.`;
        return;
      }
      this.errorMessage = "";
      console.log("GameInput.vue: Emitting start event with", this.N, this.M);
      this.$emit("start", { N: this.N, M: this.M });
    },
  },
};
</script>

<style scoped>
form {
  margin-bottom: 20px;
}
</style>
