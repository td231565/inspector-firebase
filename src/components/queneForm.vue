<template>
  <div class="popframe popframe--quene flex--center" @click="closePopFrame">
    <ul class="quene form">
      <li class="form__items__header">
        <h3 class="quene__title">待上傳清單</h3>
      </li>
      <li class="form__items" v-if="quene.length === 0">
        <span>無待上傳資料</span>
      </li>
      <li class="form__items"
        v-for="(mission, index) in quene"
        :key="index+1">
        <strong class="form__items__title">{{ index+1 }}.</strong>
        <span>{{ mission.floor }}_{{ mission.issue }}_{{ mission.name }}</span>
      </li>
      <li class="form__items__footer flex--right">
        <span class="connect" :class="{ success: isConnection === true }">{{ connectState }}</span>
        <button class="btn btn__square" @click="checkConnectionOnClick">送出</button>
        <button class="btn btn__square cancel">取消</button>
      </li>
      <div class="btn btn__close" title="關閉"></div>
    </ul>
  </div>
</template>

<script>
import InternetConnection from '../config/connection'
import { checkConnection } from '../config/uploadQuene'

export default {
  name: 'popFrame',
  props: {
    quene: Array
  },
  data () {
    return {
      isConnection: undefined
    }
  },
  computed: {
    connectState () {
      let result = ''
      if (this.isConnection === true) result = '上傳中'
      if (this.isConnection === false) result = '尚未連線'
      return result
    }
  },
  methods: {
    closePopFrame (e) {
      if (e.target.className.match('btn__close') ||
          e.target.className.match('popframe') ||
          e.target.className.match('cancel')) {
        this.$emit('closePop')
      }
      return
    },
    checkConnectionOnClick () {
      this.isConnection = InternetConnection()
      if (!this.isConnection) return
      this.sendQuene()
    },
    sendQuene () {
      checkConnection()
      this.$emit('checkQuene')
    }
  },
  beforeDestroy () {
    this.isConnection = undefined
  }
}
</script>

<style lang="sass" scoped>
.popframe
  width: 100%
  height: 100%
  position: fixed
  top: 0
  left: 0
  background-color: $bg_cover_layer
  box-shadow: inset 0 0 50px #000
  z-index: 9
  .quene
    width: 30%
    height: 80%
    padding: 2rem
    background-color: #fff
    border-radius: 10px
    overflow: auto

    @include ae768
      width: 90%
      height: 90%

    &__title
      margin-top: 0
      text-align: center

.form__items
  padding: 6px 0
  border-bottom: 1px solid $bd_input_default
  &:nth-child(even)
    background-color: $bg_list
  &__title
    width: 3rem

.btn__close
  position: absolute
  top: 10%
  left: 90%

  @include ae768
    top: 10px
    left: calc(100vw - 30px)

.connect
  margin-right: 1rem
  font-size: 0.8rem
  color: $text_warning
  &.success
    color: $text_success
</style>