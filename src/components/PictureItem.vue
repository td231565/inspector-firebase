<template>
  <li class="photos__item">
    <div class="photos__item__block photos__item__block--picture flex--center" @click="choosePhoto">
      <img class="photos__item__block__img" :src="pictureImg" alt="">
      <button class="btn btn__delete" title="刪除圖片" @click="deletePicture"></button>
    </div>
    <textarea class="photos__item__text" placeholder="請輸入抽查意見"
      v-model="pictureText"></textarea>

    <PopFrame :photo="pictureImg" @closePop="unChoosePhoto" v-if="isChoosed" />
  </li>
</template>

<script>
import PopFrame from './PopFrame'

export default {
  name: 'PhotoItem',
  components: {
    PopFrame
  },
  props: {
    picture: Array
  },
  data () {
    return {
      isChoosed: false
    }
  },
  computed: {
    combinePhotoText () {
      return [this.pictureImg, this.pictureText]
    },
    pictureImg () {
      return this.picture[0]
    },
    pictureText: {
      get () {
        return this.picture[1]
      },
      set (val) {
        return val
      }
    }
  },
  methods: {
    choosePhoto (e) {
      if (e.target.className.match('btn__delete')) return
      this.isChoosed = true
    },
    unChoosePhoto () {
      this.isChoosed = false
    },
    savePhotoText () {
      this.$emit('savePhotoText', this.combinePhotoText)
    },
    deletePicture () {
      let imgUrl = this.pictureImg
      this.$emit('deletePicture', imgUrl)
    }
  },
  mounted () {

  },
  deactivated () {
    this.savePhotoText()
  }
}
</script>

<style lang="sass" scoped>
.photos
  &__item
    margin: 0.4%
    &__block
      &--picture
        flex-wrap: wrap
        img
          max-width: 100%
          display: block // 消除 img 底部與 div 間的空白
        .btn__delete
          position: absolute
          top: 5px
          right: 5px
    &__text
      width: 100%
      height: 60px
      margin-top: 8px
      padding: 6px
      border-radius: 10px
</style>