<template>
  <div class="step">
    <section class="step__column step__left">
      <button class="step__column__controls step__column__controls--prev">上一步</button>
    </section>

    <section class="step__column step__right">
      <button class="step__column__controls step__column__controls--backToFirst">回列表</button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'step bar'
}
</script>

<style lang="sass" scoped>
.step
  width: 100%
  height: 60px
  display: flex
  background-color: $bg_stepBar
  &__column
    flex: 1
    padding: 10px
    display: flex
    justify-content: flex-start
    align-items: center
    border: 1px solid red
    &__controls
      height: 2rem
      padding: 0 0.8rem
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
</style>