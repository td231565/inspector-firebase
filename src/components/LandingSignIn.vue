<template>
  <div class="signin">
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
          <p class="text--hint" @click="switchSignIn">{{ textHint }}</p>
        </li>
        <li class="form__items form__items__footer flex--center" v-if="isSignIn">
          <button class="btn btn__square" @click="signin">登入</button>
        </li>
        <li class="form__items form__items__footer flex--center" v-else>
          <button class="btn btn__square" @click="signup">註冊</button>
          <button class="btn btn__square" @click="signin">訪客登入</button>
        </li>
      </ul>
    </form>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fireAuthSignUp, fireAuth } from '../config/db'

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
    }),
    textHint () {
      return (this.isSignIn) ? '還沒有帳號？' : '已有帳號'
    }
  },
  methods: {
    signin () {
      this.$emit('loading')

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

<style scoped lang="scss">
.form__items {
  &__title {
    width: 3.5rem;
  }
  &__cells {
    width: 100%;
  }
  // &__footer
}

.btn__square {
  &:hover {
    border-color: $bd_input_focus;
  }
}

.text--hint {
  margin: 0;
  display: inline-block;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    transform: translateY(-1px);
  }
}
</style>
