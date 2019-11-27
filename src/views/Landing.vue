<template>
  <div class="landing flex--center">
    <div class="landing__content">
      <h1>歡迎使用<br />BIM 自主查驗系統</h1>

      <form @submit.prevent>
        <ul class="form">
          <li class="form__items flex--center">
            <label class="form__items__title">帳號</label>
            <input type="text" class="form__items__cells" placeholder="請輸入信箱"
              v-model="account "/>
          </li>
          <li class="form__items flex--center">
            <label class="form__items__title">密碼</label>
            <input type="password" class="form__items__cells" v-model="password" />
          </li>
          <li class="form__items flex--center">
            <p class="text text--hint" @click="switchSignIn">{{ hintText }}</p>
          </li>
          <li class="form__items form__items__footer flex--center" v-if="isSignIn">
            <button class="btn btn__square" @click="signIn">登入</button>
          </li>
          <li class="form__items form__items__footer flex--center" v-else>
            <button class="btn btn__square" @click="signUp">註冊</button>
            <button class="btn btn__square" @click="signIn">訪客登入</button>
          </li>
          <li class="form__items flex--center">
            <p class="text text--danger" v-if="errorText">{{ errorText }}</p>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fireAuthSignUp, fireAuthSignIn } from '../config/db'

export default {
  name: 'Landing',
  data () {
    return {
      account: '',
      password: '',
      isSignIn: true,
      errorText: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    hintText () {
      return (this.isSignIn) ? '還沒有帳號？' : '已有帳號'
    }
  },
  methods: {
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
    },
    signIn () {
      this.$emit('loading')
      // TODO: 此時先進loading，如果輸入錯誤，會停在loading畫面
      // TODO: 但如果等確定登入，就不需要loading了

      let email = this.account
      let pwd = this.password
      let vm = this

      fireAuthSignIn(email, pwd).catch(err => {
        vm.distingishError(err.code)
      })
    },
    signUp () {
      let email = this.account
      let pwd = this.password
      let vm = this

      fireAuthSignUp(email, pwd).catch(err => {
        vm.distingishError(err.code)
      })
    },
    switchSignIn () {
      this.isSignIn = !this.isSignIn
    }
  }
}
</script>

<style lang="sass" scoped>
.landing
  height: 100vh

.form__items
  &__title
    width: 3.5rem
  &__cells
    width: 100%
  &__footer

.btn__square
  &:hover
    border-color: $bd_input_focus

.text
  margin: 0
  display: inline-block
  font-size: 0.8rem
  &--hint
    cursor: pointer
    &:hover
      transform: translateY(-1px)
  &--danger
    color: $text_warning
</style>