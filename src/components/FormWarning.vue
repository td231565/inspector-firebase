<template>
  <div class="warning flex--center">
    <div class="warning__content">
      <h3 class="warning__content__header">警告</h3>

      <div class="warning__content__text">
        <p>確定要刪除此查驗點嗎？</p>
        <p class="danger">注意：此動作無法回復</p>
      </div>

      <div class="warning__content__btns">
        <button class="check">確定</button>
        <button class="check">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopWarning',

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
    padding: 3rem
    color: #fff
    background-color: rgba(#000, 0.8)

.danger
  color: red
  font-size: 0.8rem
</style>