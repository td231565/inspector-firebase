<template>
  <div id="app">
    <component :is="viewPath" @loading="gotoLoading"/>
  </div>
</template>

<script>
import { fireAuth } from './config/db'
import { mapState, mapMutations, mapActions } from 'vuex'
import Home from './views/Home'
import Landing from './views/Landing'
import Loading from './views/Loading'

export default {
  name: 'app',
  components: {
    Home,
    Landing,
    Loading
  },
  data () {
    return {
      viewPath: null
    }
  },
  computed: {
    ...mapState({
      userAuth: state => state.userState.userAuth,
    })
  },
  methods: {
    gotoHome () {
      this.viewPath = Home
    },
    gotoLanding () {
      this.viewPath = Landing
    },
    gotoLoading () {
      this.viewPath = Loading
    },
    ...mapMutations({
      setUserAuth: 'setUserAuth',
      setUserInfo: 'setUserInfo'
    }),
    ...mapActions({
      detectUserGroup: 'detectUserGroup'
    }),
    watchState () {
      let vm = this

      fireAuth.onAuthStateChanged(userAuth => {
        if (userAuth) {
          console.log(userAuth)
          vm.setUserAuth(userAuth)
          vm.detectUserGroup()
          if (userAuth.displayName) {
            vm.gotoHome()
          }
        } else {
          vm.setUserAuth(null)
          vm.setUserInfo(null)
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