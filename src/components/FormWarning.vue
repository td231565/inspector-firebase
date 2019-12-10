<template>
  <div class="warning flex--center">
    <div class="warning__content">
      <div class="warning__content__column warning__content__column__left flex--center">
        <img class="warning__content__image" src="../assets/warning.svg" alt="warning">
      </div>

      <div class="warning__content__column warning__content__column__right">
        <h2 class="warning__content__header">警告</h2>

        <div class="warning__content__text">
          <p>確定要刪除此查驗點嗎？</p>
          <p class="danger">注意：此動作無法回復</p>
        </div>

        <div class="warning__content__controls flex--center">
          <button class="btn btn__square btn__square--danger" @click="doDelete">確定</button>
          <button class="btn btn__square" @click="cancelDelete">取消</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { markersDB } from '../config/db'

export default {
  name: 'PopWarning',
  computed: {
    ...mapState({
      modelName: state => state.modelState.modelName,
      selectedMarkerData: state => state.modelState.selectedMarkerData
    })
  },
  methods: {
    doDelete () {
      let id = this.selectedMarkerData.id
      let modelName = this.modelName

      markersDB.collection(modelName).doc(id).delete()
      .then(() => {
        console.log('delete data successful')
        this.$emit('revealWarning', null)
        this.$emit('stepToFirst')
      }).catch(err => {
        console.log(err.code)
        this.$emit('revealWarning', '刪除失敗')
      })
    },
    cancelDelete () {
      this.$emit('revealWarning', null)
    }
  }
}
</script>

<style lang="sass" scoped>
.warning
  width: 100%
  height: 100%
  position: fixed
  top: 0
  left: 0
  background-color: $bg_cover_layer
  box-shadow: inset 0 0 5rem #000
  z-index: 9
  &__content
    padding: 2rem 3rem
    // color: #fff
    background-color: #fff
    border: 3px solid $bd_btn_default
    display: flex
    &__column
      &__left
        flex: 1
      &__right
        flex: 1.5
    &__header
      margin-top: 0
    &__image
      width: 100%


.danger
  color: red
  font-size: 0.8rem
</style>