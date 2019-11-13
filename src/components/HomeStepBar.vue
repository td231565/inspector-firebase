<template>
  <div class="step">
    <section class="step__column step__left">
      <a class="step__column__controls step__column__controls--prev">上一步</a>
    </section>

    <section class="step__column step__right">
      <a class="step__column__controls step__column__controls--backToFirst">回列表</a>
    </section>
  </div>
</template>

<script>
export default {
  name: 'StepBar'
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
    // border: 1px solid red
    &__controls
      height: 2rem
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