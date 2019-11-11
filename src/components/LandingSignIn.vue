<template>
  <div class="signin">
    <h1>歡迎使用<br />BIM 自主查驗系統</h1>
    <form @submit.prevent>
      <ul class="form">
        <li class="form__items">
          <label class="form__items__title">帳號：</label>
          <input type="text" class="form__items__input" placeholder="請輸入信箱"
            v-model="account "/>
        </li>
        <li class="form__items">
          <label class="form__items__title">密碼：</label>
          <input type="password" class="form__items__input"
            v-model="password" />
        </li>
        <li class="form__items__footer" v-if="isSignIn">
          <button class="form__btn--submit" @click="signin">登入</button>
        </li>
        <li class="form__items__footer" v-else>
          <button class="form__btn--submit" @click="signup">註冊</button>
          <button class="form__btn--submit" @click="signin">訪客登入</button>
        </li>
      </ul>
    </form>
    <p class="text--hint" @click="switchSignIn" v-if="isSignIn">還沒有帳號？</p>
    <p class="text--hint" @click="switchSignIn" v-else>已有帳號</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fireAuthSignUp, fireAuth } from '../config/db'
// import { format } from 'date-fns'

export default {
  name: 'SignIn',
  data () {
    return {
      account: '',
      password: '',
      isSignIn: true
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    signin () {
      let vm = this
      let email = vm.account
      let pwd = vm.password

      fireAuth.signInWithEmailAndPassword(email, pwd).then(() => {
        console.log(vm.userInfo)
      }).catch(err => {
        console.log(err.code)
      })
    },
    signup () {
      let vm = this
      let email = vm.account
      let pwd = vm.password

      fireAuthSignUp(email, pwd)
    },
    switchSignIn () {
      this.isSignIn = !this.isSignIn
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
.form__items__title
  width: 4rem

.text--hint
  margin: 0
  display: inline-block
  font-size: 0.8rem
  cursor: pointer
  &:hover
    transform: translateY(-1px)
</style>
