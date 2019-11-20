<template>
  <div class="stepBar">
    <div class="step createNewMarker flex--center" v-if="stepNow === 1">
      <span>請調整畫面至查驗位置或構件，再建立 BIM 視點，並依操作步驟執行。</span>
      <a class="btn btn__square step__column__controls" onclick="">建立BIM視點</a>
    </div>

    <div class="step" v-else>
      <section class="step__column flex--left">
        <a class="btn btn__square step__column__controls" @click="stepPrev">上一步</a>
        <a class="btn btn__square step__column__controls" @click="stepNext">下一步</a>
      </section>

      <section class="step__column flex--right">
        <a class="btn btn__square step__column__controls" @click="stepToFirst">回列表</a>
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
    },
    stepToFirst () {
      this.$emit('stepToFirst')
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

  @include ae768
    font-size: 0.8rem

  &__column
    flex: 1
    padding: 10px
    display: flex
    align-items: center
    &__controls
      font-weight: 600
      background-color: transparent
      box-shadow: 0 1px 1px #fff
      &:hover
        transform: translateY(1px)
        box-shadow: none
      &:active
        color: rgba(#000, 0.7)
        background-color: rgba(#000, 0.2)
</style>