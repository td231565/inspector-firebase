<template>
  <div class="state">
    <span>請選擇查驗目標</span>
    <select class="select" @change="selectModel" v-model="currentModelName">
      <option class="select__option"
        v-for="model in modelList.models" :key="modelList.models.indexOf(model)"
        :value="model">{{ model }}</option>
    </select>
    <div class="user flex--right">
      <span>您好，</span>
      <span class="user__name">{{ username }}</span>
      <button class="form__btn--submit" @click="signout">登出</button>
    </div>
  </div>
</template>

<script>
import { db, fireAuth } from '../config/db'
import { mapState } from 'vuex'

export default {
  name: 'stateBar',
  data () {
    return {
      modelList: [],
      currentModelName: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userState.userInfo,
      modelName: state => state.modelState.modelName,
      modelPath: state => state.modelState.modelPath
    }),
    username () {
      let name = '訪客'
      if (this.userInfo) name = this.userInfo.name
      return name
    }
  },
  methods: {
    signout () {
      fireAuth.signOut().then(() => {
        console.log('sign out')
      }).catch(err => {
        console.log(err.code)
      })
    },
    selectModel () {
      let vm = this
      let modelName = vm.currentModelName
      db.collection('markersData').doc('gugci_d')
        .collection(modelName).doc('modelInfo').get().then(doc => {
          let modelPath = doc.data().modelPath
          vm.$store.commit('setModelPath', modelPath)
          vm.$store.commit('setModelName', modelName)
        })
    }
  },
  watch: {
    modelList (modelList) {
      this.currentModelName = modelList.models[0]
    }
  },
  created () {
    this.$bind('modelList', db.collection('markersData').doc('gugci_d'))
  }
}
</script>

<style lang="sass" scoped>
.select
  margin-left: 8px
  padding: 4px

.user__name
  cursor: pointer
</style>