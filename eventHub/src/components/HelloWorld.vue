<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="increment">Counter: {{ count }}</button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const message = ref('Hello Vue 3 + TypeScript!')
    const count = ref(0)

    function increment() {
      count.value++
    }

    return { message, count, increment }
  }
})
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
