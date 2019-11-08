<template>
  <div class="home">
    <span>請選擇查驗目標</span>
    <select name="" id=""></select>
    <div class="user flex--right">
      <span>您好，</span>
      <span class="user__name">{{ username }}</span>
      <button class="form__btn--submit" @click="signout">登出</button>
    </div>

    <iframe :src="viewerSrc" frameborder="0" ref="iframe" id="viewerIframe"></iframe>
  </div>
</template>

<script>
// import SignIn from '@/components/SignIn.vue'
import { db, fireAuth } from '../config/db'
import { mapState } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      modelPath: 'dxbim/fb8da11f09f542b4b344338aea29d771/83ce08590d0844ed8e171ae8a44a596f/1771ca6b1cc54dfb955fad322a23f23d.asm',
      viewerServerHost: 'https://viewer.ctc.com.tw',
      modelList: []
    }
  },
  firestore: {
    modelList: db.collection('markersData').doc('gugci_d')
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    username () {
      let name = '訪客'
      if (this.userInfo) name = this.userInfo.name
      return name
    },
    viewerSrc () {
      return this.viewerServerHost + '/viewer.html?path=' + this.modelPath
    },
    iframeWindow () {
      return this.$refs.iframe.contentWindow
    }
  },
  methods: {
    signout () {
      fireAuth.signOut().then(() => {
        console.log('sign out')
      }).catch(err => {
        console.log(err.code)
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="sass" scoped>
.user__name
  cursor: pointer
</style>