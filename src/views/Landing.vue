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
            <button class="btn btn__square" @click="signInGuess">訪客登入</button>
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
      errorText: '',
      rules: {
        email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        phone: /^09[0-9]{8}$/,
        pwd: /^.{7,30}$/ 
      }
    }
  },
  computed: {
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
    detectInputFormat () {
      this.errorText = ''
      let isCorrect = true

      ;(this.rules.phone.test(this.phone)) ? null : this.errorText = '手機號碼需為09開頭的10碼數字'
      ;this.name ? null : this.errorText = '名字不可為空白'
      ;(this.rules.pwd.test(this.password)) ? null : this.errorText = '密碼需大於6位數'
      ;(this.rules.email.test(this.account)) ? null : this.errorText = 'email 格式錯誤'
      if (this.errorText) isCorrect = false

      return isCorrect
    },
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
      let checkPhoneCorrect = this.detectInputFormat()
      if (checkPhoneCorrect) {
        this.$emit('loading')
        this.$emit('signUp', this.profile)
      }
    },
    signInGuess () {
      this.$emit('guess')
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