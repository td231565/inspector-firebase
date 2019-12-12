<template>
  <div class="popframe popframe--quene flex--center" @click="closePopFrame">
    <ul class="quene form">
      <li class="form__items">
        <h3 class="quene__title">待上傳清單</h3>
      </li>
      <li class="form__items"
        v-for="(mission, index) in quene"
        :key="index+1">{{ mission.name }}</li>
      <li class="form__items__footer flex--right">
        <span v-if="!isConnection">尚未連線</span>
        <button class="btn btn__square" @click="sendQuene">送出</button>
        <button class="btn btn__square cancel">取消</button>
      </li>
    </ul>
    <div class="btn btn__close" title="關閉"></div>
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
      isConnection: false
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
    stepToFirst () {
      this.$emit('stepToFirst')
    },
    // TODO 做一些判斷讓使用者知道現在狀況，不要直接跳回首頁
    sendQuene () {
      this.isConnection = InternetConnection()
      if (this.isConnection) {
        checkConnection()
        this.$emit('checkQuene')
        this.$emit('closePop')
        this.stepToFirst()
      }
    }
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

.btn__close
  position: absolute
  top: 10%
  left: 90%

  @include ae768
    top: 10px
    left: calc(100vw - 30px)
</style>