<template>
  <div id="app" :class="{ allowScroll: isPrint}">
    <component :is="viewPath"
      :errorCode="errorCodeFromAuth"
      @loading="gotoLoading"
      @signIn="signIn"
      @signUp="signUp"
      @guess="gotoHome"
      @signOutGuess="gotoLanding"
      @gotoPrint="gotoPrint"
      @finishPrint="gotoHome" />
    <!-- <Print v-if="isPrint" v-show="true" /> -->
    <Loading v-if="isLoading" />
  </div>
</template>

<script>
import { fireAuth, fireAuthSignUp, fireAuthSignIn } from './config/db'
import { mapState, mapMutations, mapActions } from 'vuex'
import Home from './views/Home'
import Landing from './views/Landing'
import Loading from './views/Loading'
import Print from './views/Print'

export default {
  name: 'app',
  components: {
    Home,
    Landing,
    Loading,
    Print
  },
  data () {
    return {
      viewPath: null,
      errorCodeFromAuth: '',
      isPrint: false
    }
  },
  computed: {
    ...mapState({
      userAuth: state => state.userState.userAuth,
      isLoading: state => state.systemState.isLoading,
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
    gotoPrint () {
      this.viewPath = Print
      this.isPrint = true
    },
    ...mapMutations({
      setUserAuth: 'setUserAuth',
      setUserInfo: 'setUserInfo'
    }),
    ...mapActions({
      detectUserGroup: 'detectUserGroup',
      // getMarkerList: 'getMarkerList'
    }),
    watchUserState () {
      let vm = this

      // 登入狀態有'變化'才會反應
      fireAuth.onAuthStateChanged(userAuth => {
        if (userAuth) {
          // 無狀態 -> 登入
          // console.log(userAuth)
          vm.setUserAuth(userAuth)
          vm.detectUserGroup()
          if (userAuth.displayName) vm.gotoHome()
        } else {
          // 登入 -> 登出
          vm.setErrorCode(undefined)
          vm.setUserAuth(null)
          vm.setUserInfo(null)
          vm.gotoLanding()
        }
        return userAuth
      })
    },
    setErrorCode (errorCode) {
      this.errorCodeFromAuth = errorCode
    },
    signIn (profile) {
      let vm = this
      fireAuthSignIn(profile.email, profile.pwd).catch(err => {
        console.log(err.code)
        vm.setErrorCode(err.code)
        vm.gotoLanding()
      })
      vm.$emit('loading')
    },
    signUp (profile) {
      let vm = this
      fireAuthSignUp(profile).catch(err => {
        vm.setErrorCode(err.code)
        vm.gotoLanding()
      }).then(uid => {
        // console.log(uid)
        if (uid) vm.gotoHome()
      })
    },
    distingishError (err) {
      let vm = this
      switch (err) {
        case 'auth/wrong-password':
          vm.errorText = '密碼錯誤'
          break
        case 'auth/user-not-found':
          vm.errorText = '尚未註冊'
          break
        case 'auth/email-already-in-use':
          vm.errorText = '此信箱已註冊'
          break
        case 'auth/invalid-email':
          vm.errorText = '信箱格式錯誤'
          break
        case 'auth/weak-password':
          vm.errorText = '密碼需大於6碼'
          break
        default:
          console.log('new error')
          break
      }
    }
  },
  created () {
    // this.getMarkerList()
    this.watchUserState()
    this.isPrint = false
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
  &.allowScroll
    overflow: auto
</style>