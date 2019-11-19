<template>
  <div id="app">
    <!-- <Loading v-if="isLoading" /> -->
    <!-- <Home v-else-if="isSignIn" /> -->
    <!-- <Landing v-else /> -->
    <router-view/>
    <PopFrame :photo="choosedPhoto" v-if="isChoosed" />
  </div>
</template>

<script>
import { fireAuth } from './config/db'
import { mapState } from 'vuex'
import PopFrame from './components/PopFrame'

export default {
  name: 'app',
  components: {
    PopFrame
  },
  data () {
    return {
      
    }
  },
  computed: {
    ...mapState({
      userAuth: state => state.userState.userAuth,
      choosedPhoto: state => state.systemState.choosedPhoto
    }),
    isChoosed () {
      return (this.choosedPhoto) ? true : false
    }
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
          if (userAuth.displayName) {
            vm.gotoHome()
          }
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
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: $text_defalt
  height: 100vh
  background-size: cover
  background-image: url(./assets/contact_bg.jpg)
  overflow: hidden

#nav
  a
    font-weight: bold
    color: $text_defalt
    &.router-link-exact-active
      color: $text_link
</style>