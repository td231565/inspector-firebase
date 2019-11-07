<template>
  <div class="home">
    <SignIn />
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
  height: calc(100vh - 20px)
  display: flex
  justify-content: center
  align-items: center
  background-size: cover
  background-image: url(../assets/contact_bg.jpg)
</style>