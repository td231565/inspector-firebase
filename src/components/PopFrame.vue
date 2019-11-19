<template>
  <div class="popframe popframe--picture flex--center" @click="closePopFrame">
    <div class="popframe__item">
      <img class="popframe__item__image" :src="photo" alt="現場照片">
    </div>
    <div class="btn btn__close" title="關閉圖片"></div>
  </div>
</template>

<script>
export default {
  name: 'popFrame',
  props: {
    photo: String
  },
  methods: {
    closePopFrame (e) {
      if (e.target.className === 'popframe__item') return
      this.$store.commit('setChoosedPhoto', null)
    }
  }
}
</script>

<style lang="sass" scoped>
.popframe
  width: 100%
  height: 100%
  position: absolute
  top: 0
  left: 0
  background-color: rgba(0,0,0,0.6)
  box-shadow: inset 0 0 50px #000
  z-index: 9
  &__item
    max-width: 80%
    max-height: 80%
    overflow: auto

    @include ae768
      max-width: 100vw
      max-height: 90vh

.btn__close
  position: absolute
  top: 10%
  left: 90%

  @include ae768
    top: 0
    left: calc(100vw - 30px)
</style>