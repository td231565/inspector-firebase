<template>
  <div class="state">
    <div class="state__column state__column__left"></div>

    <div class="state__column state__column__middle state__model">
      <label class="form__items__title" v-if="!isSmallScreen">請選擇查驗目標</label>
      <select class="form__items__cells" @change="selectModel" v-model="currentModelName">
        <option :value="model"
          v-for="model in modelList.models"
          :key="modelList.models.indexOf(model)"
          >{{ model }}</option>
      </select>
    </div>

    <div class="state__column state__column__right state__user">
      <span>您好，</span>
      <span class="state__user__name">{{ username }}</span>
      <button class="btn btn__square" @click="signout">登出</button>
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
      currentModelName: '',
      isSmallScreen: false
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
    },
    detectDeviceWidth () {
      if (screen.width < 768) this.isSmallScreen = true
    }
  },
  watch: {
    modelList (modelList) {
      this.currentModelName = modelList.models[0]
    }
  },
  created () {
    this.$bind('modelList', db.collection('markersData').doc('gugci_d'))
    this.detectDeviceWidth()
  }
}
</script>

<style lang="sass" scoped>
.state
  padding: 4px
  display: flex

  @include ae768
    font-size: 0.8rem

  &__column
    flex: 1
    display: flex
    align-items: center
    &__left
      @include ae768
        flex: 0
    &__middle
      @include ae768
        justify-content: flex-start
    &__right
      justify-content: flex-end
  &__user
    &__name
      color: $text_link
      // cursor: pointer

.form__items
  &__title, &__cells
    width: 50%

.btn
  &:hover
    border-color: $bd_input_focus
</style>