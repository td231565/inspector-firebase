<template>
  <div class="home">
    <SignIn msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SignIn from '@/components/SignIn.vue'

export default {
  name: 'home',
  components: {
    SignIn
  }
}
</script>

<style lang="sass" scoped>
.home
  background-image: url(../assets/contact_bg.jpg)
</style>