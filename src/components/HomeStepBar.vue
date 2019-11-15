<template>
  <div class="stepBar">
    <div class="step createNewMarker flex--center" v-if="stepNow === 1">
      <span>請調整畫面至查驗位置或構件，再建立 BIM 視點，並依操作步驟執行。</span>
      <button type="button" class="btn btn__square btn__step" onclick="">建立BIM視點</button>
    </div>

    <div class="step" v-else>
      <section class="step__column step__left">
        <a class="step__column__controls step__column__controls--prev" @click="stepPrev">上一步</a>
        <a class="step__column__controls step__column__controls--next" @click="stepNext">下一步</a>
      </section>

      <section class="step__column step__right">
        <a class="step__column__controls step__column__controls--backToFirst">回列表</a>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepBar',
  props: {
    stepNow: Number
  },
  methods: {
    stepPrev () {
      this.$emit('stepPrev')
    },
    stepNext () {
      this.$emit('stepNext')
    }
  }
}
</script>

<style lang="sass" scoped>
.step
  width: 100%
  height: 50px
  display: flex
  background-color: $bg_stepBar
  &__column
    flex: 1
    padding: 10px
    display: flex
    align-items: center
    &__controls
      height: 2rem
      margin: 0 3px
      padding: 0.5rem 0.8rem
      font-size: 0.8rem
      font-weight: 600
      color: #fff
      background-color: transparent
      border: 0.5px solid #fff
      border-radius: 10px
      box-shadow: 0 1px 1px #fff
      cursor: pointer
      &:hover
        transform: translateY(1px)
        box-shadow: none
      &:active
        color: rgba(#000, 0.7)
        background-color: rgba(#000, 0.2)
  &__left
    justify-content: flex-start
  &__right
    justify-content: flex-end
</style>