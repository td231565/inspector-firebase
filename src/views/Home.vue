<template>
  <div class="home">
    <h1>Main</h1>
    <button class="form__btn--submit" @click="signout">登出</button>
  </div>
</template>

<script>
// import SignIn from '@/components/SignIn.vue'
import { fireAuth } from '../config/db'

export default {
  name: 'home',
  methods: {
    signout () {
      fireAuth.signOut().then(() => {
        console.log('sign out')
      }).catch(err => {
        console.log(err.code)
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>