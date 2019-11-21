<template>
  <div class="step">
    <section class="step__column flex--left">
      <a class="btn btn__square step__column__controls" @click="gotoAddNewMarker" v-if="stepNow === 1">建立查驗點</a>
      <div class="flex--left" v-else>
        <a class="btn btn__square step__column__controls" @click="stepPrev">上一步</a>
        <a class="btn btn__square step__column__controls" @click="stepNext"  v-if="stepNow !== 4">下一步</a>
      </div>
    </section>

    <section class="step__column flex--right">
      <a class="btn btn__square step__column__controls" onclick="" v-if="stepNow === 1">列印報表</a>
      <a class="btn btn__square step__column__controls" @click="stepToFirst" v-else>回列表</a>
    </section>
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
    },
    gotoAddNewMarker () {
      this.$emit('gotoAddNewMarker')
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
      color: #fff
      background-color: transparent
      border-color: #fff
      &:hover
        background-color: rgba(#000, 0.2)
      &:active
        color: rgba(#000, 0.6)
</style>