<template>
  <GuiDash/>
</template>

<script>
import GuiDash from './components/GuiDash.vue'

export default {
  name: 'App',
  components: {
    GuiDash
  },
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
