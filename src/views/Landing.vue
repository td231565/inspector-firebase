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

          <div v-if="!isSignIn">
            <li class="form__items flex--center">
              <label class="form__items__title">姓名</label>
              <input type="text" class="form__items__cells" v-model="name" />
            </li>
            <li class="form__items flex--center">
              <label class="form__items__title">手機</label>
              <input type="text" class="form__items__cells" v-model="phone" />
            </li> 
          </div>

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
// import { mapState } from 'vuex'

export default {
  name: 'Landing',
  props: {
    errorCode: String
  },
  data () {
    return {
      account: '',
      password: '',
      name: '',
      phone: '',
      isSignIn: true,
      errorText: ''
    }
  },
  computed: {
    // ...mapState({
    //   userInfo: state => state.userInfo
    // }),
    hintText () {
      return (this.isSignIn) ? '還沒有帳號？' : '我有帳號'
    },
    profile () {
      return {
        email: this.account,
        pwd: this.password,
        name: this.name,
        phone: this.phone
      }
    }
  },
  methods: {
    distingishError (err) {
      if (!err) return

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
        case 'auth/too-many-requests':
          vm.errorText = '操作次數過於頻繁，請稍後再試'
          break
        default:
          console.log('new error: ' + err)
          break
      }
    },
    signIn () {
      this.$emit('loading')
      this.$emit('signIn', this.profile)
    },
    signUp () {
      this.$emit('signUp', this.profile)
    },
    switchSignIn () {
      this.isSignIn = !this.isSignIn
    }
  },
  mounted () {
    let errorCode = this.errorCode
    this.distingishError(errorCode)
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