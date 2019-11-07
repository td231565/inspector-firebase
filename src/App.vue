<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Landing</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
import { fireAuth } from './config/db'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      userAuth: state => state.userAuth
    })
  },
  methods: {
    gotoHome () {
      this.$router.push('/home')
    },
    gotoLanding () {
      this.$router.push('/landing')
    },
    watchState () {
      let vm = this
      let store = vm.$store

      fireAuth.onAuthStateChanged(userAuth => {
        if (userAuth) {
          console.log(userAuth)
          store.commit('setUserAuth', userAuth)
          store.dispatch('detectUserGroup')
          vm.gotoHome()
        } else {
          store.commit('setUserAuth', null)
          store.commit('setUserInfo', null)
          vm.gotoLanding()
        }
        return userAuth
      })
    }
  },
  created () {
    this.watchState()
  }
}
</script>

<style lang="sass">
@import './sass/_variables'
@import './sass/_elements'
@import './sass/_base'

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: $dark_blue_defalt
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  background-size: cover
  background-image: url(./assets/contact_bg.jpg)

#nav
  // padding: 30px
  border-bottom: 1px solid $grey
  a
    font-weight: bold
    color: $dark_blue_defalt
    &.router-link-exact-active
      color: $light_green

</style>
