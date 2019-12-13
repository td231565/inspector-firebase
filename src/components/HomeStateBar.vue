<template>
  <div class="state">
    <div class="state__column state__column__left"></div>

    <div class="state__column state__column__middle state__model">
      <label class="form__items__title" v-if="!isSmallScreen">請選擇查驗目標</label>
      <select class="form__items__cells" @change="selectModel" v-model="currentModelName">
        <option :value="model"
          v-for="(model, index) in modelList.models"
          :key="index+1"
          >{{ model }}</option>
      </select>
    </div>

    <div class="state__column state__column__right">
      <div class="state__quene flex--right" @click="switchQuene" v-if="queneLength !== 0">
        {{ isAddMissionToQuene }}
        <div class="state__quene__icon"
          title="待上傳清單"
          :data-quene="queneLength"></div>
      </div>
      <div class="state__user flex--right">
        <span>您好，</span>
        <span class="state__user__name">{{ username }}</span>
        <button class="btn btn__square" @click="signout">登出</button>
      </div>
    </div>
    
    <QueneForm v-if="showQuene"
      :quene="quene"
      @closePop="switchQuene"
      @checkQuene="checkQuene" />
  </div>
</template>

<script>
import InternetConnection from '../config/connection'
import { db, fireAuth } from '../config/db'
import { mapState, mapMutations, mapActions } from 'vuex'
import { quene } from '../config/uploadQuene'
import QueneForm from './queneForm'

export default {
  name: 'stateBar',
  components: {
    QueneForm
  },
  props: {
    isAddMissionToQuene: Boolean
  },
  data () {
    return {
      modelList: [],
      currentModelName: '',
      isSmallScreen: false,
      quene: quene,
      showQuene: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userState.userInfo,
      modelName: state => state.modelState.modelName,
      modelPath: state => state.modelState.modelPath
    }),
    username () {
      return (this.userInfo) ? this.userInfo.name : '訪客'
    },
    queneLength () {
      return this.quene.length
    }
  },
  methods: {
    ...mapMutations({
      setModelPath: 'setModelPath',
      setModelName: 'setModelName'
    }),
    ...mapActions({
      getMarkerList: 'getMarkerList'
    }),
    signout () {
      if (!this.userInfo) this.$emit('signOutGuess')
      fireAuth.signOut()
    },
    selectModel () {
      let vm = this
      let modelName = vm.currentModelName
      db.collection('markersData').doc('gugci_d')
        .collection(modelName).doc('modelInfo').get().then(doc => {
          let modelPath = doc.data().modelPath
          this.setModelPath(modelPath)
          this.setModelName(modelName)
        })
    },
    detectDeviceWidth () {
      if (screen.width < 768) this.isSmallScreen = true
    },
    switchQuene () {
      this.showQuene = !this.showQuene
    },
    checkQuene () {
      let connection = InternetConnection()
      if (!connection) return

      if (this.quene.length !== 0) {
        console.log('get quene ...')
        setTimeout(() => {
          this.quene = quene
          return this.checkQuene()
        }, 1000)
      } else {
        console.log('quene is empty')
        this.quene = quene
        this.getMarkerList()
        this.FinishAddingMissionToQuene()
      }
    },
    FinishAddingMissionToQuene () {
      this.$emit('FinishAddingMissionToQuene')
    }
  },
  watch: {
    modelList (/* modelList */) {
      // this.currentModelName = modelList.models[0]
      this.currentModelName = this.modelName
    },
    isAddMissionToQuene () {
      this.quene = quene
      this.checkQuene()
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
      font-weight: 600
      color: $text_strong
      // cursor: pointer
  &__quene
    cursor: pointer
    &__icon
      width: 1.6rem
      height: 1.6rem
      position: relative
      background-image: url(../assets/document.svg)
      background-size: cover
      &::after
        @extend .pseudo
        width: 15px
        height: 15px
        padding-top: 2px
        position: absolute
        top: -1px
        left: -2px
        content: attr(data-quene)
        font-size: 0.6rem
        color: #fff
        background-color: red
        border-radius: 99rem

.form__items
  &__title, &__cells
    width: 50%

.btn
  height: auto
  padding: 0 4px
  border: none
  &:hover
    color: #fff
    background-color: $bg_cover_layer
</style>